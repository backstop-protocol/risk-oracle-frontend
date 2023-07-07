import { Box, Divider, Grid, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";

import { largeNumberFormatter } from "../utils/utils";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { timeWindows } from "../stores/config.store";
import { useCombobox } from "downshift";
import { useState } from "react";

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
function getCLFFilter(inputValue) {
    const lowerCasedInputValue = inputValue.toLowerCase()

    return function CLFFilter(item) {
        return (
            !inputValue ||
            item.text.toLowerCase().includes(lowerCasedInputValue) ||
            item.value.toLowerCase().includes(lowerCasedInputValue)
        )
    }
}

function CLFInput(props) {
    const [CLFOptions, setCLFOptions] = useState(CLFValues)
    const setCLF = props.setCLF;
    const clf = props.clf;
    const {
        isOpen,
        getMenuProps,
        getInputProps,
        highlightedIndex,
        getItemProps,
    } = useCombobox({
        items: CLFOptions,
        initialSelectedItem: CLFValues[0],
        itemToString(item) { return item ? item.value : '' },
        // onInputValueChange: ({ inputValue }) => {
        //     setCLFOptions(CLFValues.filter(getCLFFilter(inputValue), setCLF(inputValue)
        //     ),
        //     )
        // },
        onInputValueChange: ({ inputValue }) => {
            setCLF(Number(inputValue))
        },
        setCLF,
        onSelectedItemChange: ((newItem) => setCLF(Number(newItem.selectedItem.value)))
    })
    return (
        <div>
            <div>
                <input
                    pattern="[0-9]+"
                    className="ltv-select"
                    style={{ borderColor: isNaN(clf) ? '#FF0000' : '' }}
                    {...getInputProps()}
                />
            </div>
            <ul
                className="ltv-dropdown-content"
                {...getMenuProps()}
            >
                {isOpen &&
                    CLFOptions.map((item, index) => (
                        <li
                            className="ltv-dropdown-item"
                            style={{
                                padding: '4px',
                                backgroundColor: highlightedIndex === index ? '#bde4ff' : null,
                            }}
                            key={`${item}${index}`}
                            {...getItemProps({
                                item,
                                index,
                            })}
                        >
                            <div className="ltv-dropdown-text">{item.text}</div>
                            <div className="ltv-dropdown-value">{item.value}</div>

                        </li>
                    ))}
            </ul>
        </div>
    )
}

function CalculatorItem(props) {
    return <Grid item xs={12} sm={6} lg={4} xl={1.5}>
        <Paper
            sx={{
                px: 2,
                pt: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'start',
                alignItems: 'center',
                height: '1'
            }}
        >
            <Box sx={{maxHeight:"0.5", minHeight:"0.5", alignItems:"center", justifyContent:"center"}}>
                <Typography textAlign={'center'}>{props.title}{props.subtitle ? <br /> : ''}</Typography>
                {props.subtitle ? <Typography textAlign={'center'} variant="subtitle2">{props.subtitle}</Typography> : ''}
                </Box>
            <Divider />
            <Box sx={{display:"flex", flexDirection:"column", minHeight:"50%", alignItems:"center", justifyContent:"center"}}>
                {props.mainContent}
                {props.otherContent ? props.otherContent : ''}
                </Box>
        </Paper>
    </Grid>
}

const LTVCalculator = observer(props => {
    if (!mainStore.averages) {
        return
    }
    const {quotes, selectedQuote,setSelectedQuote, span, liquidity, volatility, slippage, borrowCap, setBorrowCap, CLF, setCLF, recommendedLTV} = props;
    const slippageOptions = [1, 5, 10, 15, 20];
    const debtAssetPrice = mainStore.debtAssetPrices[selectedQuote] ? mainStore.debtAssetPrices[selectedQuote] : undefined;

    return (
        <Grid className="ltvCalculator" container direction="row" flexWrap="wrap">
            <CalculatorItem title="Debt Asset" mainContent={<Select value={selectedQuote ? selectedQuote : "USDC"} onChange={(event) => { setSelectedQuote(event.target.value) }}>{quotes.map((_) => <MenuItem key={_} value={_}>{_}</MenuItem>)}</Select>} />
            <CalculatorItem title="Time Frame" mainContent={<Select value={span} onChange={(event) => { mainStore.handleSpanChange(event.target.value) }}>{Object.entries(timeWindows).map(([tw, v]) => <MenuItem key={tw} value={v}>{tw}</MenuItem>)}</Select>} />
            <CalculatorItem title="&#8467;" subtitle="Liquidity" mainContent={<Typography>{largeNumberFormatter((liquidity).toFixed(2))}</Typography>} otherContent={<Typography>${largeNumberFormatter((liquidity * debtAssetPrice).toFixed(2))}</Typography>} />
            <CalculatorItem title="&sigma;" subtitle="Volatility" mainContent={<Typography>{(volatility * 100).toFixed(2)}%</Typography>} />
            <CalculatorItem title="&beta;" subtitle="Liquidation bonus" mainContent={<Select value={slippage} onChange={(event) => { mainStore.handleSlippageChange(event.target.value) }}>{slippageOptions.map((_) => <MenuItem key={_} value={_}>{_}%</MenuItem>)}</Select>} />
            <CalculatorItem title="&#100;" subtitle="Borrow cap m$" mainContent={<TextField value={borrowCap} onChange={(event) => { setBorrowCap(((event.target.value || '').match(/^[0-9]+(\.[0-9]{0,2})?/g) || [])[0] || '') }} />} />
            <CalculatorItem title="CLF" subtitle="Confidence Level Factor" mainContent={<CLFInput setCLF={setCLF} CLF={CLF} />} />
            <CalculatorItem title="Recommended LTV" mainContent={<Typography style={{ color: isNaN(recommendedLTV) ? '#FF0000' : '' }}>{isNaN(recommendedLTV) ? 'CLF must be a number' : recommendedLTV < 0 ? 0 : recommendedLTV}</Typography>} />
        </Grid>
    )

})
export default LTVCalculator