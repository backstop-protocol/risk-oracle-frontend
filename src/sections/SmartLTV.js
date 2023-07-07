import { smartLTVCode, updateCode } from "../resources/SmartLTVCode";
import { useEffect, useState } from "react";

import LTVCalculator from "../components/LTVCalculator";
import LTVCodeSection from "../components/LTVCodeSection";
import LTVTextSection from "../components/LTVTextSection";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";

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
    const [borrowCap, setBorrowCap] = useState(100);
    const [borrowInKind, setBorrowInKind] = useState(0);
    const [CLF, setCLF] = useState(100);
    const [recommendedLTV, setRecommendedLTV] = useState(0)
    // code editor variables
    const [updatedCode, setUpdatedCode] = useState(smartLTVCode);

    //resetting quote on quotes change
    useEffect(() => {
        setSelectedQuote(quotes[0]);
        mainStore.updateDebtAssetPrices(quotes[0]);
    }, [quotes]);

    //updating price
    useEffect(() => {
        if (!mainStore.debtAssetPrices[selectedQuote] && selectedQuote) {
            mainStore.updateDebtAssetPrices(selectedQuote);
        }
    }, [selectedQuote]);
    useEffect(() => {
        console.log(borrowCap, mainStore.debtAssetPrices[selectedQuote])
        setBorrowInKind(borrowCap / mainStore.debtAssetPrices[selectedQuote]);
    }, [borrowCap, selectedQuote]);



    useEffect(() => {
        const up = updateCode(selectedQuote, selectedBaseName, span, CLF, borrowCap, slippage);
        setUpdatedCode(up)
    }, [CLF, borrowCap, selectedBaseName, selectedQuote, slippage, span])


    //computing recommended LTV
    useEffect(() => {
        console.log('liquidity', liquidity)
        console.log('borrowInKind', borrowInKind)
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

    return (
        <div className="ltvSection">
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
            <LTVCodeSection updatedCode={updatedCode} />
        </div>
    )
})

export default LTVSection