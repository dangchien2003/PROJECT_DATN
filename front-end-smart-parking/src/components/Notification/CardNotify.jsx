import { useState, useEffect, useRef, useCallback } from "react";
import ItemNotify from "./ItemNotify";
import { checkNotifyViewd } from "@/utils/notify";
import WebSocket from "@/configs/websocket";
import { getAllNotify, viewedAll } from "@/service/notifyService";
import { getDataApi } from "@/utils/api";
import { toastError, toastSuccess } from "@/utils/toast";
import LineLoading from "../Loading/LineLoading";
let maxPage = null;
const CardNotify = ({ setCountNotify, onClose }) => {
  const [datas, setDatas] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const notifyRef = useRef(null);
  const notifyContentRef = useRef(null);

  useEffect(() => {
    // socket lấy thông báo
    WebSocket.subscribe("/user/queue/notify", (newNotify) => {
      setDatas((prev) => ([newNotify, ...prev]));
      setCountNotify((prev) => prev + 1);
    })
  }, []);

  useEffect(() => {
    // load thông báo khi scroll đến cuối trang
    const handleScroll = (event) => {
      if (maxPage === null || page < maxPage) {
        const { scrollTop, clientHeight, scrollHeight } = event.target;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          setPage((prev) => prev + 1);
        }
      } else {
        // Huỷ sự kiện khi lấy hết thông báo
        notifyContentRef.current.removeEventListener("scroll", handleScroll);
      }
    }

    notifyContentRef.current.addEventListener("scroll", handleScroll);
    return () => {
      notifyContentRef.current.removeEventListener("scroll", handleScroll);
    };
  }, [])

  useEffect(() => {
    if (maxPage === null || page < maxPage) {
      setLoading(true);
      getAllNotify(page).then(response => {
        const result = getDataApi(response);
        maxPage = response.data.result.totalPages;
        setDatas(pre => [...pre, ...result])
      }).catch(error => {
        const dataError = getDataApi(error);
        toastError(dataError.message);
      }).finally(() => {
        setLoading(false);
      })
    }
  }, [page])

  // Xử lý khi click ra ngoài phần tử thông báo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleViewdAll = () => {
    setCountNotify(0);
    if (datas.some((item) => !checkNotifyViewd(item.viewed))) {
      viewedAll().then(() => {
        if (datas.some((item) => !checkNotifyViewd(item.viewed))) {
          setDatas(datas.map((item) => ({ ...item, viewed: 1 })));
          toastSuccess("Đánh dấu đã đọc tất cả thông báo thành công");
        }
      })
        .catch((error) => {
          const dataError = getDataApi(error);
          toastError(dataError.message);
        })
        .finally(() => { })
    }
  };

  return (
    <div ref={notifyRef}>
      <div className="layer1">
        <div className="category">
          <span>Thông báo</span>
          <span className="mark-viewed-notify" onClick={handleViewdAll}>
            Đánh dấu đã đọc
          </span>
        </div>
        <div className="content" ref={notifyContentRef}>
          {datas.map((item) => (
            <ItemNotify
              key={item.id}
              data={item}
              setCountNotify={setCountNotify}
            />
          ))}
          {loading && <LineLoading />}
        </div>
      </div>
    </div>
  );
};

export default CardNotify;
