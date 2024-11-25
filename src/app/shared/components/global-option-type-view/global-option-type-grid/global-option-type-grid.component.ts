import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GridActionColumn } from 'src/app/shared/models/grid-action-column.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import {
  GlobalAdminOptionType,
  GlobalAdminOptionTypeItem,
} from 'src/app/shared/models/options/global-admin-option-type.model';
import { DialogOpenerService } from 'src/app/shared/services/dialog-opener.service';
import { BooleanChange } from '../../local-grid/local-grid.component';
import { GlobalOptionTypeActions } from 'src/app/store/global-admin/global-option-types/actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-global-option-type-grid',
  templateUrl: './global-option-type-grid.component.html',
  styleUrl: './global-option-type-grid.component.scss',
})
export class GlobalOptionTypeGridComponent implements OnChanges {
  @Input() loading: boolean = false;
  @Input() optionType!: GlobalAdminOptionType;
  @Input() optionTypeItems!: GlobalAdminOptionTypeItem[];

  @Input() showWriteAccess!: boolean;
  @Input() showDescription!: boolean;

  private readonly gridColumns: GridColumn[] = [
    {
      field: 'enabled',
      title: $localize`Tilgængelig`,
      hidden: false,
      noFilter: true,
      width: 100,
      style: 'boolean',
    },
    {
      field: 'obligatory',
      title: $localize`Obligatorisk`,
      hidden: false,
      noFilter: true,
      width: 100,
      style: 'boolean',
    },
    {
      field: 'priority',
      title: $localize`Prioritet`,
      hidden: false,
      noFilter: true,
      width: 100,
      style: 'priority-buttons',
      sortable: false,
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
      noFilter: true,
      style: 'boolean',
    },
    {
      field: 'description',
      title: $localize`Beskrivelse`,
      hidden: false,
    },
    {
      field: 'enabled',
      title: ' ',
      hidden: false,
      style: 'action-buttons',
      isSticky: true,
      noFilter: true,
      extraData: [{ type: 'edit' }, { type: 'toggle' }] as GridActionColumn[],
      width: 100,
      minResizableWidth: 100,
    },
  ];

  public filteredGridColumns!: GridColumn[];

  constructor(private dialogOpenerService: DialogOpenerService, private store: Store) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['optionTypeItems'] && this.optionTypeItems) {
      this.updateFilteredGridColumns();
    }
  }

  private updateFilteredGridColumns(): void {
    this.filteredGridColumns = this.gridColumns.map((column) => {
      switch (column.field) {
        case 'writeAccess':
          return { ...column, hidden: !this.showWriteAccess };
        case 'description':
          return { ...column, hidden: !this.showDescription };
        case 'priority': {
          const priorities = this.optionTypeItems.map((item) => item.priority);
          const minPriority = Math.min(...priorities);
          const maxPriority = Math.max(...priorities);
          return { ...column, extraData: { optionType: this.optionType, minPriority, maxPriority } };
        }
        default:
          return column;
      }
    });
  }

  public onEdit(optionTypeItem: GlobalAdminOptionTypeItem): void {
    const componentInstance = this.dialogOpenerService.openGlobalOptionTypeDialog(this.optionType);
    componentInstance.action = 'edit';
    componentInstance.optionTypeItem = optionTypeItem;
  }

  public onToggleChange(toggleEvent: BooleanChange<GlobalAdminOptionTypeItem>): void {
    const { value, item } = toggleEvent;
    this.store.dispatch(GlobalOptionTypeActions.updateOptionType(this.optionType, item.uuid, { isEnabled: value }));
  }
}
