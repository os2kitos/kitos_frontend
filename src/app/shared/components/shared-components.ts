import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './buttons/button/button.component';
import { DatePickerComponent } from './datepicker/datepicker.component';
import { DropdownComponent } from './dropdowns/dropdown/dropdown.component';
import { MultiSelectDropdownComponent } from './dropdowns/multi-select-dropdown/multi-select-dropdown.component';
import { UserDropdownComponent } from './dropdowns/user-dropdown/user-dropdown.component';
import { ParagraphComponent } from './paragraph/paragraph.component';
import { TextBoxInfoComponent } from './textbox-info/textbox-info.component';
import { TextBoxComponent } from './textbox/textbox.component';

export const sharedFormComponents = [
  ButtonComponent,
  FormsModule,
  ReactiveFormsModule,
  UserDropdownComponent,
  DropdownComponent,
  TextBoxComponent,
  DatePickerComponent,
  ParagraphComponent,
  MultiSelectDropdownComponent,
  TextBoxInfoComponent,
];
