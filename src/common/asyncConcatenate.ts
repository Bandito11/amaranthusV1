export function asyncConcatenate<T>(data: T[], length: number): Promise<any> {
    return new Promise((resolve, reject) => {
        let i = 0;
        let value;
        try {
            data.length;
        } catch (error) {
            reject(error);
        }
        const interval = setInterval(() => {
            if (i == 0) {
                value = data[i];
            } else {
                value += data[i];
            }
            i++;
            if (i == length) {
                clearInterval(interval);
                resolve(value);
            }
        }, 500)
    });
}
