import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';
import { NgIf, NgFor } from '@angular/common';
import { WhiteCircleNumberIconComponent } from '../../../../icons/white-circle-with-number-icon.component';
import { RedCircleNumberIconComponent } from '../../../../icons/red-circle-with-number-icon.component';
import { OrangeCircleNumberIconComponent } from '../../../../icons/orange-circle-with-number-icon.component';
import { GreenCircleNumberIconComponent } from '../../../../icons/green-circle-with-number-icon.component';

@Component({
  selector: 'app-audit-cell',
  templateUrl: './audit-cell.component.html',
  styleUrl: './audit-cell.component.scss',
  imports: [
    NgIf,
    NgFor,
    WhiteCircleNumberIconComponent,
    RedCircleNumberIconComponent,
    OrangeCircleNumberIconComponent,
    GreenCircleNumberIconComponent,
  ],
})
export class AuditCellComponent extends BaseCellComponent {}
