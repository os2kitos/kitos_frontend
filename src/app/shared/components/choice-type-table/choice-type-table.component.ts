import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RegularOptionType } from '../../models/options/regular-option-types.model';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';

@Component({
  selector: 'app-choice-type-table',
  templateUrl: './choice-type-table.component.html',
  styleUrl: './choice-type-table.component.scss',
})
export class ChoiceTypeTableComponent {
  @Input() type!: RegularOptionType | RoleOptionTypes;
  @Input() expandedByDefault: boolean = false;
  @Input() title: string = '';
  @Input() disableAccordion: boolean = false;
  @Input() roles: ChoiceTypeTableItem[] = [
    {
      active: true,
      name: 'En rolle',
      writeAccess: false,
      description: 'Dette er en rolle',
      id: 0,
      uuid: 'uuid1',
      obligatory: true,
    },
    {
      active: false,
      name: 'En anden rolle',
      writeAccess: true,
      description: 'Dette er en anden rolle',
      id: 1,
      uuid: 'uuid2',
      obligatory: true,
    },
    {
      active: true,
      name: 'Et meget meget meget meget meget meget meget langt navn',
      writeAccess: true,
      description: 'Dette er en meget meget meget meget meget meget meget lang beskrivelse',
      id: 2,
      uuid: 'uuid3',
      obligatory: true,
    },
  ];

  @Input() showWriteAccess: boolean = true;
  @Input() showDescription: boolean = true;
  @Input() showEditButton: boolean = true;

  @Output() editClicked = new EventEmitter<ChoiceTypeTableItem>();

  public onEdit(role: ChoiceTypeTableItem): void {
    this.editClicked.emit(role);
  }
}

export interface ChoiceTypeTableItem {
  id: number;
  uuid: string;
  active: boolean;
  name: string;
  writeAccess: boolean;
  description: string;
  obligatory: boolean;
}
