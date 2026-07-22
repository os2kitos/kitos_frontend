import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { Observable } from 'rxjs';
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
import { TooltipComponent } from '../../tooltip/tooltip.component';

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
    TableRowActionsComponent,
    IconButtonComponent,
    TrashcanIconComponent,
    PencilIconComponent,
    AsyncPipe,
    TooltipComponent
],
})
export class RoleRowComponent {
  @Input() role!: RoleAssignment;
  @Input() hasModifyPermission!: boolean;
  @Input() availableRoles$!: Observable<Dictionary<APIRoleOptionResponseDTO> | undefined>;

  @Output() removeRole = new EventEmitter<RoleAssignment>();
  @Output() editRole = new EventEmitter<RoleAssignment>();

  public defaultExternallyUsedTooltip = $localize`Denne rolle anvendes af en ekstern leverandør`;

  public onRemoveClick(): void {
    this.removeRole.emit(this.role);
  }

  public onEditClick(): void {
    this.editRole.emit(this.role);
  }

  public showExternallyUsedTooltip(rolesDictionary: Dictionary<APIRoleOptionResponseDTO>): boolean {
    return rolesDictionary[this.role.assignment.role.uuid]?.isExternallyAvailable || false;
  }

  public getExternallyUsedDescription(possibleDescription: string | undefined): string {
    return possibleDescription ? possibleDescription : this.defaultExternallyUsedTooltip;
  }
}
