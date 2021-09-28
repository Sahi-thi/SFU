import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'DateTimePipe',
  pure: true,
})
export class DateTimePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    var local_date = moment
      .utc(value)
      .local()
      .format('hh:mm A');
    return local_date;
  }
}
