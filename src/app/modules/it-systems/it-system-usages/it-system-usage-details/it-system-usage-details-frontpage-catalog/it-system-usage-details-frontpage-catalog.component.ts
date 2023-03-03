import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { first, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import {
  selectItSystemUsageGeneral,
  selectItSystemUsageSystemContextUuid,
  selectItSystemUsageValid,
} from 'src/app/store/it-system-usage/selectors';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { selectItSystem } from 'src/app/store/it-system/selectors';

@Component({
  selector: 'app-it-system-usage-details-frontpage-catalog',
  templateUrl: 'it-system-usage-details-frontpage-catalog.component.html',
  styleUrls: ['it-system-usage-details-frontpage-catalog.component.scss'],
})
export class ITSystemUsageDetailsFrontpageCatalogComponent extends BaseComponent implements OnInit {
  public readonly itSystemInformationForm = new FormGroup({
    name: new FormControl({ value: '', disabled: true }),
    parentSystem: new FormControl({ value: '', disabled: true }),
    formerName: new FormControl({ value: '', disabled: true }),
    rightsHolder: new FormControl({ value: '', disabled: true }),
    businessType: new FormControl({ value: '', disabled: true }),
    scope: new FormControl({ value: '', disabled: true }),
    uuid: new FormControl({ value: '', disabled: true }),
    recommendedArchiveDuty: new FormControl({ value: '', disabled: true }),
    urlReference: new FormControl({ value: '', disabled: true }),
    description: new FormControl({ value: '', disabled: true }),
  });

  public invalidReason$ = this.store.select(selectItSystemUsageGeneral).pipe(
    map((general) => {
      if (general?.validity.valid) return undefined;

      return (
        $localize`Følgende gør systemet 'ikke aktivt': ` +
        compact([
          general?.validity.validAccordingToLifeCycle ? undefined : $localize`Livscyklus`,
          general?.validity.validAccordingToMainContract ? undefined : $localize`Den markerede kontrakt`,
          general?.validity.validAccordingToValidityPeriod ? undefined : $localize`Ibrugtagningsperiode`,
        ]).join(', ')
      );
    })
  );

  public itSystemUsageValid$ = this.store.select(selectItSystemUsageValid);

  constructor(private store: Store) {
    super();
  }

  ngOnInit() {
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageSystemContextUuid)
        .pipe(first())
        .subscribe((systemContextUuid) => this.store.dispatch(ITSystemActions.getItSystem(systemContextUuid)))
    );

    this.subscriptions.add(
      this.store.select(selectItSystem).subscribe((itSystem) => {
        if (!itSystem) return;

        this.itSystemInformationForm.patchValue({
          name: itSystem.name,
          parentSystem: itSystem.parentSystem?.name ?? '',
          formerName: itSystem.formerName,
          rightsHolder: itSystem.rightsHolder?.name ?? '',
          businessType: itSystem.businessType?.name ?? '',
          scope: itSystem.scope,
          uuid: itSystem.uuid,
          recommendedArchiveDuty: itSystem.recommendedArchiveDuty.id,
          urlReference: itSystem.externalReferences.join(', '),
          description: itSystem.description,
        });
      })
    );
  }
}
