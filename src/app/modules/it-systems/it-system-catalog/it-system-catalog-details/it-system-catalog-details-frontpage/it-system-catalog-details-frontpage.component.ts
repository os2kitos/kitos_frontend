import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { APIExternalReferenceDataResponseDTO, APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { selectItSystemIsActive } from 'src/app/store/it-system/selectors';

@Component({
  selector: 'app-it-system-catalog-details-frontpage',
  templateUrl: './it-system-catalog-details-frontpage.component.html',
  styleUrl: './it-system-catalog-details-frontpage.component.scss',
})
export class ItSystemCatalogDetailsFrontpageComponent extends BaseComponent {
  public readonly itSystemIsActive$ = this.store.select(selectItSystemIsActive);

  public readonly itSystemFrontpageFormGroup = new FormGroup({
    name: new FormControl({ value: '', disabled: true }),
    parentSystem: new FormControl({ value: '', disabled: true }),
    formerName: new FormControl({ value: '', disabled: true }),
    rightsHolder: new FormControl({ value: '', disabled: true }),
    businessType: new FormControl<APIRegularOptionResponseDTO | undefined>({ value: undefined, disabled: true }),
    scope: new FormControl({ value: '', disabled: true }),
    uuid: new FormControl({ value: '', disabled: true }),
    recommendedArchiveDuty: new FormControl({ value: '', disabled: true }),
    recommendedArchiveDutyComment: new FormControl({ value: '', disabled: true }),
    urlReference: new FormControl<APIExternalReferenceDataResponseDTO[] | undefined>({
      value: undefined,
      disabled: true,
    }),
    description: new FormControl({ value: '', disabled: true }),
  });

  constructor(private store: Store) {
    super();
  }
}
