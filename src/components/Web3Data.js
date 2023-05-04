import PythiaABI from "../abi/pythia.abi.json";
import { ethers } from "ethers";
import { observer } from "mobx-react";
import { pythiaAddress } from "../config";

const provider = new ethers.providers.JsonRpcProvider('https://rpc.sepolia.dev');
const pythiaContract = new ethers.Contract(pythiaAddress, PythiaABI, provider);

const Web3Data = observer(props => {

    return (
        <div >
            Hello!
        </div>
    )
})

export default Web3Data