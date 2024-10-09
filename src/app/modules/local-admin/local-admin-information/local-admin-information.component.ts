import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { mapOrganizationType } from 'src/app/shared/helpers/organization-type.helpers';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { selectOrganizationHasModifyCvrPermission } from 'src/app/store/organization/selectors';
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
    this.store.dispatch(OrganizationActions.getOrganizationPermissions());

    this.subscriptions.add(
      combineLatest([this.organizationName$, this.organizationCvr$, this.organizationType$]).subscribe(
        ([name, cvr, type]) => {
          this.form.patchValue({
            nameControl: name,
            cvrControl: Number.parseInt(cvr!),
            typeControl: mapOrganizationType(type),
          });
        }
      )
    );

    this.hasModifyCvrPermission$.subscribe((hasModifyCvrPermission) => {
      if (!hasModifyCvrPermission) this.form.controls.cvrControl.disable();
    });
  }


  public patchOrganizationName(newName: string | undefined) {
    this.store.dispatch(OrganizationActions.patchOrganization({ name: newName }));
  }

  public patchOrganizationCvr(newCvr: number | undefined) {
    this.store.dispatch(OrganizationActions.patchOrganization({ cvr: newCvr?.toString() }));
  }
}
