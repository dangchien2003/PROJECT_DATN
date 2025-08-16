
import './style.css'
import TableList from './TableList';

const LinkTicket = ({onLinkSuccess, cardId}) => {
  return (
    <div className='link-ticket'>
      <h1 className='mb12'>Chọn vé liên kết</h1>
      <TableList onLinkSuccess={onLinkSuccess} cardId={cardId}/>
    </div>
  );
};

export default LinkTicket;