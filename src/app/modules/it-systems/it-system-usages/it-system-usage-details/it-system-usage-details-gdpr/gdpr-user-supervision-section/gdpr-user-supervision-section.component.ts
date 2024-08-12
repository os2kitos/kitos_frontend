import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { APIGDPRRegistrationsResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { YesNoDontKnowEnum, YesNoDontKnowOptions, mapToYesNoDontKnowEnum } from 'src/app/shared/models/yes-no-dont-know.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectITSystemUsageHasModifyPermission, selectItSystemUsageGdpr } from 'src/app/store/it-system-usage/selectors';

@Component({
  selector: 'app-gdpr-user-supervision-section',
  templateUrl: './gdpr-user-supervision-section.component.html',
  styleUrls: ['./gdpr-user-supervision-section.component.scss'],
})
export class GdprUserSupervisionSectionComponent extends BaseComponent implements OnInit {
  @Output() public noPermissions = new EventEmitter<AbstractControl[]>();

  private readonly currentGdpr$ = this.store.select(selectItSystemUsageGdpr).pipe(filterNullish());
  public readonly hasModifyPermissions$ = this.store.select(selectITSystemUsageHasModifyPermission);
  public readonly isUserSupervisionFalse$ = this.currentGdpr$.pipe(
    map((gdpr) => gdpr.userSupervision !== APIGDPRRegistrationsResponseDTO.UserSupervisionEnum.Yes)
  );
  public readonly selectUserDocumentation$ = this.currentGdpr$.pipe(map((gdpr) => gdpr.userSupervisionDocumentation));
  public disableLinkControl = false;
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
    this.formGroup.get('yesNoDontKnowControl')?.valueChanges.subscribe((value) => {
      this.disableLinkControl = (!value) || value.value === YesNoDontKnowEnum.No || value.value === YesNoDontKnowEnum.DontKnow;
    });

    this.currentGdpr$.subscribe((gdpr) => {
      this.formGroup.patchValue({
        yesNoDontKnowControl: mapToYesNoDontKnowEnum(gdpr.userSupervision),
        dateControl: gdpr.userSupervisionDate ? new Date(gdpr.userSupervisionDate) : undefined,
      });
    });

    this.noPermissions.emit([this.formGroup]);
    this.subscriptions.add(
      this.store
        .select(selectITSystemUsageHasModifyPermission)
        .pipe(filter((hasModifyPermission) => hasModifyPermission === false))
        .subscribe(() => {
          this.disableLinkControl = true;
        })
    );
  }
}
