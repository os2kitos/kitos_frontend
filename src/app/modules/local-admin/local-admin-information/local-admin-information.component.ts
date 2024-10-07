import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { OrganizationMasterDataActions } from 'src/app/store/organization/organization-master-data/actions';
import { selectOrganizationHasModifyCvrPermission } from 'src/app/store/organization/organization-master-data/selectors';
import { selectOrganizationCvr, selectOrganizationName, selectOrganizationType } from 'src/app/store/user-store/selectors';

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
    typeControl: new FormControl<string | undefined>(undefined),
  });

  constructor(private readonly store: Store) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(OrganizationMasterDataActions.getOrganizationPermissions());

    this.subscriptions.add(
      this.organizationName$.subscribe((organizationName) => {
        console.log(organizationName + ' is org')
        this.form.patchValue({
          nameControl: organizationName,
        });
      })
    );

    this.hasModifyCvrPermission$.subscribe((hasModifyCvrPermission) => {
      if (!hasModifyCvrPermission) this.form.controls.cvrControl.disable();
    })
  }
}
