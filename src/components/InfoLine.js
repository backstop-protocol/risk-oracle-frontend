import mainStore from "../stores/main.store"
import { observer } from "mobx-react"

const InfoLine = observer(props => {
  const asset = props
  return (
    <div className="info-line">
      <strong>{asset.name}</strong>
    </div>
  )
})

export default InfoLine