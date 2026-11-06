import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { mapUIConfigStatusToRecommended } from 'src/app/shared/helpers/observable-helpers';
import { selectITSystemUsageEnableAndRecommendedGdprDpiaConducted } from 'src/app/store/organization/ui-module-customization/selectors';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { APIDpiaConductedChoice } from 'src/app/api/v2';
import { BaseAccordionComponent } from 'src/app/shared/base/base-accordion.component';
import { SimpleLink } from 'src/app/shared/models/SimpleLink.model';
import { DpiaConductedOption, mapToDpiaConductedEnum, dpiaConductedOptions } from 'src/app/shared/models/dpia-conducted.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import {
  selectITSystemUsageHasModifyPermission,
  selectItSystemUsageGdpr,
} from 'src/app/store/it-system-usage/selectors';
import { GdprBaseDateUrlSectionComponent } from '../gdpr-base-date-url-section/gdpr-base-date-url-section.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-gdpr-dpia-conducted-section',
  templateUrl: './gdpr-dpia-conducted-section.component.html',
  styleUrls: ['./gdpr-dpia-conducted-section.component.scss'],
  imports: [GdprBaseDateUrlSectionComponent, FormsModule, ReactiveFormsModule, AsyncPipe],
})
export class GdprDpiaConductedSectionComponent extends BaseAccordionComponent implements OnInit {
  @Output() public noPermissions = new EventEmitter<AbstractControl[]>();

  private readonly currentGdpr$ = this.store.select(selectItSystemUsageGdpr).pipe(filterNullish());
  public readonly dpiaConductedRecommended$ = this.store.select(selectITSystemUsageEnableAndRecommendedGdprDpiaConducted).pipe(mapUIConfigStatusToRecommended());
  public readonly isDpiaConductedFalse$ = this.currentGdpr$.pipe(
    map((gdpr) => gdpr.dpiaConducted !== APIDpiaConductedChoice.Yes),
  );
  public readonly hasModifyPermissions$ = this.store.select(selectITSystemUsageHasModifyPermission);

  public readonly selectDpiaDocumentation$ = this.currentGdpr$.pipe(
    map((gdpr) =>
      gdpr.dpiaDocumentation
        ? ({ url: gdpr.dpiaDocumentation.url, name: gdpr.dpiaDocumentation.name } as SimpleLink)
        : undefined,
    ),
  );
  public readonly dpiaConductedOptions = dpiaConductedOptions;
  public disableLinkControl = false;

  public readonly formGroup = new FormGroup(
    {
      yesNoDontKnowControl: new FormControl<DpiaConductedOption | undefined>(undefined),
      dateControl: new FormControl<Date | undefined>(undefined),
    },
    { updateOn: 'blur' },
  );

  constructor(private readonly store: Store) {
    super();
  }

  ngOnInit(): void {
    this.currentGdpr$.subscribe((gdpr) => {
      this.formGroup.patchValue({
        yesNoDontKnowControl: mapToDpiaConductedEnum(gdpr.dpiaConducted),
        dateControl: gdpr.dpiaDate ? new Date(gdpr.dpiaDate) : undefined,
      });
    });

    this.noPermissions.emit([this.formGroup]);
    this.subscriptions.add(
      this.store
        .select(selectITSystemUsageHasModifyPermission)
        .pipe(filter((hasModifyPermission) => hasModifyPermission === false))
        .subscribe(() => {
          this.disableLinkControl = true;
        }),
    );
  }
}
