import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { GridActionColumn } from 'src/app/shared/models/grid-action-column.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { BooleanChange } from 'src/app/shared/models/grid/grid-events.model';
import {
  LocalAdminOptionType,
  LocalAdminOptionTypeItem,
} from 'src/app/shared/models/options/local-admin-option-type.model';
import { LocalOptionTypeActions } from 'src/app/store/local-admin/local-option-types/actions';
import { EditLocalOptionTypeDialogComponent } from '../edit-local-option-type-dialog/edit-local-option-type-dialog.component';

@Component({
  selector: 'app-local-option-grid',
  templateUrl: './local-option-grid.component.html',
  styleUrl: './local-option-grid.component.scss',
})
export class LocalOptionGridComponent implements OnInit {
  @Input() public loading: boolean = false;
  @Input() public optionType!: LocalAdminOptionType;
  @Input() public optionTypes: LocalAdminOptionTypeItem[] = [];

  @Input() showWriteAccess: boolean = false;
  @Input() showDescription: boolean = true;
  @Input() showEditButton: boolean = true;
  private readonly gridColumns: GridColumn[] = [
    {
      field: 'active',
      title: $localize`Aktiv`,
      hidden: false,
      style: 'checkbox',
      noFilter: true,
      permissionsField: 'obligatory',
    },
    {
      field: 'name',
      title: $localize`Navn`,
      hidden: false,
    },
    {
      field: 'writeAccess',
      title: $localize`Skriv`,
      hidden: false,
      style: 'boolean',
      noFilter: true,
    },
    {
      field: 'description',
      title: $localize`Beskrivelse`,
      hidden: false,
    },
    {
      field: 'Actions',
      title: ' ',
      hidden: false,
      style: 'action-buttons',
      isSticky: true,
      noFilter: true,
      extraData: [{ type: 'edit' }] as GridActionColumn[],
      width: 50,
    },
  ];

  public filteredGridColumns!: GridColumn[];

  constructor(private dialog: MatDialog, private store: Store) {}

  public ngOnInit(): void {
    this.filteredGridColumns = this.gridColumns.map((column) => {
      switch (column.field) {
        case 'writeAccess':
          return { ...column, hidden: !this.showWriteAccess };
        case 'description':
          return { ...column, hidden: !this.showDescription };
        case 'Actions':
          return { ...column, hidden: !this.showEditButton };
        default:
          return column;
      }
    });
  }

  public onModify(optionType: LocalAdminOptionTypeItem): void {
    const dialogRef = this.dialog.open(EditLocalOptionTypeDialogComponent);
    dialogRef.componentInstance.optionTypeItem = optionType;
    dialogRef.componentInstance.optionType = this.optionType;
  }

  public onCheckboxChange(event: BooleanChange<LocalAdminOptionTypeItem>): void {
    const activeStatus = event.value;
    const option = event.item;
    this.store.dispatch(
      LocalOptionTypeActions.updateOptionTypeActiveStatus(this.optionType, option.uuid, activeStatus)
    );
  }
}
