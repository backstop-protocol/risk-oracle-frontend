import { Box } from "@mui/system";
import { isDexAvailableForBase } from "../utils/utils";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { timeWindows } from "../stores/config.store";

const nameMap = {
  uniswapv2: "Uniswap v2",
  curve: 'Curve',
  uniswapv3: 'Uniswap v3'
};

const options = [
  1, 5, 10, 15, 20
]

const insideDivStyle = {display: "flex", flexDirection:"row", gap:"0.5vw", justifyContent:"center", alignItems:"center"}


const DexSelector = observer(props => {
  if (!mainStore.loading) {
    const selectedDexes = mainStore.selectedDexes;
    const { selectedBaseSymbol, availableQuotesForBase } = props;
    const handleDexChanges = mainStore.handleDexChanges;
    const availableDexes = mainStore.platforms;
    const toggleAllDexes = mainStore.toggleAllDexes;
    const selectedQuotes = mainStore.selectedQuotes;
    const currentValue = mainStore.selectedSlippage;
    const availableQuotes = mainStore.quotes;
    const span = Number(mainStore.selectedSpan);
    const handleQuotesChanges = mainStore.handleQuotesChanges;
    return (
      <Box sx={{display: "flex", flexDirection:"row", justifyContent:"space-evenly", width:"100%"}}>
        <Box sx={{flex:1, flexGrow:3, display: "flex", flexDirection:"row", gap:"0.5vw"}}>
          {Object.entries(timeWindows).map(([tw, v]) =>
            <button key={tw} onClick={() => mainStore.handleSpanChange(v)} className={`${span !== v ? 'outline' : ''} secondary small-btn`}>{tw}</button>)}
        </Box>
        <Box sx={{flex:1, flexGrow: 3}}>
          <fieldset style={insideDivStyle}>
            <label htmlFor="switch" style={{marginRight:"1vw"}}>
              <input type="checkbox" id="switch" name="switch" role="switch" readOnly
                onClick={() => toggleAllDexes(selectedBaseSymbol)}
                checked={mainStore.allDexes} />
              all dexs
            </label>
            {availableDexes.map(dex => <label key={dex} htmlFor={dex}>
              <input type="checkbox" id={dex} name={dex} checked={selectedDexes.includes(dex)} disabled={!isDexAvailableForBase(dex, selectedBaseSymbol)} onChange={() => handleDexChanges(dex)} />
              {nameMap[dex] || dex}
            </label>)}
          </fieldset>
        </Box>
        <Box sx={{flex:1, flexGrow:3}}>
          <fieldset style={insideDivStyle}>
            {availableQuotes.map(quote => <label key={quote} htmlFor={quote}>
              <input type="checkbox" id={quote} name={quote} checked={selectedQuotes.includes(quote)} disabled={!availableQuotesForBase.includes(quote)} onChange={() => handleQuotesChanges(quote)} />
              {nameMap[quote] || quote}
            </label>)}
          </fieldset>
        </Box>
        <Box sx={{insideDivStyle, marginBottom:"var(--spacing)"}}>
          <select style={{ width: "100%" }} id="slippage-selector" value={currentValue} onChange={(event) => mainStore.handleSlippageChange(event.target.value)}>
            {options.map((option) => <option key={option} value={option}>{option}% slippage</option>)}
          </select>
        </Box>
      </Box>

    )
  }
})
export default DexSelector