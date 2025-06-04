import { Component, Input, OnInit } from '@angular/core';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { EntitySelectionService } from 'src/app/shared/services/entity-selector-service';
import { BulkActionOption } from '../bulk-action-dialog.component';
import { AccordionComponent } from '../../../accordion/accordion.component';
import { NativeTableComponent } from '../../../native-table/native-table.component';
import { CheckboxComponent } from '../../../checkbox/checkbox.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-bulk-action-dialog-section',
  templateUrl: './bulk-action-dialog-section.component.html',
  styleUrl: './bulk-action-dialog-section.component.scss',
  imports: [AccordionComponent, NativeTableComponent, CheckboxComponent, NgFor],
})
export class BulkActionDialogSectionComponent implements OnInit {
  @Input() public options!: BulkActionOption[];
  @Input() public entityType!: RegistrationEntityTypes;
  @Input() public title!: string;
  @Input() public primaryColumnTitle!: string;
  @Input() public secondaryColumnTitle?: string;

  constructor(private selectionService: EntitySelectionService<BulkActionOption, RegistrationEntityTypes>) {}

  ngOnInit(): void {
    this.selectionService.initSelectedItems([this.entityType]);
  }

  public isOptionSelected(option: BulkActionOption): boolean {
    return this.selectionService.isItemSelected(this.entityType, option);
  }

  public optionSelectionChanged(option: BulkActionOption, value: boolean | undefined): void {
    if (value) {
      this.selectionService.selectItem(this.entityType, option);
    } else {
      this.selectionService.deselectItem(this.entityType, option);
    }
  }

  public allOptionsSelectedChanged(value: boolean | undefined): void {
    if (value) {
      this.selectionService.selectAllOfType(this.entityType, this.options);
    } else {
      this.selectionService.deselectAllOfType(this.entityType);
    }
  }

  public isAllSelected(): boolean {
    return this.selectionService.isAllOfTypeSelected(this.entityType, this.options);
  }
}
