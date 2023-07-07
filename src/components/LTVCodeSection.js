import { DiffEditor } from "@monaco-editor/react";
import { smartLTVCode } from "../resources/SmartLTVCode";
import { useMediaQuery } from "@mui/material";

function LTVCodeSection(props){
    const darkMode = useMediaQuery('(prefers-color-scheme: dark)');
    return <div className="ltvCodeEditor">
        <DiffEditor theme={darkMode ? "vs-dark" : "light"} original={smartLTVCode} modified={props.updatedCode}  language="sol" width="100%"  />
    </div>
}

export default LTVCodeSection;