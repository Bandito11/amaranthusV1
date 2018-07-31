import { BrowserModule } from '@angular/platform-browser';
import { CalendarComponent } from './calendar/calendar';
import { NgModule} from '@angular/core';
import { LoaderComponent } from './loader/loader';
@NgModule({
	declarations: [LoaderComponent, CalendarComponent],
	imports: [BrowserModule],
	exports: [LoaderComponent, CalendarComponent]
})
export class ComponentsModule {}
