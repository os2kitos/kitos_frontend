import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { MultiSelectDropdownItem } from 'src/app/shared/models/dropdown-option.model';
import { MultiSelectDropdownComponent } from '../multi-select-dropdown/multi-select-dropdown.component';
import { ConnectedDropdownBaseComponent } from '../connected-dropdown-base/connected-dropdown-base.component';

@Component({
  selector: 'app-connected-multi-select-dropdown',
  imports: [MultiSelectDropdownComponent, AsyncPipe, FormsModule],
  templateUrl: './connected-multi-select-dropdown.component.html',
  styleUrl: './connected-multi-select-dropdown.component.scss',
})
export class ConnectedMultiSelectDropdownComponent<T> extends ConnectedDropdownBaseComponent {
  @Input() public data$?: Observable<MultiSelectDropdownItem<T>[]>;
  @Input() public resetSubject$?: Subject<void>;
  @Output() public valueChange = new EventEmitter<T[]>();

  public onValueChange(value?: T[]) {
    this.valueChange.emit(value);
  }
}
