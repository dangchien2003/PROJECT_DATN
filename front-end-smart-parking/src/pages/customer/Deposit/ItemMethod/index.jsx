import './style.css'

const ItemMethod = ({ icon, name, method, choosed, value, onClick }) => {
  const handleClickMethod = () => {
    if (onClick) {
      onClick(value);
    }
  }
  return (
    <div className='item-method' onClick={handleClickMethod}>
      <div className='method' style={choosed === value ? { background: "#f0f0f0" } : {}}>
        <div className="method-image">
          <img src={icon} alt={method} />
        </div>
        <div className="method-name">
          {name}
        </div>
      </div>
    </div>
  );
};

export default ItemMethod;