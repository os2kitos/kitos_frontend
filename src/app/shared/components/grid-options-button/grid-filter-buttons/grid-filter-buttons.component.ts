import { Component, Input } from '@angular/core';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { GridFilterService } from 'src/app/shared/services/grid-filter.service';

@Component({
  selector: 'app-grid-filter-buttons',
  templateUrl: './grid-filter-buttons.component.html',
  styleUrl: './grid-filter-buttons.component.scss',
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
