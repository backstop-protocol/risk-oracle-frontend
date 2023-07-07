import { Box, Divider, Grid, Paper, Typography } from "@mui/material";

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
        <article style={{ marginTop: 0, marginBottom: 0 }} className="ltv-container">
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
                    <div className="ltv-value-div"><select className="ltv-select" value={span} onChange={(event) => { mainStore.handleSpanChange(event.target.value) }}>{Object.entries(timeWindows).map(([tw, v]) => <option key={tw} value={v}>{tw}</option>)}</select>
                    </div>
                </div>
                <div className="ltv-asset" title="The available DEX liquidity with a slippage of β.">
                    <div className="ltv-title-div">
                        <small>&#8467;<br />Liquidity</small>
                    </div>
                    <div className="ltv-liquidity-value-div"><span>{largeNumberFormatter((liquidity).toFixed(2))}</span><span style={{fontSize: '0.7rem'}}>${largeNumberFormatter((liquidity*debtAssetPrice).toFixed(2))}</span>
                    </div>
                </div>
                <div className="ltv-asset" title="The price volatility between the collateral and debt asset (normalized to the base asset price).">
                    <div className="ltv-title-div">
                        <small>&sigma;<br />Volatility</small>
                    </div>
                    <div className="ltv-value-div">{(volatility * 100).toFixed(2)}%
                    </div>
                </div>
                <div className="ltv-asset" title="The bonus liquidators get as an incentive to liquidate a position.">
                    <div className="ltv-title-div">
                        <small>&beta;<br />Liquidation bonus</small>
                    </div>
                    <div className="ltv-value-div"><select className="ltv-select" value={slippage} onChange={(event) => { mainStore.handleSlippageChange(event.target.value) }}>{slippageOptions.map((_) => <option key={_} value={_}>{_}%</option>)}</select>
                    </div>
                </div>
                <div className="ltv-asset" title="The borrow cap of the debt asset in USD value.">
                    <div className="ltv-title-div">
                        <small><em>&#100;</em><br />Borrow cap $</small>
                    </div>
                    <div className="ltv-value-div"><input className="ltv-select" value={borrowCap} onChange={(event) => { setBorrowCap(((event.target.value || '').match(/^[0-9]+(\.[0-9]{0,2})?/g) || [])[0] || '') }} />
                    </div>
                </div>
                <div className="ltv-asset" title="Confidence Level Factor. The higher it is, the odds of insolvency are decreasing.">
                    <div className="ltv-title-div">
                        <small>CLF<br />Confidence Level Factor</small>
                    </div>
                    <div className="ltv-value-div"><CLFInput setCLF={setCLF} clf={CLF} />
                    </div>
                </div>
                <div className="ltv-asset" title="Loan To Value ratio.">
                    <div className="ltv-title-div">
                        <small>Recommended LTV</small>
                    </div>
                    <div className="ltv-value-div" style={{color: isNaN(recommendedLTV) ? '#FF0000' : ''}}>{isNaN(recommendedLTV) ? 'CLF must be a number' : recommendedLTV < 0 ? 0 : recommendedLTV}
                    </div>
                </div>
            </div>
        </article>
    )

})
export default LTVCalculator