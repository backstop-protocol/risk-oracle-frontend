import { observer } from "mobx-react"
import mainStore from "../stores/main.store"
import React, { useRef, useEffect, useState } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref, setSearchListOpen) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setSearchListOpen(false)
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}


const Search = observer(props => {
  const [searchListOpen, setSearchListOpen] = useState(false)
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setSearchListOpen);
  const {setSearchFieldValue, searchFieldValue, search, searchList} = mainStore
  
  return (
    <div ref={wrapperRef}>
      <form onSubmit={(e)=>{e.preventDefault(); search(searchFieldValue)}} style={{margin: 0}}>   
        <input onClick={()=> setSearchListOpen(true)} autocomplete="off" value={searchFieldValue} onChange={(e) => setSearchFieldValue(e.target.value)}type="search" id="search" name="search" placeholder="Search Assets"/>
      </form> 
      {searchList.length > 0 && searchListOpen && <article className="search-list">
        <aside>
          <nav>
            <ul onClick={()=> setSearchListOpen(false)}>
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
        <small>{asset.name}</small>
      </a>
    </li>
  )
})

export default Search