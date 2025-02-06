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
      })
    );

    this.setupContactPersonFields();
    this.setupDataResponsibleFields();
    this.setupDataProtectionAdvisorFields();
  }

  private setupDataResponsibleFields() {
    this.subscriptions.add(
      combineLatest([this.organizationUserIdentityNamePairs$, this.organizationMasterDataRoles$]).subscribe(
        ([organizationUserIdentityNamePairs, organizationMasterDataRoles]) => {
          const dataResponsible = organizationMasterDataRoles.DataResponsible;
          this.dataResponsibleForm.patchValue({
            nameControl: dataResponsible.name,
            phoneControl: dataResponsible.phone,
          });

          const dataResponsibleFromOrganizationUsers = organizationUserIdentityNamePairs.find(
            (user) => user.name === dataResponsible.email
          );

          if (dataResponsibleFromOrganizationUsers) {
            this.toggleDataResponsibleNonEmailControls(false);
            this.dataResponsibleForm.patchValue({
              emailControl: undefined,
              emailControlDropdown: dataResponsibleFromOrganizationUsers,
            });
          } else this.dataResponsibleForm.controls.emailControl.patchValue(dataResponsible.email);
        }
      )
    );
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

  private setupDataProtectionAdvisorFields() {
    this.subscriptions.add(
      this.organizationMasterDataRoles$.subscribe((organizationMasterDataRoles) => {
        const dataProtectionAdvisor = organizationMasterDataRoles.DataProtectionAdvisor;
        this.dataProtectionAdvisorForm.patchValue({
          nameControl: dataProtectionAdvisor.name,
          phoneControl: dataProtectionAdvisor.phone,
          emailControl: dataProtectionAdvisor.email,
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
      this.store.dispatch(OrganizationActions.patchMasterData({ request: masterData }));
    }
  }

  public patchDataResponsibleCvr(cvr: string | undefined) {
    this.patchMasterDataRolesDataResponsible(false, cvr);
  }

  private getValidCvrUpdate(newCvr: string | undefined, formControl: FormControl): string | undefined{
    if (newCvr !== undefined) return newCvr;
    return formControl.value ?? undefined;
  }

  public patchMasterDataRolesDataResponsible(
    useEmailFromDropdown: boolean = false,
    cvrEvent: string | undefined = undefined
  ) {
    if (this.dataResponsibleForm.valid) {
      this.subscriptions.add(
        this.organizationMasterDataRoles$.pipe(first()).subscribe((masterDataRoles) => {
          const dataResponsible = masterDataRoles.DataResponsible;
          const dataResponsibleDto: APIDataResponsibleRequestDTO = {};
          const controls = this.dataResponsibleForm.controls;

          const newCvr = this.getValidCvrUpdate(cvrEvent, controls.cvrControl);
          if (newCvr === dataResponsible.cvr) return;

          const email = useEmailFromDropdown ? controls.emailControlDropdown.value?.name : controls.emailControl.value;
          dataResponsibleDto.address = controls.addressControl.value ?? undefined;
          dataResponsibleDto.cvr = newCvr;
          dataResponsibleDto.email = email ?? undefined;
          dataResponsibleDto.name = controls.nameControl.value ?? undefined;
          dataResponsibleDto.phone = controls.phoneControl.value ?? undefined;

          this.store.dispatch(
            OrganizationActions.patchMasterDataRoles({ request: { dataResponsible: dataResponsibleDto } })
          );
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

      this.store.dispatch(
        OrganizationActions.patchMasterDataRoles({
          request: { contactPerson },
        })
      );
    }
  }

  public patchDataProtectionAdvisorCvr(cvr: string | undefined) {
    this.patchMasterDataRolesDataProtectionAdvisor(cvr);
  }

  public patchMasterDataRolesDataProtectionAdvisor(cvrEvent: string | undefined = undefined) {
    if (this.dataProtectionAdvisorForm.valid) {
      this.subscriptions.add(
        this.organizationMasterDataRoles$.pipe(first()).subscribe((masterDataRoles) => {
          const dataProtectionAdvisor = masterDataRoles.DataProtectionAdvisor;
          const dataProtectionAdvisorDto: APIDataProtectionAdvisorRequestDTO = {};
          const controls = this.dataProtectionAdvisorForm.controls;

          const newCvr = this.getValidCvrUpdate(cvrEvent, controls.cvrControl);
          if (newCvr === dataProtectionAdvisor.cvr) return;

          dataProtectionAdvisorDto.address = controls.addressControl.value ?? undefined;
          dataProtectionAdvisorDto.cvr = newCvr;
          dataProtectionAdvisorDto.email = controls.emailControl.value ?? undefined;
          dataProtectionAdvisorDto.name = controls.nameControl.value ?? undefined;
          dataProtectionAdvisorDto.phone = controls.phoneControl.value ?? undefined;

          this.store.dispatch(
            OrganizationActions.patchMasterDataRoles({
              request: { dataProtectionAdvisor: dataProtectionAdvisorDto },
            })
          );
        })
      );
    }
  }

  public updateMasterDataRolesContactPersonEmailFreeText() {
    const controls = this.contactPersonForm.controls;
    const searchedEmail = controls.emailControlDropdown.value;
    const typedEmail = controls.emailControl.value;

    if (!typedEmail && searchedEmail) return;

    controls.emailControlDropdown.patchValue(undefined);
    this.toggleContactPersonNonEmailControls(true);
    this.patchMasterDataRolesContactPerson();
  }

  public updateMasterDataRolesDataResponsibleEmailFreeText() {
    const controls = this.dataResponsibleForm.controls;
    const searchedEmail = controls.emailControlDropdown.value;
    const typedEmail = controls.emailControl.value;

    if (!typedEmail && searchedEmail) return;

    controls.emailControlDropdown.patchValue(undefined);
    this.toggleDataResponsibleNonEmailControls(true);
    this.patchMasterDataRolesDataResponsible();
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
            this.patchMasterDataRolesDataResponsible(true);
          }
        })
    );
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
            this.patchMasterDataRolesContactPerson(true);
          }
        })
    );
  }

  public searchOrganizationUsers(search?: string) {
    this.componentStore.searchOrganizationUsers(search);
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

  private toggleDataResponsibleNonEmailControls(enable: boolean) {
    const controls = this.dataResponsibleForm.controls;
    if (enable) {
      controls.nameControl.enable();
      controls.phoneControl.enable();
    } else {
      controls.nameControl.disable();
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
