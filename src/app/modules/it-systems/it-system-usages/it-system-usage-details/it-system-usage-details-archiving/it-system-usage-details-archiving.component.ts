import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { RadioButtonOption } from 'src/app/shared/components/radio-button/radio-button.component';

@Component({
  selector: 'app-it-system-usage-details-archiving',
  templateUrl: './it-system-usage-details-archiving.component.html',
  styleUrls: ['./it-system-usage-details-archiving.component.scss'],
})
export class ItSystemUsageDetailsArchivingComponent extends BaseComponent {
  public readonly testForm = new FormGroup(
    {
      archivingActive: new FormControl<string | undefined>('2'),
    },
    { updateOn: 'blur' }
  );

  public readonly options: Array<RadioButtonOption> = [
    {
      label: 'Ja',
      uuid: '1',
    },
    {
      label: 'Nej',
      uuid: '2',
    },
  ];

  public changeArchivingActive(value?: string) {
    console.log(value);
  }
}
