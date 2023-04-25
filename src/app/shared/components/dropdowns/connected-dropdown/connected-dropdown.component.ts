/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';

@Component({
  selector: 'app-connected-dropdown[text][valueField][loadFullData][formGroup][formName]',
  templateUrl: './connected-dropdown.component.html',
  styleUrls: ['./connected-dropdown.component.scss'],
})
export class ConnectedDropdownComponent<T> extends BaseComponent implements OnInit {
  @Input() public text!: string;
  @Input() public valueField!: string;
  @Input() public data$?: Observable<T[]>;
  @Input() public isLoading$?: Observable<boolean>;
  @Input() public showSearchHelpText$?: Observable<boolean>;
  @Input() public formGroup!: FormGroup<any>;
  @Input() public formName!: string;
  @Input() public includeItemDescription = false;
  @Output() public filterChange = new EventEmitter<string>();
  @Output() public valueChange = new EventEmitter<string>();
  @Output() public loadFullData = new EventEmitter();

  ngOnInit() {
    this.loadFullData.emit();
  }

  //since the dropdown is filtered externally, accept every item
  public externalSearch(_: string, __: any) {
    return true;
  }

  public onValueChange(selectedUuid?: string) {
    this.loadFullData.emit();
    this.valueChange.emit(selectedUuid);
  }

  public onFilterChange(searchTerm?: string) {
    this.filterChange.emit(searchTerm);
  }

  public onBlur() {
    this.loadFullData.emit();
  }
}
