import SideNavItem from "../components/SideNavItem"
import mainStore from "../stores/main.store"
import { observer } from "mobx-react"

const SideNav = observer(props => {
  const {assets} = mainStore
  return (
    <aside className="side-nav">
      <nav style={{paddingTop:"8vh"}}>
        <ul>
          {assets.map((asset, index) => <SideNavItem asset={asset} key={index}/>)}
        </ul>
      </nav>
    </aside>
  )
})

export default SideNav