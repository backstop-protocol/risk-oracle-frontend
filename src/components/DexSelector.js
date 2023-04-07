import { isDexAvailableForBase } from "../utils/utils";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";

const nameMap = {
  uniswapv2: "Uniswap v2",
  curve: 'Curve'
};


const DexSelector = observer(props => {
  const selectedDexes = mainStore.selectedDexes;
  const {selectedBaseSymbol} = props;
  const handleDexChanges = mainStore.handleDexChanges;
  const availableDexes = mainStore.platforms;
  const toggleAllDexes = mainStore.toggleAllDexes;

  return (
    <div style={{fontSize: "0.875em"}}>
      <fieldset className="dex-selector">
      <label htmlFor="switch">
          <input type="checkbox" id="switch" name="switch" role="switch" readOnly 
            onClick={()=>toggleAllDexes(selectedBaseSymbol)}
            checked={mainStore.allDexes} />
          all dexs
        </label>
        {availableDexes.map(dex=> <label key={dex} htmlFor={dex}>
          <input type="checkbox" id={dex} name={dex} checked={selectedDexes.includes(dex)} disabled={!isDexAvailableForBase(dex, selectedBaseSymbol)} onChange={()=> handleDexChanges(dex)}/>
          {nameMap[dex] || dex}
        </label>)}
      </fieldset>
    </div>
  )
})

export default DexSelector