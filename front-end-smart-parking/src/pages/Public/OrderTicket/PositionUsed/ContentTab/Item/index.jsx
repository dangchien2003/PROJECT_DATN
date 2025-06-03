import { Flex } from 'antd';
import './style.css'

const getLevelClass = (count, max) => {
  const ratio = count / max;
  if (ratio <= 1 / 3) return 'low';
  if (ratio <= 2 / 3) return 'medium';
  if (ratio < 1) return 'high';
  return 'max';
};

const Item = ({ label, count, max, isSelect }) => {
  if (label === "00:00") {
    isSelect = true;
  }
  const levelClass = getLevelClass(count, max);
  const select = isSelect ? "select" : "";
  return (
    <div>
      <div className={`item-time ${levelClass}`}>
        <div>
          <p className='time'>{label}</p>
          <p>
            <span>{count}</span>/<span className='max'>{max}</span>
          </p>
        </div>
      </div>
      {isSelect && <Flex justify='center'>
        <div className='select'></div>
      </Flex>}
    </div>
  );
};

export default Item;