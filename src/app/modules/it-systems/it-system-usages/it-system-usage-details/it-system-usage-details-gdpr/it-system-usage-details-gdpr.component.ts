import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { selectITSystemUsageHasModifyPermission } from 'src/app/store/it-system-usage/selectors';

@Component({
  selector: 'app-it-system-usage-details-gdpr',
  templateUrl: './it-system-usage-details-gdpr.component.html',
  styleUrls: ['./it-system-usage-details-gdpr.component.scss']
})
export class ItSystemUsageDetailsGdprComponent extends BaseComponent {
  @Output() disableLinkControls = new EventEmitter<void>();

  public constructor(private readonly store: Store) {
    super();
  }

  public disableFormsIfNoPermissions(controls: AbstractControl[]) {
    this.subscriptions.add(
      this.store
        .select(selectITSystemUsageHasModifyPermission)
        .pipe(filter((hasModifyPermission) => hasModifyPermission === false))
        .subscribe(() => {
          controls.forEach((control: AbstractControl) => control.disable());
          this.disableLinkControls.emit();
        })
    );
  }
}
