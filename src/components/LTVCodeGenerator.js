import { assets } from "../stores/config.store";
import { relayerAddress } from "../config";
import { pythiaAddress } from "../config";

function updateCode(debtAsset='USDC', baseAsset="ETH", span=30, CLF=7, borrowCap=1000000, slippage=5){
    const base = baseAsset;
    let debt = undefined;
    debtAsset === "WETH" ? debt = "ETH" : debt = debtAsset;
return `// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "./Pythia.sol";
import "./KeyEncoder.sol";
import "./RiskyMath.sol";

contract SmartLTV is RiskyMath, KeyEncoder {
    Pythia immutable PYTHIA = Pythia(${pythiaAddress});
    address immutable TRUSTED_RELAYER = address(${relayerAddress});

    // fixed parameters, set according to risk preference
    uint constant CLF = ${CLF}e15;
    uint constant TIME_PERIOD = ${span};
    KeyEncoder.VolatilityMode VOLATILITY_MODE = KeyEncoder.VolatilityMode.Standard;
    KeyEncoder.LiquiditySource LIQUIDITY_SOURCE = KeyEncoder.LiquiditySource.All;

    // TODO - read from actual lending market
    address constant COLLATERAL_ASSET = address(${assets[base].address});
    address constant DEBT_ASSET = address(${assets[debt].address});
    uint constant DEBT_CEILING = ${(borrowCap).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "_")};
    uint constant LIQUIDATION_INCENTIVE = ${slippage}e16;

    function getVolatility(address collateralAsset, address debtAsset) public view returns(uint value) {
        bytes32 key = encodeVolatilityKey(collateralAsset, debtAsset, VOLATILITY_MODE, TIME_PERIOD);

        Pythia.Data memory data = PYTHIA.get(TRUSTED_RELAYER, collateralAsset, key);
        require(data.lastUpdate >= block.timestamp - 1 days, "stale data");

        value = data.value;
    }

    function getLiquidity(address collateralAsset, address debtAsset, uint liquiditationIncentive) public view returns(uint value) {
        bytes32 key = encodeLiquidityKey(collateralAsset, debtAsset, LIQUIDITY_SOURCE, liquiditationIncentive, TIME_PERIOD);

        Pythia.Data memory data = PYTHIA.get(TRUSTED_RELAYER, collateralAsset, key);
        require(data.lastUpdate >= block.timestamp - 1 days, "stale data");

        value = data.value;        
    }

    function ltv(address collateralAsset, address debtAsset) public view returns(uint) {
        uint sigma = getVolatility(collateralAsset, debtAsset);
        uint beta = LIQUIDATION_INCENTIVE;
        uint l = getLiquidity(collateralAsset, debtAsset, beta);
        uint d = DEBT_CEILING;

        // LTV  = e ^ (-c * sigma / sqrt(l/d)) - beta
        uint cTimesSigma = CLF * sigma / 1e18;
        uint sqrtValue = sqrt(1e18 * l / d) * 1e9;
        uint mantissa = (1 << 59) * cTimesSigma / sqrtValue;

        uint expResult = generalExp(mantissa, 59);

        return (1e18 * (1 << 59)) / expResult - beta;
    }

    function recommendedLTV() public view returns(uint) {
        return ltv(COLLATERAL_ASSET, DEBT_ASSET);
    }
}
`;
}

export {updateCode}