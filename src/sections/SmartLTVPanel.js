import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import LTVCalculator from "../components/LTVCalculator";
import LTVCodeSection from "../components/LTVCodeSection";
import LTVTextSection from "../components/LTVTextSection";
import Web3Data from "../components/Web3Data";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { updateCode } from "../components/LTVCodeGenerator";
import { findCLFFromParameters, findLTVFromParameters, roundTo } from "../utils/utils";
import LTVDisclaimer from "../components/LTVDisclaimer";

const LTVSection = observer(props => {
    const quotes = mainStore.ltvQuotes;
    const averages = mainStore.averages;
    const selectedBaseName = mainStore.selectedAsset.name;
    const debtAssetPrices = mainStore.debtAssetPrices;
    const basePrice = mainStore.coingeckoPriceInfos[selectedBaseName].price;
    //ltv variables
    const [selectedQuote, setSelectedQuote] = useState(quotes[0]);
    const span = mainStore.selectedSpan;
    const liquidity = averages[selectedQuote] ? averages[selectedQuote]['average'] : 0;
    const volatility = averages[selectedQuote] ? averages[selectedQuote]['parkinsonVolatility'] : 0;
    const slippage = mainStore.selectedSlippage;
    const borrowCapInUsd = roundTo(liquidity * basePrice / 1e6, 2);
    console.log('test')

    const [borrowCap, setBorrowCap] = useState(borrowCapInUsd);
    const [CLF, setCLF] = useState(7);
    const [recommendedLTV, setRecommendedLTV] = useState(0)
    const [WhatAmIComputing, setWhatAmIComputing] = useState('ltv');
    // code editor variables
    const defaultCode = mainStore.defaultCode;
    const [updatedCode, setUpdatedCode] = useState(defaultCode);

    function handleCLFandLTVChanges(type, value){
        if(type === "clf"){
            setCLF(value);
            setWhatAmIComputing("ltv");
        }
        if(type === "ltv"){
            setRecommendedLTV(value);
            setWhatAmIComputing("clf");
        }

    }

    useEffect(() => {
        setBorrowCap(borrowCapInUsd);
    }, [selectedBaseName, borrowCapInUsd]);

    useEffect(() => {
        setSelectedQuote(quotes[0]);
    }, [quotes]);
    
    useEffect(() => {
        const up = updateCode(selectedQuote, selectedBaseName, span, CLF, borrowCap, slippage);
        setUpdatedCode(up)
    }, [CLF, borrowCap, selectedBaseName, selectedQuote, slippage, span])


    //computing recommended LTV
    useEffect(() => {
        if(WhatAmIComputing === 'ltv' && selectedQuote) {
            const borrowInKind = borrowCap * 1e6 / basePrice;
            const ltv = findLTVFromParameters(liquidity, borrowInKind, volatility, slippage / 100, CLF);
            setRecommendedLTV(ltv.toFixed(2));
        }

        if(WhatAmIComputing === 'clf' && selectedQuote){
                const borrowInKind = borrowCap * 1e6 / basePrice;
                const clf = findCLFFromParameters(recommendedLTV, slippage / 100, liquidity, borrowInKind, volatility);
                setCLF(clf.toFixed(2));
                setWhatAmIComputing('ltv');
        }
    }, [basePrice, liquidity, slippage, volatility, borrowCap, CLF, debtAssetPrices, selectedQuote, WhatAmIComputing, recommendedLTV])


    return (
        <Box sx={{ display: "flex", minHeight:"100vh", width: "93vw", flexDirection: "column", alignItems: "center", scrollSnapAlign: "center", paddingTop: "8vh" }}>
            <Web3Data />
            <LTVTextSection />
            <LTVCalculator
                selectedBaseSymbol={selectedBaseName}
                debtAssetPrices = {debtAssetPrices}
                quotes={quotes}
                selectedQuote={selectedQuote}
                setSelectedQuote={setSelectedQuote}
                handleCLFandLTVChanges = {handleCLFandLTVChanges}
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
            <LTVDisclaimer />
        </Box>
    )
})

export default LTVSection