import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/select';
import { map, Observable } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { validateExternalReferenceUrl } from '../../helpers/link.helpers';
import { openUrlInNewTab } from '../../helpers/navigation/navigation.helpers';
import { isEmptyOrUndefined } from '../../helpers/string.helpers';
import { SimpleLink } from '../../models/SimpleLink.model';
import { IconButtonComponent } from '../buttons/icon-button/icon-button.component';
import { PencilIconComponent } from '../icons/pencil-icon.compnent';
import { RecommendedBadgeComponent } from '../recommended-badge/recommended-badge.component';
import { ReadonlyLinkTextboxComponent } from './readonly-link-textbox/readonly-link-textbox.component';

@Component({
  selector: 'app-link-textbox',
  templateUrl: './link-textbox.component.html',
  styleUrls: ['./link-textbox.component.scss'],
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatSuffix,
    IconButtonComponent,
    PencilIconComponent,
    ReadonlyLinkTextboxComponent,
    AsyncPipe,
    RecommendedBadgeComponent,
  ],
})
export class LinkTextboxComponent extends BaseComponent {
  // Undefined preserves the badge state derived from this field.
  @Input() recommendedFilled: boolean | undefined;
  @Input() title!: string;
  @Input() simpleLink$!: Observable<SimpleLink | undefined>;
  @Input() isDisabled = false;
  @Input() isLinkOnly = false;
  @Input() size: 'medium' | 'large' = 'large';
  @Input() placeholder: string | undefined = undefined;
  @Input() recommended: boolean = false;
  @Output() iconClick = new EventEmitter<void>();
  @Output() clearClick = new EventEmitter<void>();

  public onIconClick(): void {
    this.iconClick.emit();
  }
  public onClearClick(): void {
    this.clearClick.emit();
  }
  public openLink(url: string | undefined): void {
    if (url) {
      openUrlInNewTab(url);
    }
  }

  public getLinkText() {
    return this.simpleLink$.pipe(
      map((simpleLink) => {
        const url = simpleLink?.url;
        if (this.isLinkOnly) return url;

        const name = simpleLink?.name;
        if (isEmptyOrUndefined(url) && isEmptyOrUndefined(name)) return null;

        const title = isEmptyOrUndefined(name) ? this.placeholder : name;
        if (this.validateSimpleLinkUrl(simpleLink?.url)) {
          return title;
        }
        return `${title}: ${simpleLink?.url}`;
      }),
    );
  }

  public enableClearX() {
    return this.simpleLink$.pipe(
      map((simpleLink) => {
        const url = simpleLink?.url;
        const name = simpleLink?.name;
        return !(isEmptyOrUndefined(url) && isEmptyOrUndefined(name));
      }),
    );
  }

  public hasNoLink() {
    return this.simpleLink$.pipe(
      map((simpleLink) => {
        return !simpleLink || !simpleLink.url;
      }),
    );
  }

  public validateSimpleLinkUrl(url: string | undefined) {
    return isEmptyOrUndefined(url) || validateExternalReferenceUrl(url);
  }

  public isUrlEmpty(url: string | undefined) {
    return isEmptyOrUndefined(url);
  }
}
