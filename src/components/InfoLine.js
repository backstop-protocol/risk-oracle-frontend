import mainStore from "../stores/main.store"
import { observer } from "mobx-react"

const InfoLine = observer(props => {
  const {asset} = props
  return (
    <div className="info-line">
      <div className="info">
        <span>
          <strong>{asset.name}</strong>
        </span>
        <span>
          price: <strong>$1699</strong>
        </span>
        <span>
          24H price change: <strong>4.7%</strong>
        </span>
        <span>
          24H Liquidity change: <strong>2.7%</strong>
        </span>
      </div>
      <kbd>contract address: 0x9876543...</kbd>
    </div>
  )
})

export default InfoLine