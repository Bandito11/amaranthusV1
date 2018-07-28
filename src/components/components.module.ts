import { BrowserModule } from '@angular/platform-browser';
import { CalendarComponent } from './calendar/calendar';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { LoaderComponent } from './loader/loader';
@NgModule({
	declarations: [LoaderComponent, CalendarComponent],
	imports: [BrowserModule],
	exports: [LoaderComponent, CalendarComponent],
	schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule {}
