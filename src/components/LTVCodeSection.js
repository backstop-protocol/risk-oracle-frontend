import { DiffEditor } from "@monaco-editor/react";
import mainStore from "../stores/main.store";

function LTVCodeSection(){
    return <div className="ltvCodeEditor">
        <DiffEditor original={mainStore.originalCode} modified={mainStore.updatedCode} language="sol" width="100%"  />
    </div>
}

export default LTVCodeSection;