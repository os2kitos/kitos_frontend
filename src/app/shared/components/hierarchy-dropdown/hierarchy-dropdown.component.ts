import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { APIIdentityNamePairResponseDTO, APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from '../../base/base.component';
import { filterNullish } from '../../pipes/filter-nullish';

@Component({
  selector: 'app-hierarchy-dropdown',
  templateUrl: './hierarchy-dropdown.component.html',
  styleUrls: ['./hierarchy-dropdown.component.scss'],
})
export class HierarchyDropdownComponent extends BaseComponent implements OnInit {
  @Input() public organizationUnits$!: Observable<APIOrganizationUnitResponseDTO[]>;
  @Input() public textField = 'name';
  @Input() public valueField = 'value';
  @Input() public showDescription = false;

  @Input() public formGroup!: FormGroup;
  @Input() public formName: string | null = null;

  @Output() public filterChange = new EventEmitter<string | undefined>();

  public mappedUnits: Array<APIIdentityNamePairResponseDTO> = [];

  constructor() {
    super();
  }

  public ngOnInit() {
    this.subscriptions.add(
      this.organizationUnits$.pipe(filterNullish()).subscribe((organizationUnits) => {
        const rootUnits = organizationUnits.filter((unit) => !unit.parentOrganizationUnit);

        rootUnits.forEach(
          (root) => (this.mappedUnits = this.mappedUnits.concat(this.mapHierarchy(root, organizationUnits)))
        );
      })
    );
  }

  private mapHierarchy(
    currentUnit: APIOrganizationUnitResponseDTO,
    units: Array<APIOrganizationUnitResponseDTO>,
    indetation: number = 0
  ): Array<APIIdentityNamePairResponseDTO> {
    const newUnit = {
      uuid: currentUnit.uuid,
      name: String.fromCharCode(160).repeat(10).repeat(indetation) + currentUnit.name,
    };
    var result = [newUnit];

    var childrenResult = [] as Array<APIIdentityNamePairResponseDTO>;
    units
      .filter((x) => x.parentOrganizationUnit?.uuid === currentUnit.uuid)
      .forEach((newUnit) => {
        childrenResult = childrenResult.concat(this.mapHierarchy(newUnit, units, indetation + 1));
      });

    return result.concat(childrenResult);
  }
}
