import { useEffect, useState } from "react";

import { largeNumberFormatter } from "../utils/utils";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { timeWindows } from "../stores/config.store";
import { useCombobox } from "downshift";

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
                    className="ltv-select"
                    style={{borderColor: isNaN(clf) ? '#FF0000' : ''}}
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
    const [clf, setCLF] = useState(10);
    const [debtAssetPrice, setDebtAssetPrice] = useState(0)
    
    // useEffect(()=> {
    //     async function getInitialPrice(selectedQuote, setDebtAssetPrice){
    //         const id = coingeckoMap[selectedQuote.toLowerCase()];
    //         const url = `https://api.coingecko.com/api/v3/coins/${id}`
    //         const data = await axios.get(url);
    //         setDebtAssetPrice((data.data['market_data']['current_price']['usd']).toFixed(2));
    //     }
    //     getInitialPrice(selectedQuote, setDebtAssetPrice);
        
    // }, [selectedQuote])

    useEffect(() => {
        //         1/ calc racine carré de l / d ==> on appelle ça (a)
        const sqrRoot = Math.sqrt(liquidity / borrowCap);
        // const sqrRoot = Math.sqrt(liquidity / (borrowCap / debtAssetPrice));
        //         2/ calc theta / (a) ==> on appelle ça (b)
        const sigmaOverSqrRoot = volatility / sqrRoot;
        //         3/ calc -c * (b) ==> on appelle ça (c)
        const clfMinusSigmaOverSqrRoot = (-1 * clf) * sigmaOverSqrRoot;
        //         4/ calc exponentielle de (c)  ==> on appelle ça (d)
        const exponential = Math.exp(clfMinusSigmaOverSqrRoot);
        //         5/ calc (d) - beta
        const ltv = exponential - (slippage / 100);
        setRecommendedLTV(ltv.toFixed(2));
    }, [borrowCap, liquidity, slippage, volatility, clf])

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
                        <small>&#8467;<br />liquidity</small>
                    </div>
                    <div className="ltv-value-div">{largeNumberFormatter((liquidity).toFixed(2))}
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
                        <small>&beta;<br />liquidation bonus</small>
                    </div>
                    <div className="ltv-value-div"><select className="ltv-select" value={slippage} onChange={(event) => { mainStore.handleSlippageChange(event.target.value) }}>{slippageOptions.map((_) => <option key={_} value={_}>{_}%</option>)}</select>
                    </div>
                </div>
                <div className="ltv-asset" title="The borrow cap of the debt asset in USD value.">
                    <div className="ltv-title-div">
                        <small><em>&#100;</em><br />borrow cap</small>
                    </div>
                    <div className="ltv-value-div"><input className="ltv-select" value={borrowCap} onChange={(event) => { setBorrowCap(((event.target.value || '').match(/^[0-9]+(\.[0-9]{0,2})?/g) || [])[0] || '') }} />
                    </div>
                </div>
                <div className="ltv-asset" title="Confidence Level Factor. The higher it is, the odds of insolvency are decreasing.">
                    <div className="ltv-title-div">
                        <small>CLF</small>
                    </div>
                    <div className="ltv-value-div"><CLFInput setCLF={setCLF} clf={clf} />
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