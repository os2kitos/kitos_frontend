import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { APITextDTO } from 'src/app/api/v1';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectUser } from 'src/app/store/user-store/selectors';
import { FrontpageComponentStore } from './frontpage.component-store';

@Component({
  templateUrl: 'frontpage.component.html',
  styleUrls: ['frontpage.component.scss'],
  providers: [FrontpageComponentStore],
})
export class FrontpageComponent implements OnInit {
  public user$ = this.store.select(selectUser);

  public loading$ = this.frontpageComponentStore.loading$;
  public text$ = this.frontpageComponentStore
    .text$
    .pipe(map(texts =>
      texts.map(text => {
        return <APITextDTO>{
          id: text.id,
          text: this.sanitizer.sanitize(SecurityContext.HTML, text.value ?? "")
        }
      })));

  constructor(private store: Store, private frontpageComponentStore: FrontpageComponentStore, private readonly sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.frontpageComponentStore.getText();
  }

  public testLogin() {
    this.store.dispatch(UserActions.getUser());
  }
}
