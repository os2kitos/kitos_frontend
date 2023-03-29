import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '../../base/base.component';

export interface TreeNodeModel {
  id: string;
  text: string;
  disabled: boolean;
  children?: TreeNodeModel[];
}

@Component({
  selector: 'app-tree-node-select',
  templateUrl: './tree-node-select.component.html',
  styleUrls: ['./tree-node-select.component.scss'],
})
export class TreeNodeSelectComponent extends BaseComponent implements OnInit {
  @Input() public nodes!: TreeNodeModel[];
  @Input() public textField = 'name';
  @Input() public valueField = 'value';
  @Input() public showDescription = false;

  @Input() public formGroup!: FormGroup;
  @Input() public formName: string | null = null;

  @Output() public filterChange = new EventEmitter<string | undefined>();

  public ngOnInit(): void {
    console.log();
  }
}
