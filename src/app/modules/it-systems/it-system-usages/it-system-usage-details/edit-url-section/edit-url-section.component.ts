import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { hasOpenDialogOf } from 'src/app/shared/helpers/dialog.helpers';
import { validateHttpUrl } from 'src/app/shared/helpers/link.helpers';
import { SimpleLink } from 'src/app/shared/models/SimpleLink.model';
import { LinkTextboxComponent } from '../../../../../shared/components/link-textbox/link-textbox.component';
import { EditSimpleLinkDialogComponent } from '../edit-url-dialog/edit-url-dialog.component';

@Component({
  selector: 'app-edit-url-section',
  templateUrl: './edit-url-section.component.html',
  styleUrls: ['./edit-url-section.component.scss'],
  imports: [LinkTextboxComponent, AsyncPipe],
})
export class EditUrlSectionComponent extends BaseComponent {
  @Input() title!: string;
  @Input() simpleLink$!: Observable<SimpleLink | undefined>;
  @Input() isDisabled = false;
  @Input() namePermission$?: Observable<boolean>;
  @Input() nameDisabledMessage?: string;
  @Input() linkPermission$?: Observable<boolean>;
  @Input() linkDisabledMessage?: string;
  @Output() submitMethod = new EventEmitter();

  public doesSimpleLinkExist$ = this.simpleLink$?.pipe(map((simpleLink) => simpleLink !== undefined));

  constructor(private readonly dialog: MatDialog) {
    super();
  }

  public openDirectoryUrlDialog(simpleLink?: SimpleLink | undefined) {
    if (hasOpenDialogOf(this.dialog, EditSimpleLinkDialogComponent)) return;

    const dialog = this.dialog.open(EditSimpleLinkDialogComponent);
    const dialogInstance = dialog.componentInstance;

    dialogInstance.simpleLink = simpleLink;
    dialogInstance.namePermission$ = this.namePermission$;
    dialogInstance.nameDisabledMessage = this.nameDisabledMessage;
    dialogInstance.linkPermission$ = this.linkPermission$;
    dialogInstance.linkDisabledMessage = this.linkDisabledMessage;
    dialogInstance.submitMethod = this.submitMethod;
  }

  public clearSimpleLink() {
    this.submitMethod.emit(null);
  }

  validateSimpleLinkUrl(url: string | undefined) {
    return validateHttpUrl(url);
  }
}
