import LTVCalculator from "../components/LTVCalculator";
import LTVCodeSection from "../components/LTVCodeSection";
import LTVTextSection from "../components/LTVTextSection";
import { Stack } from "@mui/material";

function LTVSection() {
    return (
        <Stack spacing={3} sx={{ height: '92vh', width: '93vw' }}>
            <LTVTextSection />
            <LTVCalculator />
            <LTVCodeSection />
        </Stack>
    )

}

export default LTVSection;