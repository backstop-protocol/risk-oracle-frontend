import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import LTVCalculator from "../components/LTVCalculator";
import LTVCodeSection from "../components/LTVCodeSection";
import LTVTextSection from "../components/LTVTextSection";
import Web3Data from "../components/Web3Data";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { updateCode } from "../components/LTVCodeGenerator";
import { findLTVFromParameters } from "../utils/utils";

const LTVSection = observer(props => {
    const quotes = mainStore.selectedQuotes;
    const averages = mainStore.averages;
    const selectedBaseName = mainStore.selectedAsset.name;
    const debtAssetPrices = mainStore.debtAssetPrices;
    //ltv variables
    const [selectedQuote, setSelectedQuote] = useState(quotes[0]);
    const span = mainStore.selectedSpan;
    const liquidity = averages[selectedQuote] ? averages[selectedQuote]['average'] : 0;
    const volatility = averages[selectedQuote] ? averages[selectedQuote]['parkinsonVolatility'] : 0;
    const slippage = mainStore.selectedSlippage;
    const [borrowCap, setBorrowCap] = useState(0.7);
    const [CLF, setCLF] = useState(7);
    const [recommendedLTV, setRecommendedLTV] = useState(0)
    // code editor variables
    const defaultCode = mainStore.defaultCode;
    const [updatedCode, setUpdatedCode] = useState(defaultCode);


    useEffect(() => {
        const up = updateCode(selectedQuote, selectedBaseName, span, CLF, borrowCap, slippage);
        setUpdatedCode(up)
    }, [CLF, borrowCap, selectedBaseName, selectedQuote, slippage, span])


    //computing recommended LTV
    useEffect(() => {
        if(debtAssetPrices[selectedQuote]){
            const borrowInKind = borrowCap * 1e6 / debtAssetPrices[selectedQuote];

            const ltv = findLTVFromParameters(liquidity, borrowInKind, volatility, slippage / 100, CLF);
        setRecommendedLTV(ltv.toFixed(2));
        }
        else{
            mainStore.updateDebtAssetPrices(selectedQuote).then(()=>{
            const borrowInKind = borrowCap * 1e6 / debtAssetPrices[selectedQuote];
            const ltv = findLTVFromParameters(liquidity, borrowInKind, volatility, slippage / 100, CLF);
        setRecommendedLTV(ltv.toFixed(2));
            })
        }

        
    }, [liquidity, slippage, volatility, borrowCap, CLF, debtAssetPrices, selectedQuote])

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