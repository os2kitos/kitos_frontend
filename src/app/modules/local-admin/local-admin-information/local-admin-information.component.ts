import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { APIOrganizationResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { OrganizationMasterDataActions } from 'src/app/store/organization/organization-master-data/actions';
import { selectOrganizationHasModifyCvrPermission } from 'src/app/store/organization/organization-master-data/selectors';
import {
  selectOrganizationCvr,
  selectOrganizationName,
  selectOrganizationType,
} from 'src/app/store/user-store/selectors';

@Component({
  selector: 'app-local-admin-information',
  templateUrl: './local-admin-information.component.html',
  styleUrl: './local-admin-information.component.scss',
})
export class LocalAdminInformationComponent extends BaseComponent implements OnInit {
  public readonly organizationName$ = this.store.select(selectOrganizationName);
  public readonly hasModifyCvrPermission$ = this.store.select(selectOrganizationHasModifyCvrPermission);
  public readonly organizationCvr$ = this.store.select(selectOrganizationCvr);
  public readonly organizationType$ = this.store.select(selectOrganizationType);

  public readonly form = new FormGroup({
    nameControl: new FormControl<string | undefined>(undefined),
    cvrControl: new FormControl<number | undefined>(undefined),
    typeControl: new FormControl<string | undefined>({ value: '', disabled: true }),
  });

  constructor(private readonly store: Store) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(OrganizationMasterDataActions.getOrganizationPermissions());

    this.subscriptions.add(
      combineLatest([this.organizationName$, this.organizationCvr$, this.organizationType$]).subscribe(
        ([name, cvr, type]) => {
          this.form.patchValue({
            nameControl: name,
            cvrControl: Number.parseInt(cvr!),
            typeControl: this.mapOrganizationType(type),
          });
        }
      )
    );

    this.hasModifyCvrPermission$.subscribe((hasModifyCvrPermission) => {
      if (!hasModifyCvrPermission) this.form.controls.cvrControl.disable();
    });
  }

  private mapOrganizationType(source: APIOrganizationResponseDTO.OrganizationTypeEnum | undefined): string | undefined {
    switch (source) {
      case APIOrganizationResponseDTO.OrganizationTypeEnum.Municipality: {
        return $localize`Kommune`;
      }
      case APIOrganizationResponseDTO.OrganizationTypeEnum.CommunityOfInterest: {
        return $localize`Interessefællesskab`;
      }
      case APIOrganizationResponseDTO.OrganizationTypeEnum.Company: {
        return $localize`Virksomhed`;
      }
      case APIOrganizationResponseDTO.OrganizationTypeEnum.OtherPublicAuthority: {
        return $localize`Anden offentlig myndighed`;
      }
      default:
        return undefined;
    }
  }
}
