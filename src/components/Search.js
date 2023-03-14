import { observer } from "mobx-react"
import mainStore from "../stores/main.store"
import React from "react"


const Search = observer(props => {
  const {setSearchFieldValue, searchFieldValue, search, searchList} = mainStore

  return (
    <div>
      <form onSubmit={(e)=>{e.preventDefault(); search(searchFieldValue)}} style={{margin: 0}}>   
        <input autocomplete="off" value={searchFieldValue} onChange={(e) => setSearchFieldValue(e.target.value)}type="search" id="search" name="search" placeholder="Search Assets"/>
      </form> 
      {searchList.length > 0 && <article className="search-list">
        <aside>
          <nav>
            <ul>
            {searchList.map(sli=> <SearchListItem key={sli.name} asset={sli}/>)}
            </ul>
          </nav>
        </aside>
        </article>}
    </div>
  )
})

const SearchListItem = observer(props => {
  const {asset} = props
  const {search} = mainStore
  return (
    <li className="side-nav-item search-list-item">
      <a className="secondary" onClick={()=>search(asset.name)}>
        <img alt={`${asset.name} icon`} src={`/asset-icons/${asset.name}.webp`}/>  
        <span>{asset.name}</span>
      </a>
    </li>
  )
})

export default Search