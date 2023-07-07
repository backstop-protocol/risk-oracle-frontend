import { Box } from "@mui/material";
import { DiffEditor } from "@monaco-editor/react";
import smartLTVCode from "../resources/SmartLTVCode";

function LTVCodeSection(){
    return <Box minHeight="50vh">
        <DiffEditor original={smartLTVCode} modified={smartLTVCode} language="sol" width="100%"  />
    </Box>
}

export default LTVCodeSection;