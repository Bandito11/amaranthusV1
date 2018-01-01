import { Component, OnChanges } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Calendar } from '../../common/interface';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { monthsLabels, weekDaysHeader } from '../../common/labels';

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage implements OnChanges {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  date: Calendar;
  currentDate: string;

  getDate(date: Calendar) {
    this.date = date;
    const currentDay = date.day;
    const currentMonth = monthsLabels[date.month];
    const currentYear = date.year;
    const currentWeekDay = weekDaysHeader[date.weekDay];
    this.currentDate = `${currentWeekDay}, ${currentDay} ${currentMonth}, ${currentYear}`;
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      if (propName == 'date') {
        this.date = changes[propName].currentValue;
      }
    }
  }
}
