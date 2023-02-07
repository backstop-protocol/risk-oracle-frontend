import { observer } from "mobx-react"
import mainStore from "../stores/main.store"

const DexSelector = observer(props => {
  const {dexs} = mainStore
  return (
    <div>
      <fieldset className="dex-selector">
        <label htmlFor="switch">
          <input type="checkbox" id="switch" name="switch" role="switch"/>
          all dexs
        </label>
        {dexs.map(dex=> <label key={dex.name} htmlFor={dex.name}>
          <input type="checkbox" id={dex.name} name={dex.name}/>
          {dex.name}
        </label>)}
      </fieldset>
    </div>
  )
})

export default DexSelector