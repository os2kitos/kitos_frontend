import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RegularOptionType } from 'src/app/shared/models/options/regular-option-types.model';
import { OptionTypeDropdownComponentStore } from './option-type-dropdown-component-store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { getOptionTypeName } from 'src/app/shared/helpers/option-type.helper';
import { Store } from '@ngrx/store';
import { RoleOptionTypes } from 'src/app/shared/models/options/role-option-types.model';

@Component({
  selector: 'app-option-type-dropdown',
  templateUrl: './option-type-dropdown.component.html',
  styleUrl: './option-type-dropdown.component.scss',
  providers: [OptionTypeDropdownComponentStore],
})
export class OptionTypeDropdownComponent extends BaseComponent implements OnInit {
  @Input() optionType!: RegularOptionType | RoleOptionTypes;
  @Input() showDescription: boolean = false;
  @Input() formGroup?: FormGroup;
  @Input() formName?: string;
  @Input() value?: APIRegularOptionResponseDTO;

  @Output() valueChange = new EventEmitter<string | null | undefined>();

  public readonly optionTypes$ = this.componentStore.optionTypes$;
  public readonly loading$ = this.componentStore.loading$;

  constructor(private componentStore: OptionTypeDropdownComponentStore, private store: Store) {
    super();
  }

  public ngOnInit(): void {
    this.componentStore.getOptionTypes(this.optionType);
  }

  public getDropdownTitle(): string {
    return getOptionTypeName(this.optionType);
  }

  public onValueChange(item: APIRegularOptionResponseDTO | null | undefined): void {
    //The item provided by the dropdown is not actually an option, but a string, so we need to cast. (19/11/2024)
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uuid = item as any as string;
    this.valueChange.emit(uuid);
  }
}
