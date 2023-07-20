import { Accordion, AccordionDetails, AccordionSummary, Box, Typography, useMediaQuery } from "@mui/material";

import { DiffEditor } from "@monaco-editor/react";
import { ExpandMore } from "@mui/icons-material";

function LTVCodeSectionMobile(props){
    const darkMode = useMediaQuery('(prefers-color-scheme: dark)');
    return <Accordion sx={{width:"95%"}}>  
    <AccordionSummary
    expandIcon={<ExpandMore />}
    aria-controls="panel1a-content"
    id="panel1a-header"
    sx={{width:"100%", height:"5vh"}}>
        <Typography variant="body2">Code Editor</Typography>
    </AccordionSummary>
    <AccordionDetails sx={{display:"flex", flexDirection:"column", alignItems:"left", justifyContent:"start"}}>
    <Box sx={{width:"100%", height:"50vh", flex:"1 0 auto"}}>
        <DiffEditor  options={{ renderSideBySide: false, lineNumbers: false, minimap:true }} theme={!darkMode ? "vs-dark" : "light"} original={props.defaultCode} modified={props.updatedCode}  language="sol" width="100%"  />
    </Box>
    </AccordionDetails>
</Accordion>
}

export default LTVCodeSectionMobile;