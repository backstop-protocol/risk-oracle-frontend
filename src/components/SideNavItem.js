import mainStore from "../stores/main.store"
import { observer } from "mobx-react"

const SideNavItem = observer(props => {
  const {asset} = props
  const {search, selectedAsset} = mainStore
  return (
    <li className="side-nav-item">
      <a className={`${selectedAsset && asset.name === selectedAsset.name ? 'selected' : ''} secondary`} onClick={()=>search(asset.name)}>
        <img alt={`${asset.name} icon`} src={`/asset-icons/${asset.name}.webp`}/>  
        <span>{asset.name}</span>
      </a>
    </li>
  )
})

export default SideNavItem