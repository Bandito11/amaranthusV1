import { CameraOptions } from "@ionic-native/camera";

export const MONTHSLABELS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const RELEASEDATE = 2017;
let YEARS = [RELEASEDATE];
for (let i = 1; i <= 5; i++) {
    YEARS = [...YEARS, i + RELEASEDATE];
}

export const YEARLABELS = [...YEARS];

export const WEEKDAYSLABELS = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ];
  
  export const WEEKDAYSHEADER = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  