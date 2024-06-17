import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { APIGDPRRegistrationsResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { YesNoDontKnowOptions, mapToYesNoDontKnowEnum } from 'src/app/shared/models/yes-no-dont-know.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectITSystemUsageHasModifyPermission, selectItSystemUsageGdpr } from 'src/app/store/it-system-usage/selectors';

@Component({
  selector: 'app-gdpr-dpia-conducted-section',
  templateUrl: './gdpr-dpia-conducted-section.component.html',
  styleUrls: ['./gdpr-dpia-conducted-section.component.scss'],
})
export class GdprDpiaConductedSectionComponent extends BaseComponent implements OnInit {
  @Output() public noPermissions = new EventEmitter<AbstractControl[]>();

  private readonly currentGdpr$ = this.store.select(selectItSystemUsageGdpr).pipe(filterNullish());
  public readonly isDpiaConductedFalse$ = this.currentGdpr$.pipe(
    map((gdpr) => gdpr.dpiaConducted !== APIGDPRRegistrationsResponseDTO.DpiaConductedEnum.Yes)
  );

  public readonly selectDpiaDocumentation$ = this.currentGdpr$.pipe(map((gdpr) => gdpr.dpiaDocumentation));
  public disableLinkControl = false;
  public disableDatepickerControl = false;
  
  public readonly formGroup = new FormGroup(
    {
      yesNoDontKnowControl: new FormControl<YesNoDontKnowOptions | undefined>(undefined),
      dateControl: new FormControl<Date | undefined>(undefined),
    },
    { updateOn: 'blur' }
  );

  constructor(private readonly store: Store) {
    super();
  }

  ngOnInit(): void {
    this.currentGdpr$.subscribe((gdpr) => {
      this.formGroup.patchValue({
        yesNoDontKnowControl: mapToYesNoDontKnowEnum(gdpr.dpiaConducted),
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
          this.disableDatepickerControl = true;
        })
    );
  }
}
