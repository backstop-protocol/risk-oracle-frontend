import { observer } from "mobx-react"
import mainStore from "../stores/main.store"
import {toJS} from "mobx"

const ComparisonAssetsSelector = observer(props => {
  const {dataStore} = mainStore

  const comparisonAssets = Object.values(dataStore.comparisonAssets)
  return (
    <div>
      <fieldset className="dex-selector">
        <label htmlFor="switch">
          <input type="checkbox" id="switch" name="switch" role="switch" 
            readOnly
            onClick={dataStore.toggleAllComparisonAssets}
            checked={dataStore.allComparisonAssetsChecked}/>
          all comparisonAssets
        </label>
        {comparisonAssets.map(ca=> <label key={ca.name} htmlFor={ca.name}>
          <input type="checkbox" id={ca.name} name={ca.name} checked={ca.checked} onChange={()=> dataStore.toggleComparisonAsset(ca)}/>
          {ca.name}
        </label>)}
      </fieldset>
    </div>
  )
})

export default ComparisonAssetsSelector