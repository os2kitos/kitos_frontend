import { Component, Input } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { IRoleAssignment } from 'src/app/shared/models/helpers/read-model-role-assignments';

@Component({
  selector: 'app-regular-role-row',
  templateUrl: './regular-role-row.component.html',
  styleUrl: './regular-role-row.component.scss'
})
export class RegularRoleRowComponent {
  @Input() roles!: IRoleAssignment[];
  @Input() rolesDictionary!: Dictionary<APIRoleOptionResponseDTO | undefined>;
  @Input() hasModifyPermission!: boolean;
  @Input() entityName!: string;
}
