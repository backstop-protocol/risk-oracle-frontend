import { Box, useMediaQuery } from "@mui/material";

import { DiffEditor } from "@monaco-editor/react";

function LTVCodeSection(props){
    const darkMode = useMediaQuery('(prefers-color-scheme: dark)');
    return <Box className="ltvCodeEditor" sx={{width:"90%", height:"50vh", flex:"1 0 auto"}}>
        <DiffEditor  options={{ renderSideBySide: false }} theme={!darkMode ? "vs-dark" : "light"} original={props.defaultCode} modified={props.updatedCode}  language="sol" width="100%"  />
    </Box>
}

export default LTVCodeSection;