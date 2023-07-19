
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { useState } from "react";
import { useCombobox } from "downshift";
import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Stack, Typography } from "@mui/material";
import { largeNumberFormatter } from "../utils/utils";
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
    const handleCLFandLTVChanges = props.handleCLFandLTVChanges;
    const CLF = props.CLF;
    const {
        isOpen,
        getMenuProps,
        getInputProps,
        highlightedIndex,
        getItemProps,
    } = useCombobox({
        items: CLFOptions,
        inputValue: CLF,
        itemToString(item) { return item ? item.value : '' },
        onInputValueChange: ({ inputValue }) => {
            handleCLFandLTVChanges('clf', Number(inputValue))
        },
        handleCLFandLTVChanges,
        onSelectedItemChange: ((newItem) => handleCLFandLTVChanges('clf', Number(newItem.selectedItem.value)))
    })
    return (
        <div>
            <div>
                <input
                    pattern="[0-9]+"
                    className="ltv-select"
                    style={{ borderColor: isNaN(CLF) ? '#FF0000' : '' }}
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


const LTVCalculatorMobile = observer(props => {
    if (!mainStore.averages) {
        return
    }
    const { quotes, selectedQuote, handleCLFandLTVChanges, setSelectedQuote, span, liquidity, volatility, slippage, borrowCap, setBorrowCap, CLF, recommendedLTV } = props;
    const slippageOptions = [1, 5, 10, 15, 20];
    const selectedBase = mainStore.selectedBaseSymbol;
    const basePrice = mainStore.coingeckoPriceInfos[selectedBase].price;
    const [open, setOpen] = useState(false);

    const gridItemSx = {
        textAlign: "center"
    }
    const clfSx = {
        textAlign: "center",
        width: "80%"
    }
    function InputDialog(props) {
        const { type, title, onClose, selectedValue, open, explanation, module } = props;
        const [input, setInput] = useState(selectedValue)
        const handleClose = (input = selectedValue) => {
            onClose(input, type);
        };
        return <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {explanation}
                </DialogContentText>
                {type === "borrowCap" ?
                    <Box>
                        <input className="ltv-select" value={input} onChange={(event) => { setInput(((event.target.value || '').match(/^[0-9]+(\.[0-9]{0,2})?/g) || [])[0] || '') }} />
                        <Button onClick={() => handleClose(input)}>OK</Button>
                    </Box>
                    :
                    type === "CLF" ?
                        <Box>
                            <input className="ltv-select" value={input} onChange={(event) => { setInput(((event.target.value || '').match(/^[0-9]+(\.[0-9]{0,2})?/g) || [])[0] || '') }} />
                            <Button onClick={() => handleClose(input)}>OK</Button>
                        </Box>
                        :
                        type === "LTV" ?
                            <Box>
                                <input className="ltv-select" type="number" max="100" min="0" value={input} onChange={(event) => { setInput(((event.target.value || '').match(/^[0-9]+(\.[0-9]{0,2})?/g) || [])[0] || '') }} />
                                <Button onClick={() => handleClose(input)}>OK</Button>
                            </Box>
                            : ""}
                {module}
            </DialogContent>
        </Dialog>
    }

    function handleOpen(value) {
        setOpen(value);
    }
    function handleClose(value, type) {
        console.log(value, type)
        setOpen(false)
        if (type === "quote") {
            setSelectedQuote(value)
        }
        if (type === "span") {
            mainStore.handleSpanChange(value)
        }
        if (type === "borrowCap") {
            setBorrowCap(value);
        }
        if (type === "CLF") {
            handleCLFandLTVChanges('clf', value)
        }
        if (type === "LTV") {
            handleCLFandLTVChanges('ltv', value)
        }
    }



    return (
        <Box item sx={gridItemSx}>
        <Divider sx={{margin:"5% 0px 5% 0px"}} />
        <Grid container spacing={3}
         direction="row"
         justifyContent="center"
         alignItems="center">
            <Grid item sx={gridItemSx}>
                <Typography>Debt Asset</Typography>
                <Button onClick={() => handleOpen('quote')} variant="outlined">{selectedQuote}</Button>
                <InputDialog
                    type={"quote"}
                    selectedValue={selectedQuote}
                    open={open === 'quote'}
                    onClose={handleClose}
                    title={"select asset"}
                    explanation={"The asset pair against which the data is being fetched."}
                    module={<Stack>
                        {quotes.map((_) => <Button id={_} onClick={() => handleClose(_, "quote")}>{_}</Button>)}
                    </Stack>} />
            </Grid>
            <Grid item sx={gridItemSx}>
                <Typography>Time Frame</Typography>
                <Button onClick={() => handleOpen('span')} variant="outlined">{span}</Button>
                <InputDialog
                    type={"span"}
                    selectedValue={span}
                    open={open === 'span'}
                    onClose={handleClose}
                    title={"select time span"}
                    explanation={"The time frame that is used for fetching the data."}
                    module={<Stack>
                        {Object.entries(timeWindows).map(([tw, v]) => <Button key={tw} onClick={() => handleClose(v, "span")}>{tw}</Button>)}
                    </Stack>}
                />
            </Grid>
            <Grid item sx={gridItemSx}>
                <Typography>Liquidity</Typography>
                <Button variant="outlined" onClick={() => handleOpen('liquidity')}>{largeNumberFormatter((liquidity).toFixed(2))} {selectedBase}</Button>
                <InputDialog
                    open={open === 'liquidity'}
                    onClose={handleClose}
                    title={"Liquidity"}
                    explanation={"The available DEX liquidity with a slippage of β."}
                />
            </Grid>
            <Grid item sx={gridItemSx}>
                <Typography>Volatility</Typography>
                <Button variant="outlined" onClick={() => handleOpen('volatility')}>{(volatility * 100).toFixed(2)}%</Button>
                <InputDialog
                    open={open === 'volatility'}
                    onClose={handleClose}
                    title={"Volatility"}
                    explanation={"The price volatility between the collateral and debt asset (normalized to the base asset price)."}
                />
            </Grid>
            <Grid item sx={gridItemSx}>
                <Typography>Liquidation bonus</Typography>
                <Button variant="outlined" onClick={() => handleOpen('liquidation')}>{slippage}%</Button>
                <InputDialog
                    open={open === 'liquidation'}
                    onClose={handleClose}
                    title={"Liquidation Bonus"}
                    explanation={"The bonus liquidators get as an incentive to liquidate a position."}
                />
            </Grid>
            <Grid item sx={gridItemSx}>
                <Typography>Borrow cap ($M)</Typography>
                <Button variant="outlined" onClick={() => handleOpen('borrowCap')}>{borrowCap}</Button>
                <InputDialog
                    type={"borrowCap"}
                    selectedValue={borrowCap}
                    open={open === 'borrowCap'}
                    onClose={handleClose}
                    title={"Borrow Cap ($M)"}
                    explanation={"The borrow cap of the debt asset in USD value."}
                />
            </Grid>
        </Grid>
        <Divider sx={{margin:"5% 0px 5% 0px"}} />
        <Stack sx={{justifyContent:"center", alignItems:"center"}}>
            <Box sx={clfSx}>
                <Typography>CLF</Typography>
                <Button variant="outlined" onClick={() => handleOpen('CLF')}>{CLF}</Button>
                <InputDialog
                    type={"CLF"}
                    selectedValue={CLF}
                    open={open === 'CLF'}
                    onClose={handleClose}
                    title={"Confidence Level Factor"}
                    explanation={"Confidence Level Factor. The higher it is, the odds of insolvency are decreasing."}
                />
            </Box>
            <Box item sx={clfSx}>
                <Typography>LTV</Typography>
                <Button variant="outlined" onClick={() => handleOpen('LTV')}>{recommendedLTV}</Button>
                <InputDialog
                    type={"LTV"}
                    selectedValue={recommendedLTV}
                    open={open === 'LTV'}
                    onClose={handleClose}
                    title={"LTV"}
                    explanation={"Loan to Value ratio"}
                />
            </Box>
        </Stack>
        <Divider sx={{margin:"5% 0px 5% 0px"}} />
            </Box>

        // <Paper className="ltv-container" sx={{ width: "100%" }}>
        //     <div className="ltv-table">
        //         <div className="ltv-asset" title="The asset pair against which the data is being fetched.">
        //             <div className="ltv-title-div">
        //                 <small >Debt Asset</small></div>
        //             <div className="ltv-value-div">
        //             <select className="ltv-select" onChange={(event) => { setSelectedQuote(event.target.value) }}>{quotes.map((_) => <option key={_} value={_}>{_}</option>)}</select>
        //             </div>
        //         </div>
        //         <div className="ltv-asset" title="The time frame that is used for fetching the data.">
        //             <div className="ltv-title-div">
        //                 <small >Time Frame</small></div>
        //             <div className="ltv-value-div">
        //             <select className="ltv-select" value={span} onChange={(event) => { mainStore.handleSpanChange(event.target.value) }}>{Object.entries(timeWindows).map(([tw, v]) => <option key={tw} value={v}>{tw}</option>)}</select>
        //             </div>
        //         </div>
        //         <div className="ltv-asset" title="The available DEX liquidity with a slippage of β.">
        //             <div className="ltv-title-div">
        //                 <small>&#8467;<br />liquidity</small>
        //             </div>
        //             <div className="ltv-liquidity-value-div"><span>{largeNumberFormatter((liquidity).toFixed(2))} {selectedBase}</span><span style={{ fontSize: '0.7rem' }}>${largeNumberFormatter((liquidity * basePrice).toFixed(2))}</span>
        //             </div>
        //         </div>
        //         <div className="ltv-asset" title="The price volatility between the collateral and debt asset (normalized to the base asset price).">
        //             <div className="ltv-title-div">
        //                 <small>&sigma;<br />Volatility</small>
        //             </div>
        //             <div className="ltv-value-div">
        //             {(volatility * 100).toFixed(2)}%
        //             </div>
        //         </div>
        //         <div className="ltv-asset" title="The bonus liquidators get as an incentive to liquidate a position.">
        //             <div className="ltv-title-div">
        //                 <small>&beta;<br />liquidation bonus</small>
        //             </div>
        //             <div className="ltv-value-div">
        //             <select className="ltv-select" value={slippage} onChange={(event) => { mainStore.handleSlippageChange(event.target.value) }}>{slippageOptions.map((_) => <option key={_} value={_}>{_}%</option>)}</select>
        //             </div>
        //         </div>
        //         <div className="ltv-asset" title="The borrow cap of the debt asset in USD value.">
        //             <div className="ltv-title-div">
        //                 <small><em>&#100;</em><br />borrow cap ($M)</small>
        //             </div>
        //             <div className="ltv-value-div">
        //             </div>
        //         </div>
        //         <div className="ltv-asset" title="Confidence Level Factor. The higher it is, the odds of insolvency are decreasing.">
        //             <div className="ltv-title-div">
        //                 <small>CLF</small>
        //             </div>
        //             <div className="ltv-value-div">
        //             <input className="ltv-select" value={CLF} onChange={(event) => { handleCLFandLTVChanges('clf', event.target.value) }} />
        //             </div>
        //         </div>
        //         <div className="ltv-asset" title="Loan To Value ratio.">
        //             <div className="ltv-title-div">
        //                 <small>Recommended LTV (%)</small>
        //             </div>
        //             <div className="ltv-value-div">
        //             </div>
        //         </div>
        //     </div>
        // </Paper>






    )

})
export default LTVCalculatorMobile