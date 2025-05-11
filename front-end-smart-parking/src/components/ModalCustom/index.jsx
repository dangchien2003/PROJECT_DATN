import "./style.css";
import { Modal } from "antd";

const ModalCustom = ({ children, onClose }) => {
  return (
    <>
      <Modal
        open={true}
        footer={null}
        closable={true}
        centered
        className="modal-custom"
        onCancel={onClose}
      >
        <div className={"modal-children"}>{children}</div>
      </Modal>
    </>
  );
};

export default ModalCustom;
