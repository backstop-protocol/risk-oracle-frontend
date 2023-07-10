import { Checkbox, FormControl, FormControlLabel, FormGroup, MenuItem, Select, Switch, ToggleButton, ToggleButtonGroup } from "@mui/material";

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
    const selectedQuotes = mainStore.selectedQuotes;
    const currentSlippage = mainStore.selectedSlippage;
    const availableQuotes = mainStore.quotes;
    const span = Number(mainStore.selectedSpan);
    const handleQuotesChanges = mainStore.handleQuotesChanges;
    function handleSpan(event, value){
      mainStore.handleSpanChange(value);
    }
    function handleAllDexes(){
      mainStore.toggleAllDexes(selectedBaseSymbol);
    }

    return (
      <Box sx={{display: "flex", flexDirection:"row", justifyContent:"space-evenly", width:"100%"}}>
        <Box sx={{flex:1, flexGrow:3, display: "flex", flexDirection:"row", gap:"0.5vw"}}>
          <ToggleButtonGroup
          value={span}
          size="small"
          exclusive
          onChange={handleSpan}>
          {Object.entries(timeWindows).map(([tw, v]) =>
            <ToggleButton key={tw} value={v}>{tw}</ToggleButton>)}
          </ToggleButtonGroup>
        </Box>
        <Box sx={{flex:1, flexGrow: 5}}>
          <FormGroup sx={insideDivStyle}>
            <FormControlLabel control={<Switch color="secondary" checked={mainStore.allDexes} onChange={handleAllDexes}/>} label="all dexs"  />
          {availableDexes.map(dex => <FormControlLabel key={dex} control={<Checkbox color="secondary" checked={selectedDexes.includes(dex)} disabled={!isDexAvailableForBase(dex, selectedBaseSymbol)} onChange={() => handleDexChanges(dex)} />} label={nameMap[dex] || dex} />)}
          </FormGroup>
        </Box>
        <Box sx={{flex:1, flexGrow:3}}>
        <FormGroup sx={insideDivStyle}>
          {availableQuotes.map(quote => <FormControlLabel key={quote} control={<Checkbox color="secondary" checked={selectedQuotes.includes(quote)} disabled={!availableQuotesForBase.includes(quote)} onChange={() => handleQuotesChanges(quote)} />} label={nameMap[quote] || quote} />)}
          </FormGroup>
        </Box>
        <Box sx={{insideDivStyle, marginBottom:"var(--spacing)"}}>
          <FormControl>
            <Select
            value={currentSlippage}
            label="Slippage"
            onChange={mainStore.handleSlippageChange}
            >
              {options.map(_ => <MenuItem value={_}>{_}% slippage</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
      </Box>

    )
  }
})

export default DexSelector