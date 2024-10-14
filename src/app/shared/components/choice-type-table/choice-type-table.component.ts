import { Component, Input, OnInit } from '@angular/core';
import { RegularOptionType } from '../../models/options/regular-option-types.model';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { ChoiceTypeTableComponentStore } from './choice-type-table.component-store';
import { MatDialog } from '@angular/material/dialog';
import { EditChoiceTypeDialogComponent } from './edit-choice-type-dialog/edit-choice-type-dialog.component';
import { BaseComponent } from '../../base/base.component';
import { Actions } from '@ngrx/effects';
import { ChoiceTypeService } from '../../services/choice-type.service';

@Component({
  selector: 'app-choice-type-table',
  templateUrl: './choice-type-table.component.html',
  styleUrl: './choice-type-table.component.scss',
  providers: [ChoiceTypeTableComponentStore],
})
export class ChoiceTypeTableComponent extends BaseComponent implements OnInit {
  @Input() type!: ChoiceTypeTableOption;
  @Input() expandedByDefault: boolean = false;
  @Input() title: string = '';
  @Input() disableAccordion: boolean = false;

  @Input() showWriteAccess: boolean = true;
  @Input() showDescription: boolean = true;
  @Input() showEditButton: boolean = true;

  constructor(
    private componentStore: ChoiceTypeTableComponentStore,
    private choiceTypeService: ChoiceTypeService,
    private dialog: MatDialog,
    private actions$: Actions
  ) {
    super();
  }

  public readonly choiceTypeItems$ = this.componentStore.choiceTypeItems$;

  public ngOnInit(): void {
    this.componentStore.setState({ loading: false, choiceTypeItems: [], type: this.type });
    this.componentStore.getChoiceTypeItems();
  }

  public onEdit(choiceType: ChoiceTypeTableItem): void {
    const dialogRef = this.dialog.open(EditChoiceTypeDialogComponent);
    dialogRef.componentInstance.choiceTypeItem = choiceType;
    dialogRef.componentInstance.type = this.type;
  }
}

export interface ChoiceTypeTableItem {
  id: number;
  uuid: string;
  active: boolean; //TODO: Maybe should be allowed to be undefined
  name: string;
  writeAccess: boolean;
  description: string | undefined;
  obligatory: boolean; //TODO: Same as active
}

export type ChoiceTypeTableOption = RegularOptionType | RoleOptionTypes;
