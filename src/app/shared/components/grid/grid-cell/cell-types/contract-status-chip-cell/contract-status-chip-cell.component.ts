import { Component } from '@angular/core';
import { SearchPropertyPipe } from '../../../../../pipes/column-property.pipe';
import { ChipComponent } from '../../../../chip/chip.component';
import { BaseCellComponent } from '../../base-cell.component';

@Component({
  selector: 'app-contract-status-chip-cell',
  templateUrl: './contract-status-chip-cell.component.html',
  styleUrl: './contract-status-chip-cell.component.scss',
  imports: [ChipComponent, SearchPropertyPipe],
})
export class ContractStatusChipCellComponent extends BaseCellComponent {
  public getChipText(value: string | null | undefined): string {
    if (!value) {
      return $localize`Ingen kontrakt`;
    }
    switch (value) {
      case 'NoContract':
        return $localize`Ingen kontrakt`;
      case 'Active':
        return $localize`Aktiv`;
      case 'Inactive':
        return $localize`Ikke aktiv`;
      default:
        return $localize`Ingen kontrakt`;
    }
  }

  public getChipState(value: string | null | undefined): 'success' | 'error' | 'neutral' {
    if (!value) {
      return 'neutral';
    }
    switch (value) {
      case 'NoContract':
        return 'neutral'; // No contract is neutral (gray)
      case 'Active':
        return 'success'; // Active is success (green)
      case 'Inactive':
        return 'error'; // Inactive is error (red)
      default:
        return 'neutral';
    }
  }
}
