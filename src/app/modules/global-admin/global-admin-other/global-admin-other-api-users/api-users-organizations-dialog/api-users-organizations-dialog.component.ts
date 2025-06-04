import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ScrollbarDialogComponent } from 'src/app/shared/components/dialogs/dialog/scrollbar-dialog/scrollbar-dialog.component';
import { NativeTableComponent } from '../../../../../shared/components/native-table/native-table.component';
import { ParagraphComponent } from '../../../../../shared/components/paragraph/paragraph.component';

@Component({
  selector: 'app-api-users-organizations-dialog',
  templateUrl: './api-users-organizations-dialog.component.html',
  styleUrl: './api-users-organizations-dialog.component.scss',
  imports: [NgIf, NativeTableComponent, NgFor, ParagraphComponent, ScrollbarDialogComponent],
})
export class ApiUsersOrganizationsDialogComponent {
  @Input() public organizationNames: string[] = [];
}
