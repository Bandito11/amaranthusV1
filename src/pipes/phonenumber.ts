import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phoneNumber' })

export class PhoneNumberPipe implements PipeTransform {
    transform(opts: number): string {
        let phoneNumber = opts.toString().split('');
        let counter = 0;
        const value = phoneNumber.map(response => {
            counter++;
            if (counter == 2) {
                return `-${response}`;
            }
            if (counter == 5) {
                return `-${response}`;
            }
            return response;
        });
        return value.join('');
    }
}