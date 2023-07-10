import { DiffEditor } from "@monaco-editor/react";
import { useMediaQuery } from "@mui/material";

function LTVCodeSection(props){
    const darkMode = useMediaQuery('(prefers-color-scheme: dark)');
    return <div className="ltvCodeEditor">
        <DiffEditor  options={{ renderSideBySide: false }} theme={!darkMode ? "vs-dark" : "light"} original={props.defaultCode} modified={props.updatedCode}  language="sol" width="100%"  />
    </div>
}

export default LTVCodeSection;