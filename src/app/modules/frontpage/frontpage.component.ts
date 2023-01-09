import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectUser } from 'src/app/store/user-store/selectors';

@Component({
  templateUrl: 'frontpage.component.html',
  styleUrls: ['frontpage.component.scss'],
})
export class FrontpageComponent {
  public user$ = this.store.select(selectUser);

  constructor(private store: Store) {}

  public testLogin() {
    this.store.dispatch(UserActions.getUser());
  }
}
