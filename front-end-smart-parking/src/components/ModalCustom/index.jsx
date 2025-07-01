import "./style.css";
import { Modal } from "antd";

const ModalCustom = ({ children, onClose, close = true }) => {
  return (
    <>
      <Modal
        open={true}
        footer={null}
        closable={close}
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
