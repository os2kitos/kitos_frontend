import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, combineLatest, first, map } from 'rxjs';
import { APIIdentityNamePairResponseDTO, APISystemRelationWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { ModifyRelationDialogComponent } from '../modify-relation-dialog/modify-relation-dialog.component';
import { ItSystemUsageDetailsRelationsDialogComponentStore } from './relation-dialog.component-store';

export interface SystemRelationDialogFormModel {
  systemUsage: FormControl<APIIdentityNamePairResponseDTO | null | undefined>;
  description: FormControl<string | null | undefined>;
  reference: FormControl<string | null | undefined>;
  contract: FormControl<APIIdentityNamePairResponseDTO | null | undefined>;
  interface: FormControl<APIIdentityNamePairResponseDTO | null | undefined>;
  frequency: FormControl<APIIdentityNamePairResponseDTO | null | undefined>;
}

@Component({
  selector: 'app-system-relation-dialog[title][saveText][relationForm]',
  templateUrl: './system-relation-dialog.component.html',
  styleUrls: ['./system-relation-dialog.component.scss'],
})
export class SystemRelationDialogComponent extends BaseComponent implements OnInit {
  @Input() public title!: string;
  @Input() public saveText!: string;
  @Input() public relationForm!: FormGroup<SystemRelationDialogFormModel>;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onSaveEventRequested = new EventEmitter<APISystemRelationWriteRequestDTO>();

  public readonly systemUsages$ = this.componentStore.systemUsages$;
  public readonly systemUsagesLoading$ = this.componentStore.isSystemUsagesLoading$;
  public readonly contracts$ = this.componentStore.contracts$;
  public readonly contractsLoading$ = this.componentStore.contractsLoading$;
  public readonly interfaces$ = this.componentStore.interfaces$;

  public readonly interfacesLoading$ = this.componentStore.isInterfacesOrSystemUuidLoading$;

  public readonly showUsageSearchHelpText$ = this.componentStore.showUsageSearchHelpText$;

  public readonly availableReferenceFrequencyTypes$ = this.store
    .select(selectRegularOptionTypes('it-system_usage-relation-frequency-type'))
    .pipe(filterNullish());

  //current system Uuid (system, not system usage)
  private readonly selectedSystemUuid$ = this.componentStore.systemUuid$;

  //selected usage uuids
  private readonly changedSystemUsageUuid$ = this.componentStore.changedSystemUsageUuid$;
  //interface search terms
  private readonly searchInterfaceTerm$ = new Subject<string | undefined>();

  public isBusy = false;

  constructor(
    protected readonly store: Store,
    protected readonly componentStore: ItSystemUsageDetailsRelationsDialogComponentStore,
    private readonly dialog: MatDialogRef<ModifyRelationDialogComponent>,
    private readonly actions$: Actions
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system_usage-relation-frequency-type'));

    //on selected system usage change or interface search change, load the interfaces
    this.subscriptions.add(
      combineLatest([this.selectedSystemUuid$, this.searchInterfaceTerm$])
        .pipe(map(([systemUuid, searchTerm]) => ({ systemUuid, searchTerm })))
        .subscribe(({ systemUuid, searchTerm }) => {
          this.componentStore.getItInterfaces({ systemUuid: systemUuid, search: searchTerm });
        })
    );

    //when usage is selected enable the form, otherwise turn it off (other than the usage dropdown)
    this.subscriptions.add(
      this.changedSystemUsageUuid$.subscribe((usageUuid) => {
        this.relationForm.controls.interface.reset();
        if (usageUuid) {
          this.relationForm.enable();
        } else {
          this.relationForm.disable();
          this.relationForm.controls['systemUsage'].enable();
        }
      })
    );

    //on success close the dialog
    this.actions$
      .pipe(
        ofType(
          ITSystemUsageActions.addItSystemUsageRelationSuccess,
          ITSystemUsageActions.patchItSystemUsageRelationSuccess
        ),
        first()
      )
      .subscribe(() => this.dialog.close());

    //on error set isBusy to false
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.addItSystemUsageRelationError,
            ITSystemUsageActions.patchItSystemUsageRelationError
          )
        )
        .subscribe(() => {
          this.isBusy = false;
        })
    );
  }

  public usageFilterChange(search?: string) {
    this.componentStore.getItSystemUsages(search);
  }

  public contractFilterChange(search?: string) {
    this.componentStore.getItContracts(search);
  }

  public interfaceFilterChange(search?: string) {
    this.searchInterfaceTerm$.next(search);
  }

  public usageChange(usageUuid?: string) {
    this.componentStore.updateCurrentSystemUuid(usageUuid);
  }

  public save() {
    if (!this.relationForm.valid) return;

    const usage = this.relationForm.value.systemUsage;
    if (!usage) return;

    this.isBusy = true;

    const request = {
      toSystemUsageUuid: usage.uuid,
      relationInterfaceUuid: this.relationForm.value.interface?.uuid,
      associatedContractUuid: this.relationForm.value.contract?.uuid,
      relationFrequencyUuid: this.relationForm.value.frequency?.uuid,
      description: this.relationForm.value.description ?? undefined,
      urlReference: this.relationForm.value.reference ?? undefined,
    };

    this.onSaveEventRequested.emit(request);
  }

  public close() {
    this.dialog.close();
  }
}
