import { Component, Input, OnInit } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { DIALOG_DEFAULT_WIDTH } from '../../constants';

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  @Input() public title?: string;
  @Input() public closable = true;

  constructor(private dialog: DialogRef) {}

  ngOnInit() {
    this.dialog.dialog.instance.maxWidth = DIALOG_DEFAULT_WIDTH;
  }

  public close() {
    this.dialog.close();
  }
}
