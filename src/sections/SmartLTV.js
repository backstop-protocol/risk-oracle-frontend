import LTVCalculator from "../components/LTVCalculator";
import LTVCodeSection from "../components/LTVCodeSection";
import LTVTextSection from "../components/LTVTextSection";

function LTVSection() {
    return (
        <div className="ltvSection">
            <LTVTextSection />
            <LTVCalculator />
            <LTVCodeSection />
        </div>
    )

}

export default LTVSection;