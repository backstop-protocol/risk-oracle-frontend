import { useEffect, useState } from "react";

import { largeNumberFormatter } from "../utils/utils";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { timeWindows } from "../stores/config.store";

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
            <table>
                <thead>
                    <tr>
                        <th scope="col">Borrowed Asset</th>
                        <th scope="col">Time Frame</th>
                        <th scope="col">a<br/>(Volatility %)</th>
                        <th scope="col">l<br/>(liquidity)</th>
                        <th scope="col">b<br/>(liquidation bonus)</th>
                        <th scope="col">d<br/>(borrow caps)</th>
                        <th scope="col">CLF</th>
                        <th scope="col">Recommended LTV</th>
                    </tr>
                </thead>
                <tbody>
                    <td><select onChange={(event) => { setSelectedQuote(event.target.value) }}>{quotes.map((_) => <option key={_} value={_}>{_}</option>)}</select></td>
                    <td><select value={span} onChange={(event) => { mainStore.handleSpanChange(event.target.value) }}>{Object.entries(timeWindows).map(([tw, v]) => <option key={tw} value={v}>{tw}</option>)}</select></td>
                    <td>{(volatility * 100).toFixed(2)}%</td>
                    <td>{largeNumberFormatter((liquidity).toFixed(2))}</td>
                    <td><select value={slippage} onChange={(event) => { mainStore.handleSlippageChange(event.target.value) }}>{slippageOptions.map((_) => <option key={_} value={_}>{_}</option>)}</select></td>
                    <td><input type="tel" value={borrowCap} onChange={(event) => { setBorrowCap(((event.target.value || '').match(/^[0-9]+(\.[0-9]{0,2})?/g) || [])[0] || '') }} /></td>
                    <td>{clf}</td>
                    <td>{recommendedLTV < 0 ? 0 : recommendedLTV}</td>
                </tbody>
            </table>
        </article>
    )

})

export default LTVCalculator