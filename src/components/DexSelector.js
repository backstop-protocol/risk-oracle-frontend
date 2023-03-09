import { observer } from "mobx-react"

const nameMap = {
  uniswapv2: "Uniswap v2"
}

const DexSelector = observer(props => {
  const {dataStore} = props
  const dexs = Object.values(dataStore.options)
  return (
    <div style={{fontSize: "0.875em"}}>
      <fieldset className="dex-selector">
        <label htmlFor="switch">
          <input type="checkbox" id="switch" name="switch" role="switch" readOnly 
            onClick={dataStore.toggleAllDexs}
            checked={dataStore.allDexs} />
          all dexs
        </label>
        {dexs.map(dex=> <label key={dex.name} htmlFor={dex.name}>
          <input type="checkbox" id={dex.name} name={dex.name} checked={dex.checked} disabled={dex.disabled} onChange={()=> dataStore.toggleDex(dex)}/>
          {nameMap[dex.name] || dex.name}
        </label>)}
      </fieldset>
    </div>
  )
})

export default DexSelector