import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { APIOrganizationUpdateRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { mapOrganizationType } from 'src/app/shared/helpers/organization-type.helpers';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { cvrValidator } from 'src/app/shared/validators/cvr.validator';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { selectOrganizationHasModifyCvrPermission } from 'src/app/store/organization/selectors';
import { UserActions } from 'src/app/store/user-store/actions';
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
  public readonly organizationCvr$ = this.store.select(selectOrganizationCvr);
  public readonly organizationType$ = this.store.select(selectOrganizationType);
  public readonly hasModifyCvrPermission$ = this.store.select(selectOrganizationHasModifyCvrPermission);

  public readonly form = new FormGroup({
    nameControl: new FormControl<string | undefined>(undefined),
    cvrControl: new FormControl<number | undefined>(undefined, [cvrValidator()]),
    typeControl: new FormControl<string | undefined>({ value: undefined, disabled: true }),
  });

  constructor(private readonly store: Store) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(OrganizationActions.getOrganizationPermissions());
    this.SetupFormWithPermissions();
  }

  public SetupFormWithPermissions() {
    this.subscriptions.add(
      combineLatest([this.organizationName$, this.organizationCvr$, this.organizationType$]).subscribe(
        ([name, cvr, type]) => {
          this.form.patchValue({
            nameControl: name,
            cvrControl: this.GetCvrAsNumber(cvr),
            typeControl: mapOrganizationType(type),
          });
        }
      )
    );

    this.subscriptions.add(
      this.hasModifyCvrPermission$.pipe(filterNullish()).subscribe((hasModifyCvrPermission) => {
        if (!hasModifyCvrPermission) this.form.controls.cvrControl.disable();
      })
    );
  }

  public patchOrganizationName(newName: string | undefined) {
    if (newName !== undefined) this.patchOrganization({ name: newName });
  }

  public patchOrganizationCvr(newCvr: number | undefined) {
    if (this.form.controls.cvrControl.invalid) return;

    if (newCvr !== undefined) this.patchOrganization({ cvr: newCvr?.toString() });
  }

  private patchOrganization(request: APIOrganizationUpdateRequestDTO) {
    this.store.dispatch(UserActions.patchOrganization({ request }));
  }

  private GetCvrAsNumber(dtoCvr: string | undefined) {
    return dtoCvr ? Number.parseInt(dtoCvr) : undefined;
  }
}
