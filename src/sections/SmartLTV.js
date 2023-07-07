import { useEffect, useState } from "react";

import LTVCalculator from "../components/LTVCalculator";
import LTVCodeSection from "../components/LTVCodeSection";
import LTVTextSection from "../components/LTVTextSection";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { smartLTVCode } from "../resources/SmartLTVCode";

const LTVSection = observer(props => {
    const quotes = mainStore.selectedQuotes;
    const averages = mainStore.averages;
    //ltv variables
    const [selectedQuote, setSelectedQuote] = useState(quotes[0]);
    const span = mainStore.selectedSpan;
    const [liquidity, setLiquidity] = useState(0);
    const [volatility, setVolatility] = useState(0);
    const slippage = mainStore.selectedSlippage;
    const [borrowCap, setBorrowCap] = useState(0);
    const [borrowInKind, setBorrowInKind] = useState(0);
    const [CLF, setCLF] = useState(100);
    const [recommendedLTV, setRecommendedLTV] = useState(0)
    // code editor variables
    const [updatedCode, setUpdatedCode] = useState(smartLTVCode);
    // misc
    const debtAssetPrice = mainStore.debtAssetPrices[selectedQuote] ? mainStore.debtAssetPrices[selectedQuote.name] : undefined;

    // update vol and liq
    useEffect(()=> {
        if(averages && averages[selectedQuote]){
            setVolatility(averages[selectedQuote]['volatility']);
            setLiquidity(averages[selectedQuote]['average']);
        }
    }, [averages, selectedQuote])
    //updating price
    useEffect(() => {
        if (!mainStore.debtAssetPrices[selectedQuote] && selectedQuote) {
            mainStore.updateDebtAssetPrices(selectedQuote);
        }
    }, [selectedQuote]);
    useEffect(() => {
        setBorrowInKind(borrowCap / debtAssetPrice);
    }, [borrowCap, debtAssetPrice]);

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

    return (
        <div className="ltvSection">
            <LTVTextSection />
            <LTVCalculator 
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
            setRecommendedLTV={setRecommendedLTV}  />
            <LTVCodeSection updatedCode={updatedCode} />
        </div>
    )
})

export default LTVSection