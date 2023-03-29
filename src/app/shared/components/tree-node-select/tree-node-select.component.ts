import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { BaseComponent } from '../../base/base.component';

export interface TreeNodeModel {
  id: string;
  name: string;
  disabled: boolean;
  parentUuid?: string;
}

@Component({
  selector: 'app-tree-node-select',
  templateUrl: './tree-node-select.component.html',
  styleUrls: ['./tree-node-select.component.scss'],
})
export class TreeNodeSelectComponent extends BaseComponent implements OnInit {
  @Input() public nodes$!: Observable<TreeNodeModel[]>;
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
