import { Button, Flex } from 'antd';
import './style.css'
import qr from '@image/qrcode.png'
import { BiSolidDownload } from "react-icons/bi";
import { LiaQrcodeSolid } from 'react-icons/lia';

const QrTicket = ({data}) => {
  return (
    <div className='qr-ticket'>
      <h2 className='ticket-name'>{data.name}</h2>
      <div className='wrapper-qr'>
        <img src={qr} alt="QR_code" />
      </div>
      <Flex justify='center' wrap="wrap" gap={16} className='action'>
        <Button color="primary" variant="solid">
          <LiaQrcodeSolid className='icon'/> Thay mã
        </Button>
        <Button color="cyan" variant="outlined">
          <BiSolidDownload className='icon' /> Tải xuống
        </Button>
      </Flex>
    </div>
  );
};

export default QrTicket;