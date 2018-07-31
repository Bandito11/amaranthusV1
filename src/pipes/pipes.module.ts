import { PhoneNumberPipe } from './phonenumber';
import { NgModule} from '@angular/core';

@NgModule({
	declarations: [PhoneNumberPipe],
	exports: [PhoneNumberPipe]
})
export class PipesModule {}
