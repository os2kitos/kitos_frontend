import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { validateUrl } from 'src/app/shared/helpers/link.helpers';
import { SimpleLink } from 'src/app/shared/models/SimpleLink.model';
import { EditUrlDialogComponent } from '../edit-url-dialog/edit-url-dialog.component';

@Component({
  selector: 'app-edit-url-input',
  templateUrl: './edit-url-input.component.html',
  styleUrls: ['./edit-url-input.component.scss'],
})
export class EditUrlInputComponent extends BaseComponent {
  @Input() title?: string = undefined;
  @Input() simpleLink$!: Observable<SimpleLink | undefined>;
  @Input() isDisabled = false;
  @Output() submitMethod = new EventEmitter();

  public doesSimpleLinkExist$ = this.simpleLink$?.pipe(map((simpleLink) => simpleLink !== undefined));

  constructor(private readonly dialog: MatDialog) {
    super();
  }

  public openDirectoryUrlDialog(simpleLink?: SimpleLink | undefined) {
    const dialog = this.dialog.open(EditUrlDialogComponent);
    const dialogInstance = dialog.componentInstance;

    dialogInstance.simpleLink = simpleLink;
    dialogInstance.submitMethod = this.submitMethod;
  }

  validateSimpleLinkUrl(url: string | undefined) {
    return validateUrl(url);
  }
}
