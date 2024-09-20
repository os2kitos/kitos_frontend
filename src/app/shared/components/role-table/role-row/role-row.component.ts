import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { IRoleAssignment } from 'src/app/shared/models/helpers/read-model-role-assignments';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[role-row]',
  templateUrl: './role-row.component.html',
  styleUrl: './role-row.component.scss',
})
export class RoleRowComponent {
  @Input() role!: IRoleAssignment;
  @Input() rolesDictionary!: Dictionary<APIRoleOptionResponseDTO | undefined>;
  @Input() hasModifyPermission!: boolean;
  @Input() entityName!: string;

  @Output() removeRole = new EventEmitter<IRoleAssignment>();

  public onRemoveClick(): void {
    this.removeRole.emit(this.role);
  }
}
