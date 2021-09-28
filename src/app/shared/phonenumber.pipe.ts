import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumberFormatPipe'
})
export class PhoneNumberFormatPipe implements PipeTransform {

  transform(phoneValue: number | string, country: string): any {
    try {
      let phoneNumber =  ''+phoneValue;
      if (phoneNumber.length <= 3) {
        phoneNumber = phoneNumber.replace(/^(\d{0,3})/, '($1');
      } else if (phoneNumber.length <= 6) {
        phoneNumber = phoneNumber.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
      } else {
        phoneNumber = phoneNumber.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3');
      }
      return phoneNumber  
    } catch (error) {
      return phoneValue;
    }
  }

}
