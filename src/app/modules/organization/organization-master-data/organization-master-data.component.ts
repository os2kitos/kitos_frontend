import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, first } from 'rxjs';
import {
  APIContactPersonRequestDTO,
  APIDataProtectionAdvisorRequestDTO,
  APIDataResponsibleRequestDTO,
  APIOrganizationMasterDataRequestDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { IdentityNamePair } from 'src/app/shared/models/identity-name-pair.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { OrganizationActions } from 'src/app/store/organization/actions';
import {
  selectOrganizationHasModifyCvrPermission,
  selectOrganizationHasModifyPermission,
  selectOrganizationMasterData,
  selectOrganizationMasterDataRoles,
} from 'src/app/store/organization/selectors';
import { selectOrganizationName, selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { OrganizationMasterDataComponentStore } from './organization-master-data.component-store';

@Component({
  selector: 'app-organization-master-data',
  templateUrl: './organization-master-data.component.html',
  styleUrl: './organization-master-data.component.scss',
  providers: [OrganizationMasterDataComponentStore],
})
export class OrganizationMasterDataComponent extends BaseComponent implements OnInit {
  public readonly organizationName$ = this.store.select(selectOrganizationName);
  public readonly organizationUuid$ = this.store.select(selectOrganizationUuid);
  public readonly organizationMasterData$ = this.store.select(selectOrganizationMasterData);
  public readonly organizationMasterDataRoles$ = this.store.select(selectOrganizationMasterDataRoles);
  public readonly hasOrganizationModifyPermission$ = this.store.select(selectOrganizationHasModifyPermission);
  public readonly hasOrganizationCvrModifyPermission$ = this.store.select(selectOrganizationHasModifyCvrPermission);

  public readonly organizationUsers$ = this.componentStore.organizationUsers$;
  public readonly organizationUsersLoading$ = this.componentStore.organizationUsersLoading$;
  public readonly organizationUserIdentityNamePairs$ = this.componentStore.organizationUserIdentityNamePairs$;

  public readonly masterDataForm = new FormGroup({
    ...this.commonOrganizationControls(),
    ...this.commonContactControls(),
  });

  public readonly dataResponsibleForm = new FormGroup({
    ...this.commonNameControls(),
    ...this.commonOrganizationControls(),
    ...this.commonContactControls(),
    emailControlDropdown: new FormControl<IdentityNamePair | undefined>(undefined),
  });

  public readonly dataProtectionAdvisorForm = new FormGroup({
    ...this.commonNameControls(),
    ...this.commonOrganizationControls(),
    ...this.commonContactControls(),
  });

  public readonly contactPersonForm = new FormGroup({
    ...this.commonNameControls(),
    ...this.commonContactControls(),
    emailControlDropdown: new FormControl<IdentityNamePair | undefined>(undefined),
    lastNameControl: new FormControl<string | undefined>(undefined),
  });

  constructor(
    private readonly store: Store,
    private readonly notificationService: NotificationService,
    private readonly componentStore: OrganizationMasterDataComponentStore
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(OrganizationActions.getMasterData());
    this.store.dispatch(OrganizationActions.getMasterDataRoles());
    this.store.dispatch(OrganizationActions.getOrganizationPermissions());

    this.setupFormData();
    this.setupAccessControl();
  }

  private setupAccessControl() {
    this.subscriptions.add(
      this.hasOrganizationCvrModifyPermission$.pipe(filterNullish()).subscribe((hasOrganizationCvrModifyPermission) => {
        if (!hasOrganizationCvrModifyPermission) this.masterDataForm.controls.cvrControl.disable();
      })
    );

    this.subscriptions.add(
      this.hasOrganizationModifyPermission$.pipe(filterNullish()).subscribe((hasOrganizationModifyPermission) => {
        if (!hasOrganizationModifyPermission) {
          this.masterDataForm.disable();
          this.dataResponsibleForm.disable();
          this.contactPersonForm.disable();
          this.dataProtectionAdvisorForm.disable();
        }
      })
    );
  }

  private setupFormData() {
    this.subscriptions.add(
      this.organizationMasterData$.subscribe((organizationMasterData) => {
        this.masterDataForm.patchValue({
          cvrControl: organizationMasterData?.cvr,
          phoneControl: organizationMasterData?.phone,
          emailControl: organizationMasterData?.email,
          addressControl: organizationMasterData?.address,
        });
      })
    );

    this.subscriptions.add(
      this.organizationMasterDataRoles$.subscribe((masterDataRoles) => {
        const dataResponsible = masterDataRoles.DataResponsible;
        this.dataResponsibleForm.patchValue({
          nameControl: dataResponsible.name,
          emailControl: dataResponsible.email,
          phoneControl: dataResponsible.phone,
          cvrControl: dataResponsible.cvr,
          addressControl: dataResponsible.address,
        });

        const dataProtectionAdvisor = masterDataRoles.DataProtectionAdvisor;
        this.dataProtectionAdvisorForm.patchValue({
          nameControl: dataProtectionAdvisor.name,
          emailControl: dataProtectionAdvisor.email,
          phoneControl: dataProtectionAdvisor.phone,
          cvrControl: dataProtectionAdvisor.cvr,
          addressControl: dataProtectionAdvisor.address,
        });
      })
    );

    this.setupContactPersonFields();
  }

  private setupContactPersonFields() {
    this.subscriptions.add(
      combineLatest([this.organizationUserIdentityNamePairs$, this.organizationMasterDataRoles$]).subscribe(
        ([organizationUserIdentityNamePairs, organizationMasterDataRoles]) => {
          const contactPerson = organizationMasterDataRoles.ContactPerson;
          this.contactPersonForm.patchValue({
            nameControl: contactPerson.name,
            lastNameControl: contactPerson.lastName,
            phoneControl: contactPerson.phoneNumber,
          });

          const contactPersonFromOrganizationUsers = organizationUserIdentityNamePairs.find(
            (user) => user.name === contactPerson.email
          );

          if (contactPersonFromOrganizationUsers) {
            this.toggleContactPersonNonEmailControls(false);
            this.contactPersonForm.patchValue({
              emailControl: undefined,
              emailControlDropdown: contactPersonFromOrganizationUsers,
            });
          } else this.contactPersonForm.controls.emailControl.patchValue(contactPerson.email);
        }
      )
    );
  }

  public patchMasterData(masterData: APIOrganizationMasterDataRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      this.store.dispatch(OrganizationActions.patchMasterData({ request: masterData }));
    }
  }

  public patchMasterDataRolesDataProtectionAdvisor() {
    if (this.dataProtectionAdvisorForm.valid) {
      const dataProtectionAdvisor: APIDataProtectionAdvisorRequestDTO = {};
      const controls = this.dataProtectionAdvisorForm.controls;
      dataProtectionAdvisor.address = controls.addressControl.value ?? undefined;
      dataProtectionAdvisor.cvr = controls.cvrControl.value ?? undefined;
      dataProtectionAdvisor.email = controls.emailControl.value ?? undefined;
      dataProtectionAdvisor.name = controls.nameControl.value ?? undefined;
      dataProtectionAdvisor.phone = controls.phoneControl.value ?? undefined;

      this.store.dispatch(
        OrganizationActions.patchMasterDataRoles({
          request: { dataProtectionAdvisor },
        })
      );
    }
  }

  public updateMasterDataRolesContactPersonEmailFreeText() {
    const controls = this.contactPersonForm.controls;
    controls.emailControlDropdown.patchValue(undefined);
    this.toggleContactPersonNonEmailControls(true);
    this.patchMasterDataRolesContactPerson();
  }

  public updateMasterDataRolesDataResponsibleEmailFreeText() {
    const controls = this.dataResponsibleForm.controls;
    controls.emailControlDropdown.patchValue(undefined);
    this.toggleDataResponsibleNonEmailControls(true);
    this.patchMasterDataRolesDataResponsible();
  }

  public patchMasterDataRolesDataResponsible(useEmailFromDropdown: boolean = false) {
    if (this.dataResponsibleForm.valid) {
      const dataResponsible: APIDataResponsibleRequestDTO = {};
      const controls = this.dataResponsibleForm.controls;
      const email = useEmailFromDropdown ? controls.emailControlDropdown.value?.name : controls.emailControl.value;
      dataResponsible.address = controls.addressControl.value ?? undefined;
      dataResponsible.cvr = controls.cvrControl.value ?? undefined;
      dataResponsible.email = email ?? undefined;
      dataResponsible.name = controls.nameControl.value ?? undefined;
      dataResponsible.phone = controls.phoneControl.value ?? undefined;

      this.store.dispatch(OrganizationActions.patchMasterDataRoles({ request: { dataResponsible } }));
    }
  }

  public patchMasterDataRolesContactPerson(useEmailFromDropdown: boolean = false) {
    if (this.contactPersonForm.valid) {
      const contactPerson: APIContactPersonRequestDTO = {};
      const controls = this.contactPersonForm.controls;
      const email = useEmailFromDropdown ? controls.emailControlDropdown.value?.name : controls.emailControl.value;
      contactPerson.lastName = controls.lastNameControl.value ?? undefined;
      contactPerson.email = email ?? undefined;
      contactPerson.name = controls.nameControl.value ?? undefined;
      contactPerson.phoneNumber = controls.phoneControl.value ?? undefined;

      this.store.dispatch(
        OrganizationActions.patchMasterDataRoles({
          request: { contactPerson },
        })
      );
    }
  }

  public selectContactPersonFromOrganizationUsers(selectedUserUuid?: string) {
    this.subscriptions.add(
      combineLatest([this.organizationUuid$, this.organizationUsers$])
        .pipe(first())
        .subscribe(([organizationUuid, organizationUsers]) => {
          if (selectedUserUuid) {
            const selectedUser = organizationUsers.find((u) => u.uuid === selectedUserUuid);

            this.contactPersonForm.patchValue({
              lastNameControl: selectedUser?.lastName,
              nameControl: selectedUser?.firstName,
              phoneControl: selectedUser?.phone,
            });

            this.toggleContactPersonNonEmailControls(false);
          } else {
            this.toggleContactPersonNonEmailControls(true);
          }

          if (organizationUuid) {
            this.patchMasterDataRolesDataResponsible(true);
          }
        })
    );
  }

  public selectDataResponsibleFromOrganizationUsers(selectedUserUuid?: string) {
    this.subscriptions.add(
      combineLatest([this.organizationUuid$, this.organizationUsers$])
        .pipe(first())
        .subscribe(([organizationUuid, organizationUsers]) => {
          if (selectedUserUuid) {
            const selectedUser = organizationUsers.find((u) => u.uuid === selectedUserUuid);

            this.dataResponsibleForm.patchValue({
              nameControl: selectedUser?.firstName,
              phoneControl: selectedUser?.phone,
            });

            this.toggleDataResponsibleNonEmailControls(false);
          } else {
            this.toggleDataResponsibleNonEmailControls(true);
          }

          if (organizationUuid) {
            this.patchMasterDataRolesContactPerson(true);
          }
        })
    );
  }

  public searchOrganizationUsers(search?: string) {
    this.componentStore.searchOrganizationUsers(search);
  }

  private toggleDataResponsibleNonEmailControls(enable: boolean){
    const controls = this.dataResponsibleForm.controls;
    if (enable) {
      controls.nameControl.enable();
      controls.phoneControl.enable();
    } else {
      controls.nameControl.disable();
      controls.phoneControl.disable();
    }
  }

  private toggleContactPersonNonEmailControls(enable: boolean) {
    const controls = this.contactPersonForm.controls;
    if (enable) {
      controls.nameControl.enable();
      controls.lastNameControl.enable();
      controls.phoneControl.enable();
    } else {
      controls.nameControl.disable();
      controls.lastNameControl.disable();
      controls.phoneControl.disable();
    }
  }

  private commonNameControls() {
    return {
      nameControl: new FormControl<string | undefined>(undefined),
    };
  }

  private commonContactControls() {
    return {
      phoneControl: new FormControl<string | undefined>(undefined),
      emailControl: new FormControl<string | undefined>(undefined),
    };
  }

  private commonOrganizationControls() {
    return {
      cvrControl: new FormControl<string | undefined>(undefined, Validators.maxLength(10)),
      addressControl: new FormControl<string | undefined>(undefined),
    };
  }
}
