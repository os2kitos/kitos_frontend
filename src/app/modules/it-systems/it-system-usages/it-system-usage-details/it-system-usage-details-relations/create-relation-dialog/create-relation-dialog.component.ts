import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { APIItContractResponseDTO, APIItSystemUsageResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { ItSystemUsageDetailsRelationsComponentStore } from '../it-system-usage-details-relations.component-store';
import { ModifyRelationDialogComponent } from '../modify-relation-dialog/modify-relation-dialog.component';

@Component({
  selector: 'app-create-relation-dialog',
  templateUrl: './create-relation-dialog.component.html',
  styleUrls: ['./create-relation-dialog.component.scss'],
})
export class CreateRelationDialogComponent extends BaseComponent implements OnInit {
  public readonly relationForm = new FormGroup({
    systemUsage: new FormControl<APIItSystemUsageResponseDTO | undefined>({ value: undefined, disabled: false }),
    description: new FormControl<string | undefined>({ value: undefined, disabled: false }),
    reference: new FormControl<string | undefined>({ value: undefined, disabled: false }),
    contract: new FormControl<APIItContractResponseDTO | undefined>({ value: undefined, disabled: false }),
    interface: new FormControl<undefined>({ value: undefined, disabled: false }),
    frequency: new FormControl<undefined>({ value: undefined, disabled: false }),
  });

  public readonly systemUsages$ = this.componentStore.systemUsages$;
  public readonly systemUsagesLoading$ = this.componentStore.isSystemUsagesLoading$;
  public readonly showSearchHelpText$ = this.componentStore.systemUsages$.pipe(
    filterNullish(),
    map((usages) => usages.length >= this.componentStore.PAGE_SIZE)
  );
  public readonly availableReferenceFrequencyTypes$ = this.store
    .select(selectRegularOptionTypes('it-system_usage-relation-frequency-type'))
    .pipe(filterNullish());

  public isUsageEmpty = true;

  constructor(
    private readonly store: Store,
    private readonly componentStore: ItSystemUsageDetailsRelationsComponentStore,
    private readonly dialog: MatDialogRef<ModifyRelationDialogComponent>
  ) {
    super();
  }

  ngOnInit(): void {
    this.componentStore.getItSystemUsages(undefined);

    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system_usage-relation-frequency-type'));
  }

  public filterChange(search?: string) {
    this.componentStore.getItSystemUsages(search);
  }

  public usageChange(usage?: APIItSystemUsageResponseDTO) {
    if (!usage) {
      this.isUsageEmpty = true;
      return;
    }
    this.isUsageEmpty = false;
  }

  public OnClose() {
    this.dialog.close();
  }
}
