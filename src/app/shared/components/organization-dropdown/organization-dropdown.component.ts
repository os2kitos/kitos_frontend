import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatestWith, map, Observable } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { OrganizationDropdownComponentStore } from './organization-dropdown.component-store';

@Component({
  selector: 'app-organization-dropdown',
  templateUrl: './organization-dropdown.component.html',
  styleUrl: './organization-dropdown.component.scss',
  providers: [OrganizationDropdownComponentStore],
})
export class OrganizationDropdownComponent extends BaseComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() formName!: string;
  @Input() disabledOrganizationUuids$?: Observable<string[]>;

  private readonly disabledOrganizationUuidsSubject$ = new BehaviorSubject<string[]>([]);

  constructor(private componentStore: OrganizationDropdownComponentStore) {
    super();
  }

  public readonly isLoading$ = this.componentStore.loading$;
  public readonly organizations$ = this.componentStore.organizations$.pipe(
    combineLatestWith(this.disabledOrganizationUuidsSubject$),
    map(([organizations, disabledOrganizationUuids]) =>
      organizations.map((org) => ({
        ...org,
        disabled: disabledOrganizationUuids.includes(org.uuid),
      }))
    )
  );

  ngOnInit(): void {
    if (this.disabledOrganizationUuids$) {
      this.subscriptions.add(
        this.disabledOrganizationUuids$.subscribe((uuids) => {
          this.disabledOrganizationUuidsSubject$.next(uuids);
        })
      );
    }
  }

  public searchOrganizations(search: string): void {
    this.componentStore.searchOrganizations(search);
  }
}
