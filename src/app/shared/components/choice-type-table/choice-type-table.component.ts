import { Component, Input, OnInit } from '@angular/core';
import { RegularOptionType } from '../../models/options/regular-option-types.model';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { ChoiceTypeTableComponentStore } from './choice-type-table.component-store';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditChoiceTypeDialogComponent } from './edit-choice-type-dialog/edit-choice-type-dialog.component';

@Component({
  selector: 'app-choice-type-table',
  templateUrl: './choice-type-table.component.html',
  styleUrl: './choice-type-table.component.scss',
  providers: [ChoiceTypeTableComponentStore],
})
export class ChoiceTypeTableComponent implements OnInit {
  @Input() type!: RegularOptionType | RoleOptionTypes;
  @Input() expandedByDefault: boolean = false;
  @Input() title: string = '';
  @Input() disableAccordion: boolean = false;

  @Input() showWriteAccess: boolean = true;
  @Input() showDescription: boolean = true;
  @Input() showEditButton: boolean = true;

  constructor(private componentStore: ChoiceTypeTableComponentStore, private dialog: MatDialog) {}

  public readonly choiceTypeItems$ = this.componentStore.choiceTypeItems$;

  public ngOnInit(): void {
    this.componentStore.getChoiceTypeItems(of(this.type));
  }

  public onEdit(role: ChoiceTypeTableItem): void {
    const dialogRef = this.dialog.open(EditChoiceTypeDialogComponent);
    dialogRef.componentInstance.choiceTypeItem = role;
  }
}

export interface ChoiceTypeTableItem {
  id: number;
  uuid: string;
  active: boolean;
  name: string;
  writeAccess: boolean;
  description: string;
  obligatory: boolean;
}
