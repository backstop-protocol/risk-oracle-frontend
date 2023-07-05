import LTVCalculator from "../components/LTVCalculator";
import LTVCodeSection from "../components/LTVCodeSection";
import LTVTextSection from "../components/LTVTextSection";
import { Paper } from "@mui/material";

function LTVSection() {
    return (
        <Paper sx={{ height: '92vh', width: '93vw' }}>
            <LTVTextSection />
            <LTVCalculator />
            <LTVCodeSection />
        </Paper>
    )

}

export default LTVSection;