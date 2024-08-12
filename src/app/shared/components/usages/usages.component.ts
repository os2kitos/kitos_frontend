import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-usages',
  templateUrl: './usages.component.html',
  styleUrls: ['./usages.component.scss'],
})
export class UsagesComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { usages: string[]; title: string }) {}
}
