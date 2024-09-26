import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { APIOrganizationMasterDataRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { OrganizationMasterDataActions } from 'src/app/store/organization/organization-master-data/actions';
import { selectOrganizationMasterData } from 'src/app/store/organization/organization-master-data/selectors';
import { selectOrganizationName, selectOrganizationUuid } from 'src/app/store/user-store/selectors';

@Component({
  selector: 'app-organization-master-data',
  templateUrl: './organization-master-data.component.html',
  styleUrl: './organization-master-data.component.scss',
})
export class OrganizationMasterDataComponent extends BaseComponent implements OnInit {
  public readonly organizationName$ = this.store.select(selectOrganizationName);
  public readonly organizationUuid$ = this.store.select(selectOrganizationUuid);
  public readonly organizationMasterData$ = this.store.select(selectOrganizationMasterData);

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
  });

  constructor(private readonly store: Store, private readonly notificationService: NotificationService) {
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
    console.log('TODO get values of all DR fields to drObj and patch "roles: { dr:drObj }"');
  }

  public patchMasterDataRolesDataProtectionAdvisor() {
    console.log('TODO get values of all DPA fields to dpaObj and patch "roles: { dpa:dpaObj }"');
  }

  public patchMasterDataRolesContactPerson() {
    console.log('TODO get values of all CP fields to cpObj and patch "roles: { cp:cpObj }"');
  }

  private commonNameControls() {
    return {
      nameControl: new FormControl<string | undefined>(undefined),
      lastNameControl: new FormControl<string | undefined>(undefined),
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
