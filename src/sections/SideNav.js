import { observer } from "mobx-react"
import mainStore from "../stores/main.store"
import SideNavItem from "../components/SideNavItem"

const SideNav = observer(props => {
  const {assets} = mainStore
  return (
    <aside className="side-nav">
      <nav>
        <ul>
          {assets.map((asset, index) => <SideNavItem asset={asset} key={index}/>)}
        </ul>
      </nav>
    </aside>
  )
})

export default SideNav