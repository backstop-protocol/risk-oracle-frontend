/**
 * round a number to 'dec' decimals
 * @param {number} num to round
 * @param {number} dec how many decimals
 * @returns 
 */
export default function roundTo(num, dec = 2) {
    const pow = Math.pow(10, dec);
    return Math.round((num + Number.EPSILON) * pow) / pow;
}