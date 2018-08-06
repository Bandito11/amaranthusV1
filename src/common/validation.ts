export function validatePhoneNumber(phoneNumber) {
    if (phoneNumber.length > 10) {
        return false;
    } else {
        return true;
    }
}

export function addZeroInFront(value: number) {
    if (value < 10) {
        return `0${value}`;
    }
    return value;
}