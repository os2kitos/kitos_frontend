import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { APIShallowOrganizationResponseDTO } from 'src/app/api/v2';

@Component({
  selector: 'app-usages',
  standalone: true,
  templateUrl: './usages.component.html',
  styleUrls: ['./usages.component.scss'],
  imports: [CommonModule]
})
export class UsagesComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: APIShallowOrganizationResponseDTO[]) {
    console.log("From comp");
    console.log(data);
  }
}
