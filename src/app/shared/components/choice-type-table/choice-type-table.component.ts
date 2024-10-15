import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { ChoiceTypeActions } from 'src/app/store/choice-types/actions';
import { BaseComponent } from '../../base/base.component';
import { RegularOptionType } from '../../models/options/regular-option-types.model';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { ChoiceTypeService } from '../../services/choice-type.service';
import { ChoiceTypeTableComponentStore } from './choice-type-table.component-store';
import { EditChoiceTypeDialogComponent } from './edit-choice-type-dialog/edit-choice-type-dialog.component';

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
  public readonly isLoading$ = this.componentStore.isLoading$;

  public ngOnInit(): void {
    this.componentStore.setState({ isLoading: false, choiceTypeItems: [], type: this.type });
    this.componentStore.getChoiceTypeItems();

    this.subscriptions.add(
      this.actions$.pipe(ofType(ChoiceTypeActions.updateChoiceTypeSuccess)).subscribe(() => {
        this.componentStore.getChoiceTypeItems();
      })
    );
  }

  public onEdit(choiceType: ChoiceTypeTableItem): void {
    const dialogRef = this.dialog.open(EditChoiceTypeDialogComponent);
    dialogRef.componentInstance.choiceTypeItem = choiceType;
    dialogRef.componentInstance.type = this.type;
  }
}

export interface ChoiceTypeTableItem {
  uuid: string;
  active: boolean; //TODO: Maybe should be allowed to be undefined
  name: string;
  writeAccess: boolean;
  description: string | undefined;
  obligatory: boolean; //TODO: Same as active
}

export type ChoiceTypeTableOption = RegularOptionType | RoleOptionTypes;
