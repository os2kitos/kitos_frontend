import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, map } from 'rxjs';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { mapToTree } from 'src/app/shared/helpers/hierarchy.helpers';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import {
  selectContract,
  selectItContractHasModifyPermissions,
  selectItContractUuid,
} from 'src/app/store/it-contract/selectors';
import { ItContractHierarchyComponentStore } from './it-contract-hierarchy.component-store';

@Component({
  selector: 'app-it-contract-hierarchy',
  templateUrl: './it-contract-hierarchy.component.html',
  styleUrl: './it-contract-hierarchy.component.scss',
  providers: [ItContractHierarchyComponentStore],
})
export class ItContractHierarchyComponent extends BaseComponent implements OnInit {
  public readonly contractUuid$ = this.store.select(selectItContractUuid).pipe(filterNullish());
  public readonly hierarchy$ = this.componentStore.hierarchy$.pipe(map((hierarchy) => mapToTree(hierarchy)));
  public readonly isLoading$ = this.componentStore.isLoading$;
  public readonly contracts$ = this.componentStore.contracts$;
  public readonly contractsIsLoading$ = this.componentStore.contractsLoading$;

  public readonly contractForm = new FormGroup({
    parentContract: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
  });

  constructor(
    private readonly store: Store,
    private readonly componentStore: ItContractHierarchyComponentStore,
    private readonly notificationService: NotificationService,
    private readonly actions$: Actions
  ) {
    super();
  }
  ngOnInit(): void {
    this.componentStore.getHierarchy(this.contractUuid$);

    this.subscriptions.add(
      this.store
        .select(selectContract)
        .pipe(filterNullish(), combineLatestWith(this.store.select(selectItContractHasModifyPermissions)))
        .subscribe(([contract, hasModifyPermission]) => {
          if (hasModifyPermission) {
            this.contractForm.patchValue({ parentContract: contract.parentContract });
            this.contractForm.enable();
          }
        })
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(ITContractActions.patchITContractSuccess)).subscribe(() => {
        this.componentStore.getHierarchy(this.contractUuid$);
      })
    );
  }

  public patchParentContract(
    parentContractUuid: string | undefined,
    valueChange?: ValidatedValueChange<unknown>
  ): void {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      this.store.dispatch(ITContractActions.patchITContract({ parentContractUuid }));
    }
  }

  public search(search?: string): void {
    this.componentStore.searchContracts(search);
  }
}
