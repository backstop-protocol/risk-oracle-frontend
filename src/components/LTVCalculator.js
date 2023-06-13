import { useEffect, useState } from "react";

import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from "@mui/material";
import { largeNumberFormatter } from "../utils/utils";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { timeWindows } from "../stores/config.store";

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
function CLFInput() {
    return (
            <Autocomplete
                id="CLFInput"
                freeSolo
                options={CLFValues.map((option) => option.text)}
                renderInput={(params) => <TextField {...params} label="" />}
            />
    );
}

const LTVCalculator = observer(props => {
    const quotes = props.quotes;
    const [selectedQuote, setSelectedQuote] = useState(quotes[0]);
    const [recommendedLTV, setRecommendedLTV] = useState(0);
    const averages = mainStore.averages;
    const [borrowCap, setBorrowCap] = useState(0);
    const span = mainStore.selectedSpan;
    const slippage = mainStore.selectedSlippage;
    const slippageOptions = [1, 5, 10, 15, 20];
    const volatility = averages[selectedQuote]['volatility'];
    const liquidity = averages[selectedQuote]['average'];
    const clf = 10;


    useEffect(() => {
        //         1/ calc racine carré de l / d ==> on appelle ça (a)
        const sqrRoot = Math.sqrt(liquidity / borrowCap);
        //         2/ calc theta / (a) ==> on appelle ça (b)
        const sigmaOverSqrRoot = volatility / sqrRoot;
        //         3/ calc -c * (b) ==> on appelle ça (c)
        const clfMinusSigmaOverSqrRoot = - clf * sigmaOverSqrRoot;
        //         4/ calc exponentielle de (c)  ==> on appelle ça (d)
        const exponential = Math.exp(clfMinusSigmaOverSqrRoot);
        //         5/ calc (d) - beta
        const ltv = exponential - (slippage / 100);
        setRecommendedLTV(ltv.toFixed(2));
    }, [borrowCap, liquidity, slippage, volatility])
    

    return (
        <article style={{ marginTop: 0, marginBottom: 0 }} className="box">
            <table style={{ marginTop: 0, marginBottom: 0 }}>
                <thead>
                    <tr>
                        <th title="The asset pair against which the data is being fetched." className="ltv-header" scope="col"><small>Debt Asset</small></th>
                        <th title="The time frame that is used for fetching the data." className="ltv-header" scope="col"><small>Time Frame</small></th>
                        <th title="The available DEX liquidity with a slippage of β." className="ltv-header" scope="col"><small>l<br />liquidity</small></th>
                        <th title="The price volatility between the collateral and debt asset (normalized to the base asset price)." className="ltv-header" scope="col"><small>&sigma;<br />Volatility %</small></th>
                        <th title="The bonus liquidators get as an incentive to liquidate a position." className="ltv-header" scope="col"><small>&beta;<br />liquidation bonus</small></th>
                        <th title="The borrow cap of the debt asset in USD value." className="ltv-header" scope="col"><small>d<br />borrow cap</small></th>
                        <th title="Confidence Level Factor. The higher it is, the odds of insolvency are decreasing." className="ltv-header" scope="col"><small>CLF</small></th>
                        <th title="Loan To Value ratio." className="ltv-header" scope="col"><small>Recommended LTV</small></th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ borderBottomStyle: "hidden", textAlign: 'center' }}>
                        <td className="ltv-td"><select className="ltv-select" onChange={(event) => { setSelectedQuote(event.target.value) }}>{quotes.map((_) => <option key={_} value={_}>{_}</option>)}</select></td>
                        <td className="ltv-td"><select className="ltv-select" value={span} onChange={(event) => { mainStore.handleSpanChange(event.target.value) }}>{Object.entries(timeWindows).map(([tw, v]) => <option key={tw} value={v}>{tw}</option>)}</select></td>
                        <td className="ltv-td">{(volatility * 100).toFixed(2)}%</td>
                        <td className="ltv-td">{largeNumberFormatter((liquidity).toFixed(2))}</td>
                        <td className="ltv-td"><select className="ltv-select" value={slippage} onChange={(event) => { mainStore.handleSlippageChange(event.target.value) }}>{slippageOptions.map((_) => <option key={_} value={_}>{_}</option>)}</select></td>
                        <td className="ltv-td"><input className="ltv-select" type="tel" value={borrowCap} onChange={(event) => { setBorrowCap(((event.target.value || '').match(/^[0-9]+(\.[0-9]{0,2})?/g) || [])[0] || '') }} /></td>
                        <td className="ltv-td"><CLFInput /></td>
                        <td className="ltv-td">{recommendedLTV < 0 ? 0 : recommendedLTV}</td>
                    </tr>
                </tbody>
            </table>
        </article>
    )

})

export default LTVCalculator