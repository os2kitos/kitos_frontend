import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { first, map } from 'rxjs';
import { APIOrganizationResponseDTO } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { ChooseOrganizationComponentStore } from './choose-organization.component-store';

@Component({
  templateUrl: 'choose-organization.component.html',
  styleUrls: ['choose-organization.component.scss'],
  providers: [ChooseOrganizationComponentStore],
})
export class ChooseOrganizationComponent implements OnInit {
  @Input() public closable = true;

  public readonly organizations$ = this.componentStore.organizations$;
  public readonly isLoading$ = this.componentStore.loading$;
  public readonly showSearchHelpText$ = this.componentStore.organizations$.pipe(
    filterNullish(),
    map((organizations) => organizations.length >= this.componentStore.PAGE_SIZE)
  );

  constructor(
    private dialog: DialogRef,
    private store: Store,
    private componentStore: ChooseOrganizationComponentStore
  ) {}

  ngOnInit() {
    this.componentStore.getOrganizations(undefined);
  }

  public didChange(organization?: APIOrganizationResponseDTO | null) {
    if (!organization) return;

    this.store
      .select(selectOrganizationUuid)
      .pipe(first())
      .subscribe((organizationUuid) => {
        if (organization.uuid !== organizationUuid) {
          this.store.dispatch(UserActions.updateOrganization(organization));
        }
        this.dialog.close();
      });
  }

  public filterChange(filter?: string) {
    this.componentStore.getOrganizations(filter);
  }
}
