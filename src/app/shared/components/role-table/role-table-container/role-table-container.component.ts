import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { IRoleAssignment } from 'src/app/shared/models/helpers/read-model-role-assignments';

@Component({
  selector: 'app-role-table-container',
  templateUrl: './role-table-container.component.html',
  styleUrl: './role-table-container.component.scss'
})
export class RoleTableContainerComponent {

  @Input() isLoading$!: Observable<boolean>;
  @Input() anyRoles$!: Observable<boolean>;
  @Input() hasModifyPermission!: boolean;

  @Output() addNew = new EventEmitter<void>();

  public onAddNew() {
    this.addNew.emit();
  }
}
