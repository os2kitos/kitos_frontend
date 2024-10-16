import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fk-org-write-dialog',
  templateUrl: './fk-org-write-dialog.component.html',
  styleUrl: './fk-org-write-dialog.component.scss',
})
export class FkOrgWriteDialogComponent implements OnInit {
  @Input() isEdit: boolean = false;

  public title = '';
  ngOnInit(): void {
    this.title = this.isEdit ? 'Redigér forbindelsen til FK Organisation' : 'Opret forbindelse til FK Organisation';
  }
}
