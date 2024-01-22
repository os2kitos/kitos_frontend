import { Component } from '@angular/core';
import { EditUrlDialogComponent } from '../edit-url-dialog/edit-url-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-url-section',
  templateUrl: './edit-url-section.component.html',
  styleUrls: ['./edit-url-section.component.scss']
})
export class EditUrlSectionComponent {

  constructor(
    private readonly dialog: MatDialog
  ){}

  public openDirectoryUrlDialog(){
    this.dialog.open(EditUrlDialogComponent)
  }
}
