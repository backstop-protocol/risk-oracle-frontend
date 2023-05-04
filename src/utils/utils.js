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
    return number
}

/**
 * Normalize a integer value to a number
 * @param {string | BigNumber} amount 
 * @param {BigInt} decimals 
 * @returns {number} normalized number for the decimals in inputs
 */
export function normalize(amount, decimals) {
    if (decimals === 18) {
        return Number(ethers.formatEther(amount));
    }
    else if (decimals > 18) {
        const factor = 10n ** (decimals - 18n);
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
    susd: 'nusd'
}
export function isDexAvailableForBase(dexName, selectedBaseName) {
    const availableBases = mainStore.graphData[dexName]['1'].map(_ => _.base);
    return availableBases.includes(selectedBaseName);
}