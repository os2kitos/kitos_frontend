import { Component, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { SimpleLink } from 'src/app/shared/models/SimpleLink.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { EditUrlDialogComponent } from '../edit-url-dialog/edit-url-dialog.component';

@Component({
  selector: 'app-edit-url-section',
  templateUrl: './edit-url-section.component.html',
  styleUrls: ['./edit-url-section.component.scss'],
})
export class EditUrlSectionComponent extends BaseComponent {
  @Input() urlDescription?: string = undefined;
  @Input() simpleLink$!: Observable<SimpleLink | undefined>;
  @Output() submitMethod!: (
    requestBody: { url: string; name: string },
    valueChange?: ValidatedValueChange<unknown>
  ) => void;

  constructor(private readonly dialog: MatDialog) {
    super();
  }

  public openDirectoryUrlDialog(simpleLink?: SimpleLink | undefined) {
    const dialog = this.dialog.open(EditUrlDialogComponent);
    const dialogInstance = dialog.componentInstance;

    dialogInstance.simpleLink = simpleLink;
    dialogInstance.submitMethod = this.submitMethod;
  }
}
