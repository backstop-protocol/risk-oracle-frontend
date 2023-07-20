import { Box, Typography, Link, Divider } from "@mui/material";

export default function LTVDisclaimer(){
    return(
        <Box sx={{width:"90%", flex:"0 2 auto"}}>
        <small fontWeight="bold">*Disclaimer: The Smart LTV formula is experimental and uses testnet data. It is for research purposes only and at this stage may lead to risk management flaws and to severe financial losses. </small>
        <small fontSize="0.875em" fontWeight="bold">Learn more about the risks involved <Link target="_blank" href="https://app.gitbook.com/o/-MdGrvWrIrA1v6TtCihZ/s/-MdGr7n_D-cGTaeor0FV/~/changes/50/technical-documentation/smart-ltv-formula" color="#3366CC">here.</Link></small>
  <Divider sx={{width:"100%", margin:"5% 0 5% 0"}} />
        </Box>)
}

