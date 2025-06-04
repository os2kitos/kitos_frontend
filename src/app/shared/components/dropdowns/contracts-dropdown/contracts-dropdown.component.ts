import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { combineLatestWith, map, Observable, of } from 'rxjs';
import { APIItContractResponseDTO } from 'src/app/api/v2';
import { ContractDropdownComponentStore } from './contracts-dropdown.component-store';
import { ConnectedDropdownComponent } from '../connected-dropdown/connected-dropdown.component';

@Component({
  selector: 'app-contracts-dropdown',
  templateUrl: './contracts-dropdown.component.html',
  styleUrl: './contracts-dropdown.component.scss',
  providers: [ContractDropdownComponentStore],
  imports: [ConnectedDropdownComponent, FormsModule, ReactiveFormsModule],
})
export class ContractsDropdownComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() formName!: string;
  @Input() disabledUuids$: Observable<string[]> = of([]);
  @Input() text: string = $localize`Vælg kontrakt`;

  @Output() contractChange = new EventEmitter<string | null | undefined>();

  public readonly isLoading$ = this.componentStore.loading$;
  public readonly contracts$ = this.componentStore.contracts$;

  public filteredContracts$!: Observable<APIItContractResponseDTO[]>;

  constructor(@Inject(ContractDropdownComponentStore) private componentStore: ContractDropdownComponentStore) {}

  ngOnInit(): void {
    this.filteredContracts$ = this.contracts$.pipe(
      combineLatestWith(this.disabledUuids$),
      map(([contracts, disabledUuids]) => {
        const disabledUuidsSet = new Set(disabledUuids);
        return contracts.filter((contract) => !disabledUuidsSet.has(contract.uuid));
      }),
    );
  }

  public searchContracts(search: string | undefined): void {
    this.componentStore.searchContracts(search);
  }

  public onContractChange(contractUuid: string | undefined | null): void {
    this.contractChange.emit(contractUuid);
  }
}
