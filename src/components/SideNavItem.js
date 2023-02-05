import mainStore from "../stores/main.store"

const SideNavItem = props => {
  const {asset} = props
  const {search} = mainStore
  return (
    <li className="side-nav-item">
      <a href={`#assets?name=${asset.name}`} className="secondary" onClick={()=>search(asset.name)}>
        <img alt={`asset.name icon`} src={`/asset-icons/${asset.name}.webp`}/>  
        <span>{asset.name}</span>
      </a>
    </li>
  )
}

export default SideNavItem