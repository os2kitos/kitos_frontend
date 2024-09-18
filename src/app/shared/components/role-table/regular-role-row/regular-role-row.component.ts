import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { IRoleAssignment } from 'src/app/shared/models/helpers/read-model-role-assignments';

@Component({
  selector: '[role-row]',
  templateUrl: './regular-role-row.component.html',
  styleUrl: './regular-role-row.component.scss'
})
export class RegularRoleRowComponent {
  @Input() role!: IRoleAssignment;
  @Input() rolesDictionary!: Dictionary<APIRoleOptionResponseDTO | undefined>;
  @Input() hasModifyPermission!: boolean;
  @Input() entityName!: string;

  @Output() onRemoveRole = new EventEmitter<IRoleAssignment>();

  public onRemoveClick(): void {
    this.onRemoveRole.emit(this.role);
  }
}
