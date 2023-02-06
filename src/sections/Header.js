import { observer } from "mobx-react"
import mainStore from "../stores/main.store"

const Header = observer(props => {
  const {setSearchFieldValue, searchFieldValue, search} = mainStore
  return <header className="container-fluid">
    <nav>
      <ul style={{width: 'var(--side-nav-width)'}}>
        <li><img alt="Risk Oracle logo" style={{height: '39px'}} src={`/pythia.svg`}/><strong style={{color: 'var(--contrast)'}}> Risk Oracle </strong></li>
      </ul>
      <ul  style={{width: '100%'}}>
        <li>
          <form onSubmit={(e)=>{e.preventDefault(); search(searchFieldValue)}} style={{margin: 0}}>   
            <input value={searchFieldValue} onChange={(e) => setSearchFieldValue(e.target.value)}type="search" id="search" name="search" placeholder="Search Assets"/>
          </form> 
        </li>
      </ul>
      <ul>
      </ul>
    </nav>
  </header>
})

export default Header