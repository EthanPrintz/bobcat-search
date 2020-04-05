export function convertUnits(minUnit, maxUnit) {
    if(minUnit === 0) {
        return maxUnit;
    }
    return `${minUnit} - ${maxUnit}`;
}