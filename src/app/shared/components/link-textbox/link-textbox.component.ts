import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { selectItSystemUsageGdpr } from 'src/app/store/it-system-usage/selectors';
import { BaseComponent } from '../../base/base.component';
import { validateUrl } from '../../helpers/link.helpers';
import { SimpleLink } from '../../models/SimpleLink.model';
import { filterNullish } from '../../pipes/filter-nullish';

@Component({
  selector: 'app-link-textbox',
  templateUrl: './link-textbox.component.html',
  styleUrls: ['./link-textbox.component.scss'],
})
export class LinkTextboxComponent extends BaseComponent {
  @Input() public title!: string;
  @Input() public simpleLink$!: Observable<SimpleLink | undefined>;
  @Input() isDisabled = false;
  @Input() public size: 'medium' | 'large' = 'large';
  @Output() public iconClick = new EventEmitter<void>();

  constructor(private store: Store) {
    super();
  }

  public readonly isUrlValid$ = this.store.select(selectItSystemUsageGdpr).pipe(
    filterNullish(),
    map((gdpr) => validateUrl(gdpr.directoryDocumentation?.url))
  );

  public onIconClick(): void {
    this.iconClick.emit();
  }
  public openLink(url: string | undefined): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  public validateSimpleLinkUrl(url: string | undefined) {
    return validateUrl(url);
  }
}
