import { Link, Typography } from "@mui/material";

import { useRef } from "react";

function LTVTextSection(){
    const containerRef = useRef();
    return<div className="ltvText" ref={containerRef} rel="noreferrer noopener">
        <Typography variant="h4">Smart LTV Formula</Typography>
        <Typography>Use the widget below to automatically calculate the recommended LTV according to RiskDAO's Smart LTV formula which is based on on-chain risk data feeds provided by B.Protocol's Risk Oracle. The widget will generate a code with the configured parameters.
            Read more about the Smart LTV formula <Link target="_blank" href="https://medium.com/risk-dao/a-smart-contract-formula-for-ltv-ratio-a60a8373d54d" color="#3366CC">here.</Link></Typography>
            <br/>
        <Typography fontWeight="bold">*Disclaimer: The Smart LTV formula is experimental and uses testnet data. It is for research purposes only and at this stage may lead to risk management flaws and to severe financial losses. Learn more about the risks involved <Link target="_blank" href="https://app.gitbook.com/o/-MdGrvWrIrA1v6TtCihZ/s/-MdGr7n_D-cGTaeor0FV/~/changes/50/technical-documentation/smart-ltv-formula" color="#3366CC">here.</Link></Typography>
</div>
}
export default LTVTextSection;