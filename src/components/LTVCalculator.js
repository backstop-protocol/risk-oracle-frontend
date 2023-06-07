import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { timeWindows } from "../stores/config.store";
import { useState } from "react";

const LTVCalculator = observer(props => {
    const quotes = props.quotes;
    const [selectedQuote, setSelectedQuote] = useState(quotes[0]);
    const [recommendedLTV, setRecommendedLTV] = useState(0);
    const [borrowCap, setBorrowCap] = useState(0);
    const span = mainStore.selectedSpan;
    const slippage = mainStore.selectedSlippage;
    const slippageOptions = [1, 5, 10, 15, 20];


    return (
        <article style={{ marginTop: 0, }} className="box">
            <table>
                <thead>
                    <tr>
                        <th scope="col">Borrowed Asset</th>
                        <th scope="col">Time Frame</th>
                        <th scope="col">a (Volatility %)</th>
                        <th scope="col">l (liquidity)</th>
                        <th scope="col">b (liquidation bonus)</th>
                        <th scope="col">d (borrow caps)</th>
                        <th scope="col">CLF</th>
                        <th scope="col">Recommended LTV</th>
                    </tr>
                </thead>
                <tbody>
                    <td><select onChange={(event) => { setSelectedQuote(event.target.value) }}>{quotes.map((_) => <option key={_} value={_}>{_}</option>)}</select></td>
                    <td><select value={span} onChange={(event) => { mainStore.handleSpanChange(event.target.value) }}>{Object.entries(timeWindows).map(([tw, v]) => <option key={tw} value={v}>{tw}</option>)}</select></td>
                    <td>a</td>
                    <td>l</td>
                    <td><select value={slippage} onChange={(event) => { mainStore.handleSlippageChange(event.target.value) }}>{slippageOptions.map((_) => <option key={_} value={_}>{_}</option>)}</select></td>
                    <td><input type="tel" value={borrowCap} onChange={(event)=> {setBorrowCap(((event.target.value || '').match(/^[0-9]+(\.[0-9]{0,2})?/g) || [])[0] || '')}} /></td>
                    <td>clf</td>
                    <td>{recommendedLTV}</td>
                </tbody>
            </table>
        </article>
    )

})

export default LTVCalculator