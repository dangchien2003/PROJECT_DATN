import { useState, useEffect, useRef } from "react";
import ItemNotify from "./ItemNotify";
import { checkNotifyViewd } from "@/utils/notify";
import { listNotify } from "./dataTest";

const CardNotify = ({ setCountNotify, onClose }) => {
  const [datas, setDatas] = useState(listNotify);
  const notifyRef = useRef(null);

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
      setDatas(datas.map((item) => ({ ...item, viewed: 1 })));
      alert("đã đọc tất cả");
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
        <div className="content">
          {datas.map((item) => (
            <ItemNotify
              key={item.id}
              data={item}
              setCountNotify={setCountNotify}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardNotify;
