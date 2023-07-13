import { Box, useMediaQuery } from "@mui/material";

import { DiffEditor } from "@monaco-editor/react";

function LTVCodeSection(props){
    const darkMode = useMediaQuery('(prefers-color-scheme: dark)');
    return <Box sx={{flex:1, flexGrow:3, width:"90%", marginBottom:"2vh"}}>
        <DiffEditor  options={{ renderSideBySide: false }} theme={!darkMode ? "vs-dark" : "light"} original={props.defaultCode} modified={props.updatedCode}  language="sol" width="100%"  />
    </Box>
}

export default LTVCodeSection;