import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { APIIdentityNamePairResponseDTO, APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from '../../base/base.component';
import { filterNullish } from '../../pipes/filter-nullish';

export class FoodNode {
  children?: FoodNode[];
  item = '';
}

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
        this.mappedUnits = [];
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
    indetation = 0
  ): Array<APIIdentityNamePairResponseDTO> {
    const newUnit = {
      uuid: currentUnit.uuid,
      name: String.fromCharCode(160).repeat(5).repeat(indetation) + currentUnit.name,
    };
    const result = [newUnit];

    let childrenResults = [] as Array<APIIdentityNamePairResponseDTO>;
    units
      .filter((x) => x.parentOrganizationUnit?.uuid === currentUnit.uuid)
      .forEach((newUnit) => {
        childrenResults = childrenResults.concat(this.mapHierarchy(newUnit, units, indetation + 1));
      });

    return result.concat(childrenResults);
  }

  public testData: FoodNode[] = [
    {
      item: 'Fruit',
      children: [
        { item: 'Apple' },
        { item: 'Banana' },
        {
          item: 'Fruit loops',
          children: [{ item: 'Cherry' }, { item: 'Grapes', children: [{ item: 'Oranges' }] }],
        },
      ],
    },
    {
      item: 'Vegetables',
      children: [
        {
          item: 'Green',
          children: [{ item: 'Broccoli' }, { item: 'Brussels sprouts' }],
        },
        {
          item: 'Orange',
          children: [{ item: 'Pumpkins' }, { item: 'Carrots' }],
        },
      ],
    },
  ];
}
