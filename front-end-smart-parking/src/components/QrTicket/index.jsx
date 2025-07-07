import { getQrCode, refreshQr } from '@/service/ticketPurchasedService';
import { getDataApi } from '@/utils/api';
import { toastError, toastSuccess } from '@/utils/toast';
import { Button, Flex } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';
import { BiSolidDownload } from "react-icons/bi";
import { LiaQrcodeSolid } from 'react-icons/lia';
import LoadingComponent from '../LoadingComponent';
import './style.css';

const QrTicket = ({ data, onRefresh }) => {
  const qrRef = useRef();
  const [qrContent, setQrContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // call api lấy qr
    getQrCode(data.id).then(response => {
      const qrCode = getDataApi(response);
      setQrContent(qrCode);
    })
      .catch(e => {
        const response = getDataApi(e);
        toastError(response.message)
        setQrContent(null);
      })
      .finally(() => {
        setLoading(false);
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  const handleDownload = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const url = canvas.toDataURL('image/png');

    // Tạo link ẩn để tải
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.ticketName}-${data.id}-${new Date().getTime()}.png`;
    link.click();
  };

  const handleRefreshQr = () => {
    setLoading(true);
    refreshQr(data.id).then(response => {
      const data = getDataApi(response);
      setQrContent(data);
      toastSuccess("Làm mới mã thành công");
      // gọi callback sau khi thành công
      if(onRefresh) {
        onRefresh();
      }
    })
      .catch(e => {
        const response = getDataApi(e);
        toastError(response.message);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  return (
    <div className='qr-ticket'>
      <h2 className='ticket-name'>{data.ticketName}</h2>
      <div className='wrapper-qr pr' ref={qrRef}>
        {loading && <LoadingComponent transparent />}
        {(qrContent !== null && !loading) && <QRCodeCanvas
          value={qrContent}
          size={300}
          marginSize={1}
          bgColor="#ffffff"
          fgColor="#000000"
          level="M" // L, M, Q, H
        />}
      </div>
      <Flex justify='center' wrap="wrap" gap={16} className='action'>
        <Button color="primary" variant="solid" onClick={handleRefreshQr}>
          <LiaQrcodeSolid className='icon' /> Thay mã
        </Button>
        <Button color="cyan" variant="outlined" onClick={handleDownload}>
          <BiSolidDownload className='icon' /> Tải xuống
        </Button>
      </Flex>
    </div>
  );
};

export default QrTicket;