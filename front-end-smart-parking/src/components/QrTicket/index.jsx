import { Button } from 'antd';
import './style.css'
import qr from '@image/qrcode.png'
import { BiSolidDownload } from "react-icons/bi";

const QrTicket = ({data}) => {
  return (
    <div className='qr-ticket'>
      <h2 className='ticket-name'>{data.name}</h2>
      <div className='wrapper-qr'>
        <img src={qr} alt="QR_code" />
      </div>
      <div className='action'>
        <Button color="primary" variant="solid">
          <BiSolidDownload className='icon' /> Tải xuống
        </Button>
      </div>
    </div>
  );
};

export default QrTicket;