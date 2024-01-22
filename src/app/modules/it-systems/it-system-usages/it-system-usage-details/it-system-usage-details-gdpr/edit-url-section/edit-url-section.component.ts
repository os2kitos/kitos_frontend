import { Component, Input, OnInit } from '@angular/core';
import { EditUrlDialogComponent } from '../edit-url-dialog/edit-url-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { selectItSystemUsageGdpr } from 'src/app/store/it-system-usage/selectors';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';

interface DirectoryDocumentation {
  name?: string,
  url?: string
}

@Component({
  selector: 'app-edit-url-section',
  templateUrl: './edit-url-section.component.html',
  styleUrls: ['./edit-url-section.component.scss']
})
export class EditUrlSectionComponent extends BaseComponent implements OnInit {
  @Input() urlDescription?: string = undefined;

  public directoryDocumentation: DirectoryDocumentation = {name: undefined, url: undefined};

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ){
    super();
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.store
      .select(selectItSystemUsageGdpr)
      .pipe(filterNullish())
      .subscribe((gdpr) => {
        this.directoryDocumentation = {name: gdpr.directoryDocumentation?.name, url: gdpr.directoryDocumentation?.url}
      })
    )
  }

  public openDirectoryUrlDialog(){
    this.dialog.open(EditUrlDialogComponent)
  }
}
