import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { APIPaymentResponseDTO } from 'src/app/api/v2';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { selectItContractHasModifyPermissions } from 'src/app/store/it-contract/selectors';

@Component({
  selector: 'app-payment-table',
  templateUrl: './payment-table.component.html',
  styleUrl: './payment-table.component.scss',
})
export class PaymentTableComponent {
  @Input() public title!: string;
  @Input() public helpTextKey!: string;
  @Input() public payments$!: Observable<APIPaymentResponseDTO[]>;

  public readonly anyPayments$ = this.payments$?.pipe(matchNonEmptyArray());
  public readonly hasModifyPermission$ = this.store.select(selectItContractHasModifyPermissions);

  constructor(private readonly store: Store) {}
}
