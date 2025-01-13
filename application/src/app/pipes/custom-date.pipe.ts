import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  newDate = new Date();
  transform(value: Date): string {
    console.log(this.newDate);
    
    let dateFromNow = {
      year: this.newDate.getUTCFullYear(),
      month: this.newDate.getUTCMonth(),
      date: this.newDate.getUTCDate(),
      day: this.newDate.getUTCDay(),
      hours: this.newDate.getUTCHours(),
      minutes: this.newDate.getUTCMinutes(),
    };
    let dateToHandle = {
      year: value.getUTCFullYear(),
      month: value.getUTCMonth(),
      date: value.getUTCDate(),
      day: value.getUTCDay(),
      hours: value.getUTCHours(),
      minutes: value.getUTCMinutes(),
    };
    let now: any = new Date(
      Date.UTC(
        dateFromNow.year,
        dateFromNow.month,
        dateFromNow.date,
        dateFromNow.hours,
        dateFromNow.minutes
      )
    );
    let targetDate: any = new Date(
      Date.UTC(
        dateToHandle.year,
        dateToHandle.month,
        dateToHandle.date,
        dateToHandle.hours,
        dateToHandle.minutes
      )
    );

    const diffMilliseconds = now - targetDate;
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffMinutes < 60) {
      return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    } else if (diffWeeks < 4) {
      return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`;
    } else if (diffMonths < 12) {
      return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
    } else {
      return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
    }
  }
}
