import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
import {
  selectOrganizationUserGridColumns,
  selectOrganizationUserGridData,
  selectOrganizationUserGridLoading,
  selectOrganizationUserGridState,
} from 'src/app/store/organization-user/selectors';

@Component({
  selector: 'app-organization-users',
  templateUrl: './organization-users.component.html',
  styleUrl: './organization-users.component.scss',
})
export class OrganizationUsersComponent extends BaseOverviewComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectOrganizationUserGridLoading);
  public readonly gridData$ = this.store.select(selectOrganizationUserGridData);
  public readonly gridState$ = this.store.select(selectOrganizationUserGridState);
  public readonly gridColumns$ = this.store.select(selectOrganizationUserGridColumns);

  constructor(
    store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private actions$: Actions,
    private statePersistingService: StatePersistingService
  ) {
    super(store, 'it-interface');
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
