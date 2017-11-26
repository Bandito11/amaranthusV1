import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'phonenumber'
})

export class PhoneNumberPipe implements PipeTransform {
    transform(opts: number): string {
        let  phoneNumber = opts.toString().split('');
        let counter = -1;
        const value = phoneNumber.map(response => {
            counter++;
            if(counter == 3){
                return `-${response}`;
            }
            if(counter == 6){
                return `-${response}`;
            }
            return response
        });
        return value.join('');
    }
}