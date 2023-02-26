import { observer } from "mobx-react"

const DexSelector = observer(props => {
  const {dataStore} = props
  const dexs = Object.values(dataStore.dexs)
  return (
    <div>
      <fieldset className="dex-selector">
        <label htmlFor="switch">
          <input type="checkbox" id="switch" name="switch" role="switch" readOnly 
            onClick={dataStore.toggleAllDexs}
            checked={dataStore.allDexs} />
          all dexs
        </label>
        {dexs.map(dex=> dex.supported && <label key={dex.name} htmlFor={dex.name}>
          <input type="checkbox" id={dex.name} name={dex.name} checked={dex.checked} onChange={()=> dataStore.toggleDex(dex)}/>
          {dex.name}
        </label>)}
      </fieldset>
    </div>
  )
})

export default DexSelector