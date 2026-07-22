import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { OBLIGATORY_LOCAL_OPTION_HELP_TEXT } from 'src/app/shared/constants/constants';
import { createGridActionColumn } from 'src/app/shared/models/grid-action-column.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { BooleanChange } from 'src/app/shared/models/grid/grid-events.model';
import {
  LocalAdminOptionType,
  LocalAdminOptionTypeItem,
} from 'src/app/shared/models/options/local-admin-option-type.model';
import { LocalOptionTypeActions } from 'src/app/store/local-admin/local-option-types/actions';
import { LocalGridComponent } from '../../local-grid/local-grid.component';
import { EditLocalOptionTypeDialogComponent } from '../edit-local-option-type-dialog/edit-local-option-type-dialog.component';

@Component({
  selector: 'app-local-option-grid',
  templateUrl: './local-option-grid.component.html',
  styleUrl: './local-option-grid.component.scss',
  imports: [LocalGridComponent],
})
export class LocalOptionGridComponent implements OnInit {
  @Input() public loading: boolean = false;
  @Input() public optionType!: LocalAdminOptionType;
  @Input() public optionTypes: LocalAdminOptionTypeItem[] = [];
  @Input() scrollable: 'scrollable' | 'virtual' | 'none' = 'scrollable';
  @Input() fitSizeToContent = true;

  @Input() showWriteAccess: boolean = false;
  @Input() showExternalUse: boolean = false;
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
      tooltipFn: (item: LocalAdminOptionTypeItem) => {
        return item.obligatory ? OBLIGATORY_LOCAL_OPTION_HELP_TEXT : '';
      },
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
      width: 120,
    },
    {
      field: 'description',
      title: $localize`Beskrivelse`,
      hidden: false,
    },
    {
      field: 'isExternallyUsed',
      title: $localize`Bruges eksternt`,
      hidden: false,
      style: 'boolean',
      noFilter: true,
      width: 120,
    },
    {
      field: 'externallyUsedDescription',
      title: $localize`Beskrivelse af ekstern brug`,
      hidden: false,
    },
    createGridActionColumn(['edit']),
  ];

  public filteredGridColumns!: GridColumn[];

  constructor(
    private dialog: MatDialog,
    private store: Store,
  ) {}

  public ngOnInit(): void {
    this.filteredGridColumns = this.gridColumns.map((column) => {
      switch (column.field) {
        case 'writeAccess':
          return { ...column, hidden: !this.showWriteAccess };
        case 'description':
          return { ...column, hidden: !this.showDescription };
        case 'isExternallyUsed':
          return { ...column, hidden: !this.showExternalUse };
        case 'externallyUsedDescription':
          return { ...column, hidden: !this.showExternalUse };
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
      LocalOptionTypeActions.updateOptionTypeActiveStatus(this.optionType, option.uuid, activeStatus),
    );
  }
}
