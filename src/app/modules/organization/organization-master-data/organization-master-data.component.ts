import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { APIOrganizationMasterDataRequestDTO } from 'src/app/api/v2';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { selectOrganization } from 'src/app/store/user-store/selectors';

@Component({
  selector: 'app-organization-master-data',
  templateUrl: './organization-master-data.component.html',
  styleUrl: './organization-master-data.component.scss',
})
export class OrganizationMasterDataComponent implements OnInit {
  public readonly organization$ = this.store.select(selectOrganization);
  public readonly masterDataForm = new FormGroup({
    cvrControl: new FormControl<string | undefined>(undefined),
    phoneControl: new FormControl<string | undefined>(undefined),
    emailControl: new FormControl<string | undefined>(undefined),
    addressControl: new FormControl<string | undefined>(undefined),
  });

  constructor(private readonly store: Store, private readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.organization$.subscribe((organization) => {
      this.masterDataForm.patchValue({
        cvrControl: organization?.cvr,
        //phoneControl: organization.phone,
        //emailControl: organization.email
        //addressControl: organization.address
      });
    });
  }

  public patchMasterData(masterData: APIOrganizationMasterDataRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      console.log('patching' + JSON.stringify(masterData));
      //this.store.dispatch(); TODO make action chain for patching org master data
    }
  }
}
