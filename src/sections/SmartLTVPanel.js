import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import LTVCalculator from "../components/LTVCalculator";
import LTVCodeSection from "../components/LTVCodeSection";
import LTVTextSection from "../components/LTVTextSection";
import Web3Data from "../components/Web3Data";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { updateCode } from "../components/LTVCodeGenerator";

const LTVSection = observer(props => {
    const quotes = mainStore.selectedQuotes;
    const averages = mainStore.averages;
    const selectedBaseName = mainStore.selectedAsset.name;
    //ltv variables
    const [selectedQuote, setSelectedQuote] = useState(quotes[0]);
    const span = mainStore.selectedSpan;
    const liquidity = averages[selectedQuote] ? averages[selectedQuote]['average'] : 0;
    const volatility = averages[selectedQuote] ? averages[selectedQuote]['volatility'] : 0;
    const slippage = mainStore.selectedSlippage;
    const [borrowCap, setBorrowCap] = useState(0.7);
    const [borrowInKind, setBorrowInKind] = useState(0);
    const [CLF, setCLF] = useState(7);
    const [recommendedLTV, setRecommendedLTV] = useState(0)
    // code editor variables
    const defaultCode = mainStore.defaultCode;
    const [updatedCode, setUpdatedCode] = useState(defaultCode);


    useEffect(() => {
        setSelectedQuote(quotes[0]);
        for (const quote of quotes) {
            mainStore.updateDebtAssetPrices(quote);
        }
    }, [quotes]);

    //updating price
    useEffect(() => {
        if (!mainStore.debtAssetPrices[selectedQuote] && selectedQuote) {
            mainStore.updateDebtAssetPrices(selectedQuote);
        }
    }, [selectedQuote]);
    useEffect(() => {
        setBorrowInKind(borrowCap / mainStore.debtAssetPrices[selectedQuote]);
    }, [borrowCap, selectedQuote]);

    useEffect(() => {
        const up = updateCode(selectedQuote, selectedBaseName, span, CLF, borrowCap, slippage);
        setUpdatedCode(up)
    }, [CLF, borrowCap, selectedBaseName, selectedQuote, slippage, span])


    //computing recommended LTV
    useEffect(() => {
        //         1/ calc racine carré de l / d ==> on appelle ça (a)
        const sqrRoot = Math.sqrt(liquidity / borrowInKind);
        // const sqrRoot = Math.sqrt(liquidity / (borrowCap / debtAssetPrice));
        //         2/ calc theta / (a) ==> on appelle ça (b)
        const sigmaOverSqrRoot = volatility / sqrRoot;
        //         3/ calc -c * (b) ==> on appelle ça (c)
        const clfMinusSigmaOverSqrRoot = (-1 * CLF) * sigmaOverSqrRoot;
        //         4/ calc exponentielle de (c)  ==> on appelle ça (d)
        const exponential = Math.exp(clfMinusSigmaOverSqrRoot);
        //         5/ calc (d) - beta
        const ltv = exponential - (slippage / 100);
        setRecommendedLTV(ltv.toFixed(2));
    }, [liquidity, slippage, volatility, borrowInKind, CLF])

    //computing recommended CLF
    useEffect(() => {
        console.log('firing')
    }, [])


    return (
        <Box sx={{ display: "flex", height: "100vh", width: "93vw", flexDirection: "column", alignItems: "center", scrollSnapAlign: "center", paddingTop: "8vh" }}>
            <Web3Data />
            <LTVTextSection />
            <LTVCalculator
                selectedBaseSymbol={selectedBaseName}
                quotes={quotes}
                selectedQuote={selectedQuote}
                setSelectedQuote={setSelectedQuote}
                span={span}
                liquidity={liquidity}
                volatility={volatility}
                slippage={slippage}
                borrowCap={borrowCap}
                setBorrowCap={setBorrowCap}
                CLF={CLF}
                setCLF={setCLF}
                recommendedLTV={recommendedLTV}
                setRecommendedLTV={setRecommendedLTV} />
            <LTVCodeSection defaultCode={defaultCode} updatedCode={updatedCode} />
        </Box>
    )
})

export default LTVSection