import { observer } from "mobx-react"

const InfoLine = observer(props => {
  const {dataStore} = props
  return (
    <div className="info-line">
      <div className="info">
        <span>
          <strong>{dataStore.asset}</strong>
        </span>
        <span>
          price: <strong>${dataStore.price}</strong>
        </span>
        <span>
          24H price change: <strong>{dataStore._24PriceChange}%</strong>
        </span>
        <span>
          24H Liquidity change: <strong>2.7%</strong>
        </span>
      </div>
    </div>
  )
})

export default InfoLine