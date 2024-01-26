import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { APIGDPRRegistrationsResponseDTO, APIGDPRWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { technicalPrecautionsOptions } from 'src/app/shared/models/it-system-usage/gdpr/technical-precautions.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import {
  YesNoDontKnowOptions,
  mapToYesNoDontKnowEnum,
  yesNoDontKnowOptions,
} from 'src/app/shared/models/yes-no-dont-know.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageGdpr } from 'src/app/store/it-system-usage/selectors';

@Component({
  selector: 'app-gdpr-technical-precautions-section',
  templateUrl: './gdpr-technical-precautions-section.component.html',
  styleUrls: ['./gdpr-technical-precautions-section.component.scss'],
})
export class GdprTechnicalPrecautionsSectionComponent extends BaseComponent implements OnInit {
  private readonly currentGdpr$ = this.store.select(selectItSystemUsageGdpr).pipe(filterNullish());
  public readonly isTechnicalPrecautionsFalse$ = this.currentGdpr$.pipe(
    map(
      (gdpr) => gdpr.technicalPrecautionsInPlace !== APIGDPRRegistrationsResponseDTO.TechnicalPrecautionsInPlaceEnum.Yes
    )
  );
  public readonly selectTechnicalDocumentation$ = this.currentGdpr$.pipe(
    map((gdpr) => gdpr.technicalPrecautionsDocumentation)
  );

  public readonly yesNoDontKnowOptions = yesNoDontKnowOptions;
  //TODO: add the enum checkboxes
  public readonly technicalPrecautionsResultOptions = technicalPrecautionsOptions;

  public readonly formGroup = new FormGroup(
    {
      yesNoDontKnowControl: new FormControl<YesNoDontKnowOptions | undefined>(undefined),
    },
    { updateOn: 'blur' }
  );

  constructor(private readonly store: Store) {
    super();
  }

  ngOnInit(): void {
    this.currentGdpr$.subscribe((gdpr) => {
      this.formGroup.patchValue({
        yesNoDontKnowControl: mapToYesNoDontKnowEnum(gdpr.technicalPrecautionsInPlace),
      });
    });
  }

  public patchGdpr(gdpr: APIGDPRWriteRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (!this.formGroup.valid) return;
    if (valueChange && !valueChange.valid) return;

    this.store.dispatch(ITSystemUsageActions.patchItSystemUsage({ gdpr }));
  }
}
