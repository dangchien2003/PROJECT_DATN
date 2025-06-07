import './style.css'
import LineLoading from '../Loading/LineLoading'

const LoadingComponent = ({background, transparent}) => {
  if(transparent) {
    background = "transparent"
  } else if(!background) {
    background = "#cccccc7a"
  }

  return (
    <div id="component-loading" className='pa loading-component br3' style={{backgroundColor: background}}>
      <LineLoading/>
    </div>
  )
}

export default LoadingComponent