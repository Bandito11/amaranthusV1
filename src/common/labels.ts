export const monthsLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const releaseDate = 2017;
let years = [releaseDate];
for (let i = 1; i <= 5; i++) {
    years = [...years, i + releaseDate];
}

export const yearLabels = [...years];
