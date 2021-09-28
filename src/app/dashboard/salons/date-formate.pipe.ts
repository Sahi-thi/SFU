import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'DateFormatePipe',
    pure: true,
})
export class DateFormatePipe implements PipeTransform {
    transform(value: any, args?: any): any {
        var local_date = moment
            .utc(value)
            .local()
            .format('MM/DD/yyyy, hh:mm A');
        return local_date;
    }
}
