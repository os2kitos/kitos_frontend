import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { APIGDPRRegistrationsResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { YesNoDontKnowOptions, mapToYesNoDontKnowEnum } from 'src/app/shared/models/yes-no-dont-know.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItSystemUsageGdpr } from 'src/app/store/it-system-usage/selectors';

@Component({
  selector: 'app-gdpr-dpia-conducted-section',
  templateUrl: './gdpr-dpia-conducted-section.component.html',
  styleUrls: ['./gdpr-dpia-conducted-section.component.scss'],
})
export class GdprDpiaConductedSectionComponent extends BaseComponent implements OnInit {
  private readonly currentGdpr$ = this.store.select(selectItSystemUsageGdpr).pipe(filterNullish());
  public readonly isDpiaConductedFalse$ = this.currentGdpr$.pipe(
    map((gdpr) => gdpr.dpiaConducted !== APIGDPRRegistrationsResponseDTO.DpiaConductedEnum.Yes)
  );

  public readonly selectDpiaDocumentation$ = this.currentGdpr$.pipe(map((gdpr) => gdpr.dpiaDocumentation));

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
  }
}
