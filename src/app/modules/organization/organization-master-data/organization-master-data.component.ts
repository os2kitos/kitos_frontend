import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
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

  constructor(private readonly store: Store) {}
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
}
