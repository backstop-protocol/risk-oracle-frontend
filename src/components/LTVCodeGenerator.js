import { assets } from "../stores/config.store";
import { relayerAddress } from "../config";
import { pythiaAddress } from "../config";

function updateCode(debtAsset='USDC', baseAsset="ETH", span=30, CLF=7, borrowCap=0.7, slippage=5, debtTokenDecimals=18){
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
    uint constant DEBT_CEILING = ${(borrowCap*1e6).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "_")} * 1e${debtTokenDecimals};
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
const smartLTVCode = `// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "./Pythia.sol";
import "./KeyEncoder.sol";
import "./RiskyMath.sol";

contract SmartLTV is RiskyMath, KeyEncoder {
    Pythia immutable PYTHIA = Pythia(0x5FbDB2315678afecb367f032d93F642f64180aa3);
    address immutable TRUSTED_RELAYER = address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8);

    // fixed parameters, set according to risk preference
    uint constant CLF = 7e15;
    uint constant TIME_PERIOD = 7;
    KeyEncoder.VolatilityMode VOLATILITY_MODE = KeyEncoder.VolatilityMode.Standard;
    KeyEncoder.LiquiditySource LIQUIDITY_SOURCE = KeyEncoder.LiquiditySource.All;

    // TODO - read from actual lending market
    address constant COLLATERAL_ASSET = address(0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2);
    address constant DEBT_ASSET = address(0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48);
    uint constant DEBT_CEILING = 700_000 * 1e18;
    uint constant LIQUIDATION_INCENTIVE = 5e16;

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

export {smartLTVCode, updateCode}