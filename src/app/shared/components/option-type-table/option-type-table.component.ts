import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { OptionTypeActions } from 'src/app/store/option-types/actions';
import { BaseComponent } from '../../base/base.component';
import { RegularOptionType } from '../../models/options/regular-option-types.model';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { OptionTypeTableComponentStore } from './option-type-table.component-store';
import { EditOptionTypeDialogComponent } from './edit-option-type-dialog/edit-option-type-dialog.component';

@Component({
  selector: 'app-option-type-table',
  templateUrl: './option-type-table.component.html',
  styleUrl: './option-type-table.component.scss',
  providers: [OptionTypeTableComponentStore],
})
export class OptionTypeTableComponent extends BaseComponent implements OnInit {
  @Input() type!: OptionTypeTableOption;
  @Input() expandedByDefault: boolean = false;
  @Input() title: string = '';
  @Input() disableAccordion: boolean = false;

  @Input() showWriteAccess: boolean = true;
  @Input() showDescription: boolean = true;
  @Input() showEditButton: boolean = true;

  constructor(
    private componentStore: OptionTypeTableComponentStore,
    private dialog: MatDialog,
    private actions$: Actions
  ) {
    super();
  }

  public readonly optionTypeItems$ = this.componentStore.optionTypeItems$;
  public readonly isLoading$ = this.componentStore.isLoading$;

  public ngOnInit(): void {
    this.componentStore.setState({ isLoading: false, optionTypeItems: [], type: this.type });
    this.componentStore.getOptionTypeItems();

    this.subscriptions.add(
      this.actions$.pipe(ofType(OptionTypeActions.updateOptionTypeSuccess)).subscribe(() => {
        this.componentStore.getOptionTypeItems();
      })
    );
  }

  public onEdit(optionType: OptionTypeTableItem): void {
    const dialogRef = this.dialog.open(EditOptionTypeDialogComponent);
    dialogRef.componentInstance.optionTypeItem = optionType;
    dialogRef.componentInstance.optionType = this.type;
  }
}

export interface OptionTypeTableItem {
  uuid: string;
  active: boolean;
  name: string;
  writeAccess: boolean | undefined;
  description: string | undefined;
  obligatory: boolean;
}

export type OptionTypeTableOption = RegularOptionType | RoleOptionTypes;
