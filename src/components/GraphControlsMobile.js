import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Stack, Switch, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

import { Box } from "@mui/system";
import { isDexAvailableForBase } from "../utils/utils";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { timeWindows } from "../stores/config.store";
import { ExpandMore } from "@mui/icons-material";

const nameMap = {
  uniswapv2: "Uniswap v2",
  curve: 'Curve',
  uniswapv3: 'Uniswap v3'
};

const options = [
  1, 5, 10, 15, 20
]

const insideDivStyle = { display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", margin: "0 10px 0 10px" }


const GraphControlsMobile = observer(props => {
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
    function handleSpan(event, value) {
      if (value === null) {
        event.preventDefault()
        return
      }
      mainStore.handleSpanChange(value);
    }
    function handleAllDexes() {
      mainStore.toggleAllDexes(selectedBaseSymbol);
    }
    function handleSlippageChange(e) {
      mainStore.handleSlippageChange(e.target.value);
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "100%" }}>
        <Accordion sx={{width:"95%"}} defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{ width: "100%", height: "5vh" }}>
            <Typography variant="body2">Graph Controls</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ display: "flex", flexDirection: "column", alignItems: "left", justifyContent: "start" }}>
            <Stack direction="row">
            <Box>
              <ToggleButtonGroup
                orientation="vertical"
                value={span}
                size="small"
                exclusive
                color="secondary"
                onChange={handleSpan}>
                {Object.entries(timeWindows).map(([tw, v]) =>
                  <ToggleButton key={tw} value={v}>{tw}</ToggleButton>)}
              </ToggleButtonGroup>
            </Box>
            <Box sx={{ flex: 1, flexGrow: 5 }}>
              <FormGroup
                sx={insideDivStyle}
              >
                <FormControlLabel control={<Switch color="secondary" checked={mainStore.allDexes} onChange={handleAllDexes} />} label="all dexs" />
                {availableDexes.map(dex => <FormControlLabel className="dexControls" key={dex} control={<Checkbox color="secondary" checked={selectedDexes.includes(dex)} disabled={!isDexAvailableForBase(dex, selectedBaseSymbol)} onChange={() => handleDexChanges(dex)} />} label={nameMap[dex] || dex} />)}
              </FormGroup>
            </Box>
            <Box sx={{ flex: 1, flexGrow: 3 }}>
              <FormGroup
                sx={{ insideDivStyle, all: "unset" }}
              >
                {availableQuotes.map(quote => <FormControlLabel className="dexControls" key={quote} control={<Checkbox color="secondary" checked={selectedQuotes.includes(quote)} disabled={!availableQuotesForBase.includes(quote)} onChange={() => handleQuotesChanges(quote)} />} label={nameMap[quote] || quote} />)}
              </FormGroup>
            </Box>
            <Box sx={{ insideDivStyle, flex: 1, flexGrow: 1 }}>
              <FormControl>
                <InputLabel>Slippage</InputLabel>
                <Select
                  color="secondary"
                  value={currentSlippage}
                  label="Slippage"
                  onChange={(e) => handleSlippageChange(e)}
                >
                  {options.map(_ => <MenuItem key={_} value={_}> &nbsp;&nbsp;{_}%&nbsp;&nbsp; </MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>


    )
  }
})

export default GraphControlsMobile