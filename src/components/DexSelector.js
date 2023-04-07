import mainStore from "../stores/main.store";
import { observer } from "mobx-react";

const nameMap = {
  uniswapv2: "Uniswap v2",
  curve: 'Curve'
};

function isDexAvailableForBase(dexName, selectedBaseName){
  const availableBases = mainStore.graphData[dexName]['1'].map(_ => _.base);
  return availableBases.includes(selectedBaseName);
}

const DexSelector = observer(props => {
  const selectedDexes = mainStore.selectedDexes;
  const handleDexChanges = mainStore.handleDexChanges;
  const availableDexes = mainStore.platforms;
  const selectedBase = mainStore.selectedAsset;
  const selectedBaseName = selectedBase.name === 'ETH' ? 'WETH' : selectedBase.name;

  return (
    <div style={{fontSize: "0.875em"}}>
      <fieldset className="dex-selector">
        {availableDexes.map(dex=> <label key={dex} htmlFor={dex}>
          <input type="checkbox" id={dex} name={dex} checked={selectedDexes.includes(dex)} disabled={!isDexAvailableForBase(dex, selectedBaseName)} onChange={()=> handleDexChanges(dex)}/>
          {nameMap[dex] || dex}
        </label>)}
      </fieldset>
    </div>
  )
})

export default DexSelector