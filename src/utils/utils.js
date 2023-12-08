export function formatNumberToUSStyle(number) {
    if (number) {
        const hasDecimals = number % 1 !== 0;
        return number.toLocaleString("en-US", {
            minimumFractionDigits: hasDecimals ? 2 : 0,
            maximumFractionDigits: hasDecimals ? 2 : 0,
        });
    }
}