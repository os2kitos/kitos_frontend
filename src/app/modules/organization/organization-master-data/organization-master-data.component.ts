import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import {
  APIContactPersonRequestDTO,
  APIDataProtectionAdvisorRequestDTO,
  APIDataResponsibleRequestDTO,
  APIOrganizationMasterDataRequestDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { IdentityNamePair } from 'src/app/shared/models/identity-name-pair.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { OrganizationMasterDataActions } from 'src/app/store/organization/organization-master-data/actions';
import {
  selectOrganizationMasterData,
  selectOrganizationMasterDataRoles,
} from 'src/app/store/organization/organization-master-data/selectors';
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
    this.subscriptions.add(
      this.organizationUuid$.subscribe((organizationUuid) => {
        if (organizationUuid) {
          this.store.dispatch(OrganizationMasterDataActions.getMasterData({ organizationUuid }));
          this.store.dispatch(OrganizationMasterDataActions.getMasterDataRoles({ organizationUuid }));
        }
      })
    );

    this.setupFormData();
    this.toggleContactPersonFieldsOnLoad();
  }

  private toggleContactPersonFieldsOnLoad() {
    this.subscriptions.add(
      combineLatest([this.organizationUsers$, this.organizationMasterDataRoles$]).subscribe(
        ([organizationUsers, organizationMasterDataRoles]) => {
          const controls = this.contactPersonForm.controls;
          const contactPersonEmail = organizationMasterDataRoles.ContactPerson.email;
          const isContactPersonAnOrganizationUser =
            organizationUsers.find((user) => user.email === contactPersonEmail) !== undefined;

          if (isContactPersonAnOrganizationUser) {
            controls.nameControl.disable();
            controls.lastNameControl.disable();
            controls.phoneControl.disable();
          }
        }
      )
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
        const contactPerson = masterDataRoles.ContactPerson;
        this.contactPersonForm.patchValue({
          nameControl: contactPerson.name,
          lastNameControl: contactPerson.lastName,
          emailControl: contactPerson.email,
          phoneControl: contactPerson.phoneNumber,
        });

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
  }

  public patchMasterData(masterData: APIOrganizationMasterDataRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      this.subscriptions.add(
        this.organizationUuid$.subscribe((organizationUuid) => {
          if (organizationUuid) {
            this.store.dispatch(
              OrganizationMasterDataActions.patchMasterData({ organizationUuid, request: masterData })
            );
          }
        })
      );
    }
  }

  public patchMasterDataRolesDataResponsible() {
    if (this.dataResponsibleForm.valid) {
      const dataResponsible: APIDataResponsibleRequestDTO = {};
      const controls = this.dataResponsibleForm.controls;
      dataResponsible.address = controls.addressControl.value ?? undefined;
      dataResponsible.cvr = controls.cvrControl.value ?? undefined;
      dataResponsible.email = controls.emailControl.value ?? undefined;
      dataResponsible.name = controls.nameControl.value ?? undefined;
      dataResponsible.phone = controls.phoneControl.value ?? undefined;

      this.subscriptions.add(
        this.organizationUuid$.subscribe((organizationUuid) => {
          if (organizationUuid) {
            this.store.dispatch(
              OrganizationMasterDataActions.patchMasterDataRoles({ organizationUuid, request: { dataResponsible } })
            );
          }
        })
      );
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

      this.subscriptions.add(
        this.organizationUuid$.subscribe((organizationUuid) => {
          if (organizationUuid) {
            this.store.dispatch(
              OrganizationMasterDataActions.patchMasterDataRoles({
                organizationUuid,
                request: { dataProtectionAdvisor },
              })
            );
          }
        })
      );
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

      this.subscriptions.add(
        this.organizationUuid$.subscribe((organizationUuid) => {
          if (organizationUuid) {
            this.store.dispatch(
              OrganizationMasterDataActions.patchMasterDataRoles({
                organizationUuid,
                request: { contactPerson },
              })
            );
          }
        })
      );
    }
  }

  public selectContactPersonFromOrganizationUsers(selectedUserUuid?: string) {
    this.subscriptions.add(
      combineLatest([this.organizationUuid$, this.organizationUsers$]).subscribe(
        ([organizationUuid, organizationUsers]) => {
          const controls = this.contactPersonForm.controls;
          if (selectedUserUuid) {
            const selectedUser = organizationUsers.find((u) => u.uuid === selectedUserUuid);

            this.contactPersonForm.patchValue({
              emailControl: selectedUser?.email,
              lastNameControl: selectedUser?.lastName,
              nameControl: selectedUser?.firstName,
              phoneControl: selectedUser?.phone,
            });

            controls.nameControl.disable();
            controls.lastNameControl.disable();
            controls.phoneControl.disable();
          } else {
            controls.nameControl.enable();
            controls.lastNameControl.enable();
            controls.phoneControl.enable();
          }

          if (organizationUuid) {
            this.patchMasterDataRolesContactPerson(true);
          }
        }
      )
    );
  }

  public searchOrganizationUsers(search?: string) {
    this.componentStore.searchOrganizationUsers(search);
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
