import { Paper } from "@mui/material";

import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { timeWindows } from "../stores/config.store";
import { largeNumberFormatter } from "../utils/utils";
const CLFValues = [
    {
        text: 'High confidence',
        value: '100'
    },
    {
        text: 'Medium confidence',
        value: '50'
    },
    {
        text: 'Low confidence',
        value: '10'
    },
]
const controlledWidth = {}
// const controlledWidth = { flex: "1", flexGrow: "1" }



const LTVCalculator = observer(props => {
    if (!mainStore.averages) {
        return
    }
    const {quotes, selectedQuote, handleCLFandLTVChanges, setSelectedQuote, span, liquidity, volatility, slippage, borrowCap, setBorrowCap, CLF, recommendedLTV } = props;
    const slippageOptions = [1, 5, 10, 15, 20];
    const selectedBase = mainStore.selectedBaseSymbol;
    const basePrice = mainStore.basePrice;

    return (
<<<<<<< HEAD
        <Paper className="ltv-container">
            <div className="ltv-table">
                <div className="ltv-asset" title="The asset pair against which the data is being fetched.">
                    <div className="ltv-title-div">
                        <small >Debt Asset</small></div>
                    <div className="ltv-value-div">
                    <select className="ltv-select" onChange={(event) => { setSelectedQuote(event.target.value) }}>{quotes.map((_) => <option key={_} value={_}>{_}</option>)}</select>
                    </div>
                </div>
                <div className="ltv-asset" title="The time frame that is used for fetching the data.">
                    <div className="ltv-title-div">
                        <small >Time Frame</small></div>
                    <div className="ltv-value-div">
                    <select className="ltv-select" value={span} onChange={(event) => { mainStore.handleSpanChange(event.target.value) }}>{Object.entries(timeWindows).map(([tw, v]) => <option key={tw} value={v}>{tw}</option>)}</select>
                    </div>
                </div>
                <div className="ltv-asset" title="The available DEX liquidity with a slippage of β.">
                    <div className="ltv-title-div">
                        <small>&#8467;<br />liquidity</small>
                    </div>
                    <div className="ltv-value-div">
                    {largeNumberFormatter((liquidity).toFixed(2))}
                    </div>
                </div>
                <div className="ltv-asset" title="The price volatility between the collateral and debt asset (normalized to the base asset price).">
                    <div className="ltv-title-div">
                        <small>&sigma;<br />Volatility</small>
                    </div>
                    <div className="ltv-value-div">
                    {(volatility * 100).toFixed(2)}%
                    </div>
                </div>
                <div className="ltv-asset" title="The bonus liquidators get as an incentive to liquidate a position.">
                    <div className="ltv-title-div">
                        <small>&beta;<br />liquidation bonus</small>
                    </div>
                    <div className="ltv-value-div">
                    <select className="ltv-select" value={slippage} onChange={(event) => { mainStore.handleSlippageChange(event.target.value) }}>{slippageOptions.map((_) => <option key={_} value={_}>{_}%</option>)}</select>
                    </div>
                </div>
                <div className="ltv-asset" title="The borrow cap of the debt asset in USD value.">
                    <div className="ltv-title-div">
                        <small><em>&#100;</em><br />borrow cap (M$)</small>
                    </div>
                    <div className="ltv-value-div">
                    <input className="ltv-select" value={borrowCap} onChange={(event) => { setBorrowCap(((event.target.value || '').match(/^[0-9]+(\.[0-9]{0,2})?/g) || [])[0] || '') }} />
                    </div>
                </div>
                <div className="ltv-asset" title="Confidence Level Factor. The higher it is, the odds of insolvency are decreasing.">
                    <div className="ltv-title-div">
                        <small>CLF</small>
                    </div>
                    <div className="ltv-value-div">
                    <input className="ltv-select" value={CLF} onChange={(event) => { handleCLFandLTVChanges('clf', event.target.value)}} />
                    </div>
                </div>
                <div className="ltv-asset" title="Loan To Value ratio.">
                    <div className="ltv-title-div">
                        <small>Recommended LTV</small>
                    </div>
                    <div className="ltv-value-div">
                    <input className="ltv-select" value={recommendedLTV} onChange={(event) => { handleCLFandLTVChanges('ltv', event.target.value)}} />
                    </div>
                </div>
            </div>
=======
        <Paper className="dexControls" sx={{padding: "1vh 1vw", width: "90vw"}}>
            <Stack
                direction="row"
                justifyContent="center"
                gap={2}>
                <FormControl
                    sx={controlledWidth}
                >
                    <TextField
                        select
                        color="secondary"
                        value={selectedQuote ? selectedQuote : ''}
                        label="Debt Asset"
                        onChange={(event) => { setSelectedQuote(event.target.value) }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Tooltip placement="top" title="The asset pair against which the data is being fetched.">
                                        <QuestionMark fontSize="small" />
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    >
                        {quotes.map((_) => <MenuItem key={_} value={_}>{_}</MenuItem>)}
                    </TextField>
                </FormControl>
                <FormControl
                    sx={controlledWidth}
                >
                    <TextField
                        select
                        color="secondary"
                        value={span}
                        label="Time Frame"
                        onChange={(event) => { mainStore.handleSpanChange(event.target.value) }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Tooltip placement="top" title="The time frame that is used for fetching the data.">
                                        <QuestionMark fontSize="small" />
                                    </Tooltip>
                                </InputAdornment>
                            ),
                            endAdornment: (<InputAdornment position="end"></InputAdornment>)

                        }}
                    >
                        {Object.entries(timeWindows).map(([tw, v]) => <MenuItem key={tw} value={v}>{tw}</MenuItem>)}
                    </TextField>
                </FormControl>
                <FormControl
                    sx={controlledWidth}
                >
                    <TextField
                        disabled
                        color="secondary"
                        value={(volatility * 100).toFixed(2)}
                        label="&sigma; - Volatility"
                        onChange={(event) => { mainStore.handleSpanChange(event.target.value) }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Tooltip placement="top" title="The price volatility between the collateral and debt asset (normalized to the base asset price).">
                                        <QuestionMark fontSize="small" />
                                    </Tooltip>
                                </InputAdornment>
                            ),
                            endAdornment: (<InputAdornment position="end">%</InputAdornment>)
                        }}
                    >
                        <MenuItem key={volatility} value={(volatility * 100).toFixed(2)}>{(volatility * 100).toFixed(2)}</MenuItem>
                    </TextField>
                </FormControl>
                <FormControl
                    sx={controlledWidth}
                >
                    <TextField
                        disabled
                        color="secondary"
                        value={largeNumberFormatter((liquidity).toFixed(2))}
                        label="&#8467; - Liquidity"
                        helperText={`$${largeNumberFormatter((liquidity * basePrice).toFixed(2))}`}
                        onChange={(event) => { mainStore.handleSpanChange(event.target.value) }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Tooltip placement="top" title="The available DEX liquidity with a slippage of β.">
                                        <QuestionMark fontSize="small" />
                                    </Tooltip>
                                </InputAdornment>
                            ),
                            endAdornment: (<InputAdornment position="end">{selectedBase}</InputAdornment>)
                        }}
                    >
                    </TextField>
                </FormControl>
                <FormControl
                    sx={controlledWidth}
                >
                    <TextField
                        select
                        color="secondary"
                        value={slippage}
                        label="&beta; - Liquidation bonus"
                        onChange={(event) => { mainStore.handleSlippageChange(event.target.value) }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Tooltip placement="top" title="The bonus liquidators get as an incentive to liquidate a position.">
                                        <QuestionMark fontSize="small" />
                                    </Tooltip>
                                </InputAdornment>
                            ),
                            endAdornment: (<InputAdornment position="end"></InputAdornment>)
                        }}
                    >
                        {slippageOptions.map((_) => <MenuItem key={_} value={_}>{_}%</MenuItem>)}
                    </TextField>
                </FormControl>
                <FormControl
                    sx={controlledWidth}
                >
                    <TextField
                        color="secondary"
                        value={borrowCap}
                        label="&#100; - Borrow cap m$"
                        onChange={(event) => { setBorrowCap(((event.target.value || '').match(/^[0-9]+(\.[0-9]{0,2})?/g) || [])[0] || '') }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Tooltip placement="top" title="The borrow cap of the debt asset in USD value.">
                                        <QuestionMark fontSize="small" />
                                    </Tooltip>
                                </InputAdornment>
                            ),
                            endAdornment: (<InputAdornment position="end">M$</InputAdornment>)
                        }}
                    >
                    </TextField>
                </FormControl>
                <FormControl
                    sx={controlledWidth}
                >
                    <Autocomplete
                        freeSolo
                        disableClearable
                        options={CLFValues.map((option) => option.value)}
                        value={String(CLF)}
                        onChange={(event, newValue) => {
                            handleCLFandLTVChanges('clf', newValue);
                        }}
                        inputValue={CLF}
                        onInputChange={(event, newValue) => {
                            handleCLFandLTVChanges('clf', newValue);
                        }}
                        renderInput={(params) => (
                            <TextField
                        color="secondary"
                        {...params}
                                label="CLF"
                                InputProps={{
                                    ...params.InputProps,
                                    type: 'search',
                                    startAdornment: (
                                    <InputAdornment position="start" sx={{
                                        position: 'absolute',
                                        p: 0,
                                        left: "5%",
                                        top: '45%',
                                      }}>
                                        <Tooltip placement="top" title="Confidence Level Factor. The higher it is, the odds of insolvency are decreasing.">
                                            <QuestionMark fontSize="small" />
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                                endAdornment: (<InputAdornment position="end"></InputAdornment>)
                            }}
                                    
                            />
                        )}
                    />
                </FormControl>
                <FormControl
                    sx={controlledWidth}
                >
                    <TextField
                        sx={controlledWidth}
                        color="secondary"
                        value={recommendedLTV}
                        label="LTV"
                        helperText="Recommended LTV"
                        onChange={(event) => {
                            handleCLFandLTVChanges('ltv', event.target.value);
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Tooltip placement="top" title="Loan To Value ratio.">
                                        <QuestionMark fontSize="small" />
                                    </Tooltip>
                                </InputAdornment>
                            ),
                            endAdornment: (<InputAdornment position="end"></InputAdornment>)
                        }}
                    >
                    </TextField>
                </FormControl>
            </Stack>
>>>>>>> staging
        </Paper>

                
                
                
                
                
    )

})
export default LTVCalculator