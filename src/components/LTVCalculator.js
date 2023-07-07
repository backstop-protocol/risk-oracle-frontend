import { Container, Divider, Grid, MenuItem, Paper, Select, Typography } from "@mui/material";
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
                justifyContent:'start',
                alignItems:'center',
                minHeight: 180,
                height:'1'
            }}
        >
            <Container minHeight="O.5">
                <Typography textAlign={'center'}>{props.title}{props.subtitle ? <br /> : ''}</Typography>
                {props.subtitle ? <Typography textAlign={'center'} variant="subtitle2">{props.subtitle}</Typography> : ''}
            </Container>
            <Divider sx={{ marginTop: "5px", marginBottom: '10px' }} />
            <Container sx={{ height: '0.5', textAlign: 'center', direction: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {props.mainContent}
                {props.otherContent ? props.otherContent : ''}
            </Container>
        </Paper>
    </Grid>
}

const LTVCalculator = observer(props => {
    const quotes = mainStore.selectedQuotes;
    const [selectedQuote, setSelectedQuote] = useState(quotes[0]);
    const [recommendedLTV, setRecommendedLTV] = useState(0);
    const averages = mainStore.averages;
    const [borrowCap, setBorrowCap] = useState(0);
    const [borrowCapInKind, setBorrowCapInKind] = useState(undefined);
    const span = mainStore.selectedSpan;
    const slippage = mainStore.selectedSlippage;
    const slippageOptions = [1, 5, 10, 15, 20];
    const volatility = averages[selectedQuote] ? averages[selectedQuote]['volatility'] : 0;
    const liquidity = averages[selectedQuote] ? averages[selectedQuote]['average'] : 0;
    const [clf, setCLF] = useState(10);
    const debtAssetPrice = mainStore.debtAssetPrices[selectedQuote] ? mainStore.debtAssetPrices[selectedQuote] : undefined;

    useEffect(() => {
        if (!mainStore.debtAssetPrices[selectedQuote]) {
            mainStore.updateDebtAssetPrices(selectedQuote);
        }
    }, [selectedQuote]);

    useEffect(() => {
        setSelectedQuote(quotes[0]);
    }, [quotes]);


    useEffect(() => {
        setBorrowCapInKind(borrowCap / debtAssetPrice);
    }, [borrowCap, debtAssetPrice, setBorrowCapInKind]);

    useEffect(() => {
        //         1/ calc racine carré de l / d ==> on appelle ça (a)
        const sqrRoot = Math.sqrt(liquidity / borrowCapInKind);
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
    }, [liquidity, slippage, volatility, clf, borrowCapInKind])

    return (<Paper>
        <Grid container direction="row" flexWrap="wrap">
            <CalculatorItem title="Debt Asset" mainContent={<Select onChange={(event) => { setSelectedQuote(event.target.value) }}>{quotes.map((_) => <MenuItem key={_} value={_}>{_}</MenuItem>)}</Select>} />
            <CalculatorItem title="Time Frame" mainContent={<Select value={span} onChange={(event) => { mainStore.handleSpanChange(event.target.value) }}>{Object.entries(timeWindows).map(([tw, v]) => <MenuItem key={tw} value={v}>{tw}</MenuItem>)}</Select>} />
            <CalculatorItem title="&#8467;" subtitle="Liquidity" mainContent={<Typography>{largeNumberFormatter((liquidity).toFixed(2))}</Typography>} otherContent={<Typography>${largeNumberFormatter((liquidity * debtAssetPrice).toFixed(2))}</Typography>} />
            <CalculatorItem title="&sigma;" subtitle="Volatility" mainContent={<Typography>{(volatility * 100).toFixed(2)}%</Typography>} />
            <CalculatorItem title="&beta;" subtitle="Liquidation bonus" mainContent={<Select value={slippage} onChange={(event) => { mainStore.handleSlippageChange(event.target.value) }}>{slippageOptions.map((_) => <MenuItem key={_} value={_}>{_}%</MenuItem>)}</Select>} />
            <CalculatorItem title="&#100;" subtitle="Borrow cap $" mainContent={<Select value={slippage} onChange={(event) => { mainStore.handleSlippageChange(event.target.value) }}>{slippageOptions.map((_) => <MenuItem key={_} value={_}>{_}%</MenuItem>)}</Select>} />
            <CalculatorItem title="CLF" subtitle="Confidence Level Factor" mainContent={<CLFInput setCLF={setCLF} clf={clf} />} />
            <CalculatorItem title="Recommended LTV" mainContent={<Typography style={{ color: isNaN(recommendedLTV) ? '#FF0000' : '' }}>{isNaN(recommendedLTV) ? 'CLF must be a number' : recommendedLTV < 0 ? 0 : recommendedLTV}</Typography>} />
        </Grid>
    </Paper>
    )

})
export default LTVCalculator