import ContractAddress from "./ContractAddress";
import InfoLine from "./InfoLine";
import LastUpdate from "./LastUpdate";
import { Skeleton } from "@mui/material";
import { largeNumberFormatter } from "../utils/utils";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { pythiaAddress } from "../config";

const Web3Data = observer(props => {
    const web3Data = mainStore.web3Data;
    const span = mainStore.selectedSpan;
    if (!web3Data) {
        return <Skeleton variant="rectangular" height={'5vh'} width={'12vw'} />
    }
    {
        const selectedBase = mainStore.selectedAsset.name;
        if (web3Data[selectedBase]) {
            return (
                <article className="web3data" style={{ display: 'flex', justifyContent: 'space-between', alignItems: "start", margin:"0 !important" }}>
                    <div >
                        <InfoLine />
                        <ContractAddress address={pythiaAddress} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', alignItems: "end", alignContent: 'end', flexWrap: 'wrap' }}>
                        <div style={{ minHeight: '50%' }}>
                            Avg 30 days uniV3 liquidity vs USDC
                            <br />
                            {selectedBase}: {largeNumberFormatter(web3Data[selectedBase]['value'])} (${largeNumberFormatter(web3Data[selectedBase]['value'] * mainStore.basePrice)})
                        </div>
                    </div>
                    <div>
                        <LastUpdate date={mainStore.lastUpdate[span]} />
                    </div>
                </article>

            )
        }
    }
})

export default Web3Data