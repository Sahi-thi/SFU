import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'DateAgoPipe',
    pure: true,
})
export class DateAgoPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        var local_date = moment
            .utc(value)
            .local()
            .format('MM/DD/YYYY');
        let date = new Date();
        let todayDate = formatDate(date, 'MM/DD/yyyy', 'en-US')
        const yesterday = new Date(date);
        let yesterdayString = yesterday.setDate(yesterday.getDate() - 1);
        let yesterDaydate = moment.utc(yesterdayString).local().format('MM/DD/yyyy');

        if (local_date === todayDate) {
            const date = moment.utc(value).local().format('YYYY-MM-DD HH:mm:ss');
            let result = moment(date).fromNow();
            return result;
        }
        else if (local_date === yesterDaydate) {
            return 'Yesterday';
        }
        else {
            return local_date;
        }
    }
}
