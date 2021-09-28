
import { FormControl, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { OnInit } from '@angular/core';

export class CustomValidators {

    // static MatchPassword(Abstract: AbstractControl) {

    //    const password = Abstract.get('password').value; // to get value in input tag
    //    const confirmPassword = Abstract.get('confirmPassword').value; // to get value in input tag

    //    if(confirmPassword !== "" && password !== confirmPassword) {
    //     Abstract.get('confirmPassword').setErrors( {MatchPassword: true} )
    //     } else {
    //         return null
    //     }
    // }

    public static email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    public static validateZipCode = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    public static noWhitespaceValidator(control: FormControl) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    }

    public static minDigitsLength(control: FormControl) {
        const isLengthValid = (control.value || '').trim().length <= 9;
        const isValid = !isLengthValid;
        return isValid ? null : { 'is_length_valid': true };
    }

    public static autocompleteObjectValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (typeof control.value === undefined) {
                return { 'invalidAutocompleteObject': { value: control.value } }
            }
            return null
        }
    }

    public static compareMinAndMaxPrice: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        console.log({ control });

        const minPrice = control.get('min_price');
        const maxPrice = control.get('max_price');
        console.log(minPrice);
        console.log(maxPrice);

        return minPrice > maxPrice ? { isMaxPrice: true } : null;
    };

}
