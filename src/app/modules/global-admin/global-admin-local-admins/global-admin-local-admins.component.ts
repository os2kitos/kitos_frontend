import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocalAdminUserActions } from 'src/app/store/global-admin/local-admins/actions';
import { CardComponent } from '../../../shared/components/card/card.component';
import { GlobalAdminLocalAdminsGridComponent } from './global-admin-local-admins-grid/global-admin-local-admins-grid.component';

@Component({
  selector: 'app-global-admin-local-admins',
  templateUrl: './global-admin-local-admins.component.html',
  styleUrl: './global-admin-local-admins.component.scss',
  imports: [CardComponent, GlobalAdminLocalAdminsGridComponent],
})
export class GlobalAdminLocalAdminsComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(LocalAdminUserActions.getLocalAdmins());
  }
}
