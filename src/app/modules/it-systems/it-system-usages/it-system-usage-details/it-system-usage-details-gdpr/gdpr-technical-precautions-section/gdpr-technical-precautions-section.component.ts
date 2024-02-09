import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { APIGDPRRegistrationsResponseDTO, APIGDPRWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import {
  TechnicalPrecautions,
  mapTechnicalPecautions,
  technicalPrecautionsOptions,
} from 'src/app/shared/models/it-system-usage/gdpr/technical-precautions.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import {
  YesNoDontKnowOptions,
  mapToYesNoDontKnowEnum,
  yesNoDontKnowOptions,
} from 'src/app/shared/models/yes-no-dont-know.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
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
  public readonly technicalPrecautionsOptions = technicalPrecautionsOptions;

  public readonly mainFormGroup = new FormGroup(
    {
      yesNoDontKnowControl: new FormControl<YesNoDontKnowOptions | undefined>(undefined),
    },
    { updateOn: 'blur' }
  );

  public readonly technicalPrecautionsForm = new FormGroup({}, { updateOn: 'change' });

  constructor(private readonly store: Store, private readonly notificationService: NotificationService) {
    super();
  }

  ngOnInit(): void {
    this.technicalPrecautionsOptions.forEach((option) => {
      this.technicalPrecautionsForm.addControl(option.value, new FormControl<boolean>(false));
    });
    this.currentGdpr$.subscribe((gdpr) => {
      this.mainFormGroup.patchValue({
        yesNoDontKnowControl: mapToYesNoDontKnowEnum(gdpr.technicalPrecautionsInPlace),
      });
      const currentTechnicalPrecautions: (TechnicalPrecautions | undefined)[] = [];
      gdpr.technicalPrecautionsApplied.forEach((precaution) =>
        currentTechnicalPrecautions.push(mapTechnicalPecautions(precaution))
      );
      this.technicalPrecautionsForm.patchValue({
        Encryption: currentTechnicalPrecautions.includes(technicalPrecautionsOptions[0]),
        Pseudonymization: currentTechnicalPrecautions.includes(technicalPrecautionsOptions[1]),
        AccessControl: currentTechnicalPrecautions.includes(technicalPrecautionsOptions[2]),
        Logging: currentTechnicalPrecautions.includes(technicalPrecautionsOptions[3]),
      });
    });
    this.isTechnicalPrecautionsFalse$.subscribe((value) => this.toggleFormState(this.technicalPrecautionsForm, !value));
  }

  public patchGdpr(gdpr: APIGDPRWriteRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (!this.mainFormGroup.valid) return;
    if (valueChange && !valueChange.valid) return;

    this.store.dispatch(ITSystemUsageActions.patchITSystemUsage({ gdpr }));
  }

  public patchTechnicalPrecautionsApplied(valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showInvalidFormField(valueChange.text);
    } else {
      const newTechnicalPrecautionsApplied: APIGDPRWriteRequestDTO.TechnicalPrecautionsAppliedEnum[] = [];
      for (const controlKey in this.technicalPrecautionsForm.controls) {
        const control = this.technicalPrecautionsForm.get(controlKey);
        if (control?.value) {
          newTechnicalPrecautionsApplied.push(controlKey as APIGDPRWriteRequestDTO.TechnicalPrecautionsAppliedEnum);
        }
      }
      this.store.dispatch(
        ITSystemUsageActions.patchITSystemUsage({
          gdpr: { technicalPrecautionsApplied: newTechnicalPrecautionsApplied },
        })
      );
    }
  }

  private toggleFormState(form: FormGroup, value: boolean | null) {
    if (value) {
      form.enable();
    } else {
      form.disable();
    }
  }
}
