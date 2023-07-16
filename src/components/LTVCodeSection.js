import { Box, Link, Typography, useMediaQuery } from "@mui/material";

import { DiffEditor } from "@monaco-editor/react";

function LTVCodeSection(props){
    const darkMode = useMediaQuery('(prefers-color-scheme: dark)');
    return <Box className="ltvCodeEditor" sx={{width:"90%", flex:"1 0 auto", paddingBottom:"4vh"}}>
        <DiffEditor  options={{ renderSideBySide: false }} theme={!darkMode ? "vs-dark" : "light"} original={props.defaultCode} modified={props.updatedCode}  language="sol" width="100%"  />
        <Typography fontWeight="bold">*Disclaimer: The Smart LTV formula is experimental and uses testnet data. It is for research purposes only and at this stage may lead to risk management flaws and to severe financial losses. </Typography>
        <Typography fontWeight="bold">Learn more about the risks involved <Link target="_blank" href="https://app.gitbook.com/o/-MdGrvWrIrA1v6TtCihZ/s/-MdGr7n_D-cGTaeor0FV/~/changes/50/technical-documentation/smart-ltv-formula" color="#3366CC">here.</Link></Typography>
    </Box>
}

export default LTVCodeSection;