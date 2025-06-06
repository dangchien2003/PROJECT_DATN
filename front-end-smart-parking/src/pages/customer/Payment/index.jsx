import ChildContent from '@/components/layout/Customer/ChildContent';
import './style.css'
import StepOrder from '@/pages/customer/OrderTicket/StepOrder';

const Payment = () => {
  return (
    <div className='payment'>
      <ChildContent>
        <StepOrder/>  
      </ChildContent>
    </div>
  );
};

export default Payment;