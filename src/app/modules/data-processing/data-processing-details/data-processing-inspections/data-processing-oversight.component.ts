import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { yesNoOptions } from 'src/app/shared/models/yes-no.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { selectDataProcessingHasModifyPermissions, selectDataProcessingOversightOptions } from 'src/app/store/data-processing/selectors';

@Component({
  selector: 'app-data-processing-oversight',
  templateUrl: './data-processing-oversight.component.html',
  styleUrl: './data-processing-oversight.component.scss'
})
export class DataProcessingOversightComponent extends BaseComponent {

  public readonly oversightOptions$ = this.store
    .select(selectDataProcessingOversightOptions)
    .pipe(filterNullish());

  public readonly anyOversightOptions$ = this.oversightOptions$.pipe(matchNonEmptyArray());
  public readonly hasModifyPermission$ = this.store.select(selectDataProcessingHasModifyPermissions);
  public readonly yesNoOptions = yesNoOptions.map((option) => ({ id: option.value, label: option.name }));

  public readonly dataProcessingOversightForm = new FormGroup(
    {
      oversightOptions: new FormControl({ value: '', disabled: false }),
      oversightRemarks: new FormControl({ value: '', disabled: false }),
      oversightInterval: new FormControl({ value: '', disabled: false }),
      oversightIntervalRemarks: new FormControl({ value: '', disabled: false }),
      oversightCompleted: new FormControl({ value: '', disabled: false }),
    },
    { updateOn: 'blur' }
  );

  constructor(private store: Store, private notificationService: NotificationService) {
    super();
  }
}
