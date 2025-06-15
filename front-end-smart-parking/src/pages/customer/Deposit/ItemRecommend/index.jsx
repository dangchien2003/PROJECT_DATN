import { formatCurrency } from '@/utils/number';
import './style.css';

const ItemRecommend = ({ coin, onClick, current }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(coin);
    }
  }
  return (
    <div className='item-recommend' onClick={handleClick} style={coin === current ? {fontWeight: "bold", fontSize: 18} : {}}>
      <div>{formatCurrency(coin)}<sup>Đ</sup></div>
    </div>
  );
};

export default ItemRecommend;