import { observer } from "mobx-react"
import mainStore from "../stores/main.store"

const ComparisonAssetsSelector = observer(props => {
  const {comparisonAssets} = mainStore
  return (
    <div>
      <fieldset className="dex-selector">
        <label htmlFor="switch">
          <input type="checkbox" id="switch" name="switch" role="switch"/>
          all comparisonAssets
        </label>
        {comparisonAssets.map(ca=> <label key={ca.name} htmlFor={ca.name}>
          <input type="checkbox" id={ca.name} name={ca.name}/>
          {ca.name}
        </label>)}
      </fieldset>
    </div>
  )
})

export default ComparisonAssetsSelector