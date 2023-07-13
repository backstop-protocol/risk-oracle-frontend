import { Autocomplete, FormControl, InputAdornment, MenuItem, Paper, Stack, TextField, Tooltip } from "@mui/material";

import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { QuestionMark } from "@mui/icons-material";
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

const controlledWidth = {width:"auto"}

const LTVCalculator = observer(props => {
    if (!mainStore.averages) {
        return
    }
    const { quotes, selectedQuote, setSelectedQuote, span, liquidity, volatility, slippage, borrowCap, setBorrowCap, CLF, setCLF, recommendedLTV } = props;
    const slippageOptions = [1, 5, 10, 15, 20];
    const debtAssetPrice = mainStore.debtAssetPrices[selectedQuote] ? mainStore.debtAssetPrices[selectedQuote] : undefined;
    console.log(selectedQuote)

    return (
        <Paper className="dexControls" sx={{padding:"1vh 1vw", width:"90vw"}}>
            <Stack 
            direction="horizontal" 
            justifyContent="center"
            gap={2}>
                <FormControl>
                    <TextField
                    sx={{width:"10vw"}}
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
                <FormControl>
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
                <FormControl>
                    <TextField
                        sx={controlledWidth}
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
                <FormControl>
                    <TextField
                        sx={controlledWidth}
                        disabled
                        color="secondary"
                        value={largeNumberFormatter((liquidity).toFixed(2))}
                        label="&#8467; - Liquidity"
                        helperText={`$${largeNumberFormatter((liquidity*debtAssetPrice).toFixed(2))}`}
                        onChange={(event) => { mainStore.handleSpanChange(event.target.value) }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Tooltip placement="top" title="The available DEX liquidity with a slippage of β.">
                                        <QuestionMark fontSize="small" />
                                    </Tooltip>
                                </InputAdornment>
                            ),
                            endAdornment: (<InputAdornment position="end">{selectedQuote}</InputAdornment>)
                        }}
                    >
                    </TextField>
                </FormControl>
                <FormControl>
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
                <FormControl>
                    <TextField
                        sx={controlledWidth}
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
                <FormControl>
                    <Autocomplete
                        freeSolo
                        disableClearable
                        options={CLFValues.map((option) => option.value)}
                        value={CLF}
                        onChange={(event, newValue) => {
                            setCLF(newValue);
                          }}
                        inputValue={CLF}
                        onInputChange={(event, newValue) => {
                            setCLF((newValue.match(/^[0-9]+(\.[0-9]{0,2})?/g) || [])[0] || '');
                          }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="CLF"
                        InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <InputAdornment position="start">
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
                <FormControl>
                    <TextField
                        sx={controlledWidth}
                        color="secondary"
                        value={recommendedLTV}
                        label="LTV"
                        helperText="Recommended LTV"
                        onChange={(event) => { setBorrowCap(((event.target.value || '').match(/^[0-9]+(\.[0-9]{0,2})?/g) || [])[0] || '') }}
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
        </Paper>
    )

})
export default LTVCalculator