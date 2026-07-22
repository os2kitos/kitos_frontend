/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, } from 'rxjs';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { AsyncPipe } from '@angular/common';
import { ConnectedDropdownBaseComponent } from '../connected-dropdown-base/connected-dropdown-base.component';

@Component({
  selector: 'app-connected-dropdown[text][valueField][filterChange][formGroup][formName]',
  templateUrl: './connected-dropdown.component.html',
  styleUrls: ['./connected-dropdown.component.scss'],
  imports: [DropdownComponent, FormsModule, ReactiveFormsModule, AsyncPipe],
})
export class ConnectedDropdownComponent<T> extends ConnectedDropdownBaseComponent implements OnInit {
  @Input() public data$?: Observable<T[]>;
  @Output() public valueChange = new EventEmitter<string>();

  public onValueChange(selectedUuid?: string) {
    this.valueChange.emit(selectedUuid);
  }
}
