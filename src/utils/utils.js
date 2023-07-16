import { ethers } from "ethers";
import mainStore from "../stores/main.store";

/**
 * round a number to 'dec' decimals
 * @param {number} num to round
 * @param {number} dec how many decimals
 * @returns 
 */
export function roundTo(num, dec = 2) {
    const pow = Math.pow(10, dec);
    return Math.round((num + Number.EPSILON) * pow) / pow;
}

export function largeNumberFormatter(number) {
    if (number >= 1e9) {
        return `${(Number((number / (1e9)).toFixed(2)))}B`;
    }
    if (number >= 1e6) {
        return `${(Number((number / (1e6)).toFixed(2)))}M`
    }
    if (number >= 1e3) {
        return `${(Number((number / (1e3)).toFixed(2)))}K`
    }
    return `${(Number(number).toFixed(2))}`
}


export function encodeVolatilityKey(collateralAsset, debtAsset, mode, period) {
    return ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(['string', 'address', 'uint8', 'uint256'], ['volatility', debtAsset, mode, period]))
}

export function encodeLiquidityKey(collateralAsset, debtAsset, source, slippage, period) {
    return ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(['string', 'address', 'uint8', 'uint256', 'uint256'], ['liquidity', debtAsset, source, slippage, period]))
}

export function findCLFFromParameters(ltv, liquidationBonus, liquidity, borrowCap, volatility) {
    console.log(`findCLFFromParameters: liquidity: ${liquidity}, borrow cap ${borrowCap}, volatility: ${volatility}, liquidiation bonus ${liquidationBonus}, ltv: ${ltv}`)
    const sqrtResult = Math.sqrt(liquidity/borrowCap);
    const sqrtBySigma = sqrtResult / volatility;
    const ltvPlusBeta = Number(ltv) + Number(liquidationBonus);
    const lnLtvPlusBeta = Math.log(ltvPlusBeta);
    const c = -1 * lnLtvPlusBeta * sqrtBySigma;
    return c;
}

export function findLTVFromParameters(liquidity, borrowCap, volatility, liquidationBonus, CLF) {
    console.log(`findLTVFromParameters: liquidity: ${liquidity}, borrow cap ${borrowCap}, volatility: ${volatility}, liquidiation bonus ${liquidationBonus}, CLF: ${CLF}`)
    const sqrRoot = Math.sqrt(liquidity / borrowCap);
    const sigmaOverSqrRoot = volatility / sqrRoot;
    const clfMinusSigmaOverSqrRoot = (-1 * CLF) * sigmaOverSqrRoot;
    const exponential = Math.exp(clfMinusSigmaOverSqrRoot);
    const ltv = exponential - liquidationBonus;
    return ltv;
}

/**
 * Normalize a integer value to a number
 * @param {string | BigNumber} amount 
 * @param {BigInt} decimals 
 * @returns {number} normalized number for the decimals in inputs
 */
export function normalize(amount, decimals) {
    if (decimals === 18n) {
        return Number(ethers.formatEther(amount));
    }
    else if (decimals > 18n) {
        const factor = Math.pow(10n, (decimals - 18n));
        const norm = BigInt(amount.toString()) / factor;
        return Number(ethers.formatEther(norm));
    } else {
        const factor = 10n ** (18n - decimals);
        const norm = BigInt(amount.toString()) * factor;
        return Number(ethers.formatEther(norm));
    }
}

export const coingeckoMap = {
    mkr: 'maker',
    mana: 'decentraland',
    snx: 'havven',
    usdc: 'usd-coin',
    susd: 'nusd',
    wbtc: 'wrapped-bitcoin',
    uni: 'uniswap',
    dai: 'dai',
    eth: 'ethereum',
    weth: 'weth'
}
export function isDexAvailableForBase(dexName, selectedBaseName) {
    if(mainStore.graphData[dexName]){
    const availableBases = mainStore.graphData[dexName]['1'].map(_ => _.base);
    return availableBases.includes(selectedBaseName);}
    else{return false}
}