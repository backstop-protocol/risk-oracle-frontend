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
                    <div className="ltv-liquidity-value-div"><span>{largeNumberFormatter((liquidity).toFixed(2))} {selectedBase}</span><span style={{fontSize: '0.7rem'}}>${largeNumberFormatter((liquidity*basePrice).toFixed(2))}</span>
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
        </Paper>

                
                
                
                
                
    )

})
export default LTVCalculator