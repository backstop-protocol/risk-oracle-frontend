import { Card, CardContent, Typography } from "@mui/material";

function LTVTextSection(){
    return<Card variant="outlined" elevation={5}>
    <CardContent>
        <Typography variant="h4">Smart LTV Formula</Typography>
        <Typography>Use the widget below to automatically calculate the recommended LTV according to RiskDAO's Smart LTV formula which is based on on-chain risk data feeds provided by B.Protocol's Risk Oracle. The widget will generate a code with the configured parameters.
            Read more about the Smart LTV formula here.</Typography>
        <Typography>*Disclaimer: The Smart LTV formula is experimental and uses testnet data. It is for research purposes only and at this stage may lead to risk management flaws and to severe financial losses. Learn more about the risks involved here.</Typography>
    </CardContent>
</Card>
}

export default LTVTextSection;