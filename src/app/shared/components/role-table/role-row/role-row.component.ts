import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { RoleAssignment } from 'src/app/shared/models/helpers/read-model-role-assignments';
import { BooleanCircleComponent } from '../../boolean-circle/boolean-circle.component';
import { IconButtonComponent } from '../../buttons/icon-button/icon-button.component';
import { ContentSpaceBetweenComponent } from '../../content-space-between/content-space-between.component';
import { ContentWithTooltipComponent } from '../../content-with-tooltip/content-with-tooltip.component';
import { PencilIconComponent } from '../../icons/pencil-icon.compnent';
import { TrashcanIconComponent } from '../../icons/trashcan-icon.component';
import { ParagraphComponent } from '../../paragraph/paragraph.component';
import { SelectedOptionTypeTextComponent } from '../../selected-option-type-text/selected-option-type-text.component';
import { TableRowActionsComponent } from '../../table-row-actions/table-row-actions.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[role-row]',
  templateUrl: './role-row.component.html',
  styleUrl: './role-row.component.scss',
  imports: [
    ParagraphComponent,
    ContentWithTooltipComponent,
    SelectedOptionTypeTextComponent,
    BooleanCircleComponent,
    ContentSpaceBetweenComponent,
    NgIf,
    TableRowActionsComponent,
    IconButtonComponent,
    TrashcanIconComponent,
    PencilIconComponent,
  ],
})
export class RoleRowComponent {
  @Input() role!: RoleAssignment;
  @Input() rolesDictionary!: Dictionary<APIRoleOptionResponseDTO | undefined>;
  @Input() hasModifyPermission!: boolean;

  @Output() removeRole = new EventEmitter<RoleAssignment>();
  @Output() editRole = new EventEmitter<RoleAssignment>();

  public onRemoveClick(): void {
    this.removeRole.emit(this.role);
  }

  public onEditClick(): void {
    this.editRole.emit(this.role);
  }
}
