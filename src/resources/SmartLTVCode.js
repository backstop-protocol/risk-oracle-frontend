
function updateCode(debtAsset){
return `// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "./Pythia.sol";
import "./KeyEncoder.sol";
import "./RiskyMath.sol";

contract SmartLTV is RiskyMath, KeyEncoder {
    Pythia immutable PYTHIA = Pythia(0x5FbDB2315678afecb367f032d93F642f64180aa3);
    address immutable TRUSTED_RELAYER = address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8);

    // fixed parameters, set according to risk preference
    uint constant CLF = 7e15;
    uint constant TIME_PERIOD = 1 days * 365;
    KeyEncoder.VolatilityMode VOLATILITY_MODE = KeyEncoder.VolatilityMode.Standard;
    KeyEncoder.LiquiditySource LIQUIDITY_SOURCE = KeyEncoder.LiquiditySource.All;

    // TODO - read from actual lending market
    address constant COLLATERAL_ASSET = address(0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5);
    address constant DEBT_ASSET = ${debtAsset.address};
    uint constant DEBT_CELING = 700_000 * 1e18;
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
        uint d = DEBT_CELING;

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
    uint constant TIME_PERIOD = 1 days * 365;
    KeyEncoder.VolatilityMode VOLATILITY_MODE = KeyEncoder.VolatilityMode.Standard;
    KeyEncoder.LiquiditySource LIQUIDITY_SOURCE = KeyEncoder.LiquiditySource.All;

    // TODO - read from actual lending market
    address constant COLLATERAL_ASSET = address(0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5);
    address constant DEBT_ASSET = address(0xe688b84b23f322a994A53dbF8E15FA82CDB71127);
    uint constant DEBT_CELING = 700_000 * 1e18;
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
        uint d = DEBT_CELING;

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