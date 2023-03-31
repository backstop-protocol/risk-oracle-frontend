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

export function largeNumberFormatter(number){
    if(number >= 1e9){
        return `${(Number((number/(1e9)).toFixed(2)))}B`;
    } 
    if(number >= 1e6){
        return `${(Number((number/(1e6)).toFixed(2)))}M`
    } 
    if(number >= 1e3){
        return `${(Number((number/(1e3)).toFixed(2)))}K`
    }
    return number
}