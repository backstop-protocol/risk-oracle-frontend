import { DiffEditor } from "@monaco-editor/react";
import { smartLTVCode } from "../resources/SmartLTVCode";

function LTVCodeSection(props){
    return <div className="ltvCodeEditor">
        <DiffEditor original={smartLTVCode} modified={props.updatedCode} language="sol" width="100%"  />
    </div>
}

export default LTVCodeSection;