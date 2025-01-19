import { Alert, Button, Modal } from 'antd'
import React from 'react'

const PopConfirmCustom = ({ type, title, message, handleOk, handleCancel }) => {
  return (
    <Modal
      open={true}
      onCancel={handleCancel}
      footer={null}
      closable={false}
      centered
      style={{
        top: "20%",
        margin: 0,
        height: "100vh",
        overflow: "hidden",
      }}
      bodyStyle={{
        padding: "20px",
        textAlign: "center",
      }}
    >
      <Alert
        message={title}
        description={message}
        type={type}
        showIcon
        style={{ marginBottom: 20 }}
      />
      <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
        <Button danger onClick={handleCancel}>
          Huỷ bỏ
        </Button>
        <Button type="primary" onClick={handleOk}>
          Đồng ý
        </Button>
      </div>
    </Modal>
  )
}

export default PopConfirmCustom
