import { Component, Input } from '@angular/core';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { GridFilterService } from 'src/app/shared/services/grid-filter.service';
import { MenuButtonItemComponent } from '../../buttons/menu-button/menu-button-item/menu-button-item.component';
import { FilterIconComponent } from '../../icons/filter.component';
import { DiskIconComponent } from '../../icons/disk-icon.component';
import { TrashcanIconComponent } from '../../icons/trashcan-icon.component';

@Component({
  selector: 'app-grid-filter-buttons',
  templateUrl: './grid-filter-buttons.component.html',
  styleUrl: './grid-filter-buttons.component.scss',
  imports: [MenuButtonItemComponent, FilterIconComponent, DiskIconComponent, TrashcanIconComponent],
})
export class GridFilterButtonsComponent {
  @Input() entityType!: RegistrationEntityTypes;

  constructor(private gridFilterService: GridFilterService) {}

  public onSaveFilter() {
    this.gridFilterService.dispatchSaveFilterAction(this.entityType);
  }

  public onApplyFilter() {
    this.gridFilterService.dispatchApplyFilterAction(this.entityType);
  }

  public onDeleteFilter() {
    this.gridFilterService.deleteFilterFromLocalStorage(this.entityType);
  }

  public filterExists(): boolean {
    return this.gridFilterService.columnsExistInLocalStorage(this.entityType);
  }
}
