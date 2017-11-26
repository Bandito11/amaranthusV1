export function validatePhoneNumber(phoneNumber) {
    if (phoneNumber.length > 10) {
        return false;
    } else {
        return true;
    }
}