import { observer } from "mobx-react"
import Search from "../components/Search"

const Header = observer(props => {
  return <header className="container-fluid">
    <nav>
      <ul style={{width: 'var(--side-nav-width)'}}>
        <li><img alt="Risk Oracle logo" style={{height: '39px'}} src={`/pythia.svg`}/><strong style={{color: 'var(--contrast)'}}> Risk Oracle </strong></li>
      </ul>
      <ul  style={{width: '100%'}}>
        <li>
          <Search/>
        </li>
      </ul>
      <ul>
      </ul>
    </nav>
  </header>
})

export default Header