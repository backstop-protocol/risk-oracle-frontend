import { observer } from "mobx-react"

const ComparisonAssetsSelector = observer(props => {
  const {dataStore} = props
  const selectedAsset = dataStore.asset
  const {comparisonAssets} = dataStore
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