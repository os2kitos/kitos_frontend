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
  @Input() public icon?: 'help';
  @Input() public loading = false;
  @Input() public closable = true;
  @Input() public overflow: 'auto' | 'none' = 'auto';

  constructor(private dialog: DialogRef) {}

  ngOnInit() {
    this.dialog.dialog.instance.width = DIALOG_DEFAULT_WIDTH;
  }

  public close() {
    this.dialog.close();
  }
}
