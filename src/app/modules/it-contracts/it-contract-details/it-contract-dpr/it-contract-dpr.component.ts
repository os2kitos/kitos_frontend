import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { selectItContractDataProcessingRegistrations } from 'src/app/store/it-contract/selectors';

@Component({
  selector: 'app-it-contract-dpr',
  templateUrl: './it-contract-dpr.component.html',
  styleUrl: './it-contract-dpr.component.scss',
})
export class ItContractDprComponent extends BaseComponent {
  public readonly dataProcessingRegistrations$ = this.store
    .select(selectItContractDataProcessingRegistrations)
    .pipe(filterNullish());
  public readonly anyDataProcessingRegistrations$ = this.dataProcessingRegistrations$.pipe(matchNonEmptyArray());

  constructor(private readonly store: Store) {
    super();
  }

  public onDelete(uuid: string): void {}

  public onAdd(): void {}
}
