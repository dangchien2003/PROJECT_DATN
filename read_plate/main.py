import math
import os
import cv2
import numpy as np
import Preprocess
from flask import Flask, request, jsonify
import base64
from flask_cors import CORS
import time
import requests
import threading

app = Flask(__name__)
CORS(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

# lấy ra thư mục hiện tại
current_directory = os.getcwd()

#  đọc nhãn
npaClassifications = np.loadtxt(
    current_directory + "/training/classifications.txt", np.float32
)

# đọc dữ liệu mẫu
npaFlattenedImages = np.loadtxt(
    current_directory + "/training/flattened_images.txt", np.float32
)

# khởi tạo nhãn
npaClassifications = npaClassifications.reshape((npaClassifications.size, 1))

# khởi tạo mô hình
kNearest = cv2.ml.KNearest_create()

# đưa dữ liệu vào mô hình
kNearest.train(npaFlattenedImages, cv2.ml.ROW_SAMPLE, npaClassifications)

Min_char = 0.01
Max_char = 0.09

RESIZED_IMAGE_WIDTH = 20
RESIZED_IMAGE_HEIGHT = 30


def response(success, plate, message):
    return jsonify({"success": success, "plate": plate, "message": message})


show = False


def showImage(name, image):
    if show:
        cv2.imshow(name, image)

        # Đợi người dùng nhấn phím bất kỳ để đóng cửa sổ
        cv2.waitKey(0)

        # Đóng tất cả cửa sổ
        cv2.destroyAllWindows()


def reTraining():
    global kNearest
    npaClassifications = np.loadtxt(
        current_directory + "/training/classifications.txt", np.float32
    )
    npaFlattenedImages = np.loadtxt(
        current_directory + "/training/flattened_images.txt", np.float32
    )
    npaClassifications = npaClassifications.reshape(
        (npaClassifications.size, 1)
    )  # reshape numpy array to 1d, necessary to pass to call to train
    kNearest = cv2.ml.KNearest_create()  # instantiate KNN object
    kNearest.train(npaFlattenedImages, cv2.ml.ROW_SAMPLE, npaClassifications)


learn = False


def train(images):
    if learn is False:
        return
    print("Training")
    for idx, image in enumerate(images):
        cv2.imshow(f"Reshaped Image", image)
        key = cv2.waitKey(0)
        if key != 46:
            vector_str = " ".join([f"{x:.18e}" for x in image.flatten()])

            # Định dạng số thực theo kiểu khoa học
            formatted_value = f"{key:.18e}"
            with open(
                current_directory + "/training/classifications.txt",
                "a",
                encoding="utf8",
            ) as f:
                f.writelines(formatted_value + "\n")
                f.close()

            with open(
                current_directory + "/training/flattened_images.txt",
                "a",
                encoding="utf8",
            ) as f:
                f.writelines(vector_str + "\n")
                f.close()
    cv2.destroyAllWindows()
    if len(images) > 0:
        reTraining()


@app.route("/read-text", methods=["POST"])
def read_text():
    data = request.get_json()
    if "image" not in data:
        return response(False, None, "Lỗi ảnh")

    image = data.get("image")

    if image is None:
        return response(False, None, "Lỗi ảnh")

    if image.startswith("data:image"):
        image = image.split(",")[1]

    # Kích thước ảnh scan
    width = 1000
    height = 800

    # Chuyển base64 thành dạng bytes
    image_bytes = base64.b64decode(image)

    # Chuyển bytes thành numpy
    image_np = np.frombuffer(image_bytes, np.uint8)

    # Chuyển sang dạng dữ liệu OpenCV có thể xử lý
    img = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    # Resize ảnh
    img = cv2.resize(img, (width, height))
    showImage("Resized Image", img)  # Hiển thị ảnh resize

    # Tiền xử lý ảnh, lấy ra ảnh xám và ảnh dạng nhị phân
    imgGrayscaleplate, imgThreshplate = Preprocess.preprocess(img)
    showImage("Grayscale Image", imgGrayscaleplate)  # Hiển thị ảnh xám
    showImage("Threshold Image", imgThreshplate)  # Hiển thị ảnh nhị phân

    # Tạo ảnh viền
    canny_image = cv2.Canny(imgThreshplate, 250, 255)
    showImage("Canny Image", canny_image)  # Hiển thị ảnh Canny

    # Tạo ma trận và nối đoạn viền bị thiếu hoặc đứt gãy
    kernel = np.ones((3, 3), np.uint8)
    dilated_image = cv2.dilate(canny_image, kernel, iterations=1)
    showImage("Dilated Image", dilated_image)  # Hiển thị ảnh Dilated

    # Vẽ đường viền => nhận về mảng toạ độ
    contours, _ = cv2.findContours(
        dilated_image, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE
    )
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:10]

    screenCnt = []
    for c in contours:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.06 * peri, True)
        if len(approx) == 4:
            screenCnt.append(approx)

    if len(screenCnt) == 0:
        return response(False, None, "Không tìm thấy biển số"), 200

    plate = ""
    maxlength = 3
    index_img = None

    for index, screenCnt in enumerate(screenCnt):
        imageCnt = cv2.drawContours(img, [screenCnt], -1, (0, 255, 0), 3)
        showImage("Detected Plate Contour", imageCnt)  # Hiển thị đường viền biển số

        (x1, y1) = screenCnt[0, 0]
        (x2, y2) = screenCnt[1, 0]
        (x3, y3) = screenCnt[2, 0]
        (x4, y4) = screenCnt[3, 0]

        array = [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]
        (x1, y1) = array[0]
        (x2, y2) = array[1]

        doi = abs(y1 - y2)
        ke = abs(x1 - x2)
        angle = math.degrees(math.atan(doi / ke))

        # Tạo mask
        mask = np.zeros(imgGrayscaleplate.shape, np.uint8)
        cut = cv2.drawContours(mask, [screenCnt], 0, 255, -1)
        showImage("Mask Cut", cut)  # Hiển thị ảnh mask cut

        (x, y) = np.where(mask == 255)
        (topx, topy) = (np.min(x), np.min(y))
        (bottomx, bottomy) = (np.max(x), np.max(y))

        # Cắt ảnh
        roi = img[topx:bottomx, topy:bottomy]
        showImage("ROI", roi)  # Hiển thị ảnh ROI

        imgThresh = imgThreshplate[topx:bottomx, topy:bottomy]
        ptPlateCenter = (bottomx - topx) / 2, (bottomy - topy) / 2

        if x1 < x2:
            rotationMatrix = cv2.getRotationMatrix2D(ptPlateCenter, -angle, 1.0)
        else:
            rotationMatrix = cv2.getRotationMatrix2D(ptPlateCenter, angle, 1.0)

        roi = cv2.warpAffine(roi, rotationMatrix, (bottomy - topy, bottomx - topx))
        showImage("Rotated ROI", roi)  # Hiển thị ảnh xoay

        imgThresh = cv2.warpAffine(
            imgThresh, rotationMatrix, (bottomy - topy, bottomx - topx)
        )
        roi = cv2.resize(roi, (0, 0), fx=3, fy=3)
        imgThresh = cv2.resize(imgThresh, (0, 0), fx=3, fy=3)

        kerel3 = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        thre_mor = cv2.morphologyEx(imgThresh, cv2.MORPH_DILATE, kerel3)
        showImage("Morphology Image", thre_mor)  # Hiển thị ảnh Morphology
        cont, _ = cv2.findContours(thre_mor, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        char_x_ind = {}
        char_x = []
        height, width, _ = roi.shape
        roiarea = height * width

        for ind, cnt in enumerate(cont):
            (x, y, w, h) = cv2.boundingRect(cont[ind])
            ratiochar = w / h
            char_area = w * h

            # kiểm tra kích thước ký tự
            if (Min_char * roiarea < char_area < Max_char * roiarea) and (
                0.25 < ratiochar < 0.7
            ):
                if x in char_x:
                    x = x + 1
                char_x.append(x)
                char_x_ind[x] = ind

        # sắp xếp lại
        char_x = sorted(char_x)
        first_line = ""
        second_line = ""
        images = []
        for i in char_x:
            # kích thước ký tự
            (x, y, w, h) = cv2.boundingRect(cont[char_x_ind[i]])

            # cắt ký tựu
            imgROI = thre_mor[y : y + h, x : x + w]
            showImage("Character ROI", imgROI)
            # thay đổi kích thước ký tự
            imgROIResized = cv2.resize(
                imgROI, (RESIZED_IMAGE_WIDTH, RESIZED_IMAGE_HEIGHT)
            )

            # chuyển thành mảng 1 chiều
            npaROIResized = imgROIResized.reshape(
                (1, RESIZED_IMAGE_WIDTH * RESIZED_IMAGE_HEIGHT)
            )

            if learn is True:
                char_image = npaROIResized.reshape(
                    (RESIZED_IMAGE_HEIGHT, RESIZED_IMAGE_WIDTH)
                )
                images.append(char_image)

            # chuyển sang dạng float
            npaROIResized = np.float32(npaROIResized)

            # đưa vào mô hình và lấy ra 3 ký tự gần nhất
            _, npaResults, _, _ = kNearest.findNearest(npaROIResized, k=3)

            # chuyển sang dạng ký tự
            strCurrentChar = str(chr(int(npaResults[0][0])))

            # xác định dòng trên hay dưới
            if y < height / 3:
                first_line = (first_line + strCurrentChar).replace(".", "")
            else:
                second_line = (second_line + strCurrentChar).replace(".", "")

        train(images)

        # độ dài ký tự đọc được
        lengthPlate = len(first_line) + len(second_line)

        # lấy ra chuỗi dài nhất
        if lengthPlate > maxlength:
            index_img = index
            maxlength = lengthPlate
            plate = first_line + " " + second_line

    # so sánh điều kiện biển số
    if len(plate) < 5 or index_img is None:
        return (
            response(
                False,
                None,
                "Không tìm thấy biển số",
            ),
            200,
        )

    # hoàn thành đọc biển số
    return response(True, plate, None), 200


@app.route("/hello", methods=["GET"])
def hello():
    return "hello", 200


@app.route("/show/<status>", methods=["GET"])
def updateShow(status):
    global show  # Để có thể cập nhật biến toàn cục
    if status == 1:
        show = True
    elif status == 0:
        show = False
    return f"Show updated to {show}", 200


load = True


def call_api():
    while load:
        time.sleep(240)
        try:
            # Gửi request GET tới API
            response = requests.get("https://ttnt-read-plate.onrender.com/hello")
            if response.status_code == 200:
                print("API call successful:", response)  # Xử lý dữ liệu trả về
            else:
                print(f"Failed to call API. Status code: {response.status_code}")
        except Exception as e:
            print(f"Error occurred: {e}")


api_thread = threading.Thread(target=call_api)

# Bắt đầu luồng
# api_thread.start()

if __name__ == "__main__":
    app.run()
