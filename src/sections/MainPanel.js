import { observer } from "mobx-react"
import mainStore from "../stores/main.store"
import InfoLine from "../components/InfoLine"

const MainPanel = observer(props => {
  const {searchedAsset, selectedAsset, assets} = mainStore
  if (!selectedAsset && !searchedAsset) {
    return <div className="main-content">search or select an asset</div>
  }
  if (!selectedAsset && searchedAsset) {
    return <div className="main-content">the searched asset {searchedAsset} is not yet supported</div>
  }
  return (
    <div className="main-content">
      main panel {selectedAsset.name}
    </div>
  )
})

export default MainPanel