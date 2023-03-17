import { Component, Input, OnInit } from '@angular/core';
import { validateUrl } from '../../helpers/link.helpers';

@Component({
  selector: 'app-external-page-link',
  templateUrl: './external-page-link.component.html',
  styleUrls: ['./external-page-link.component.scss']
})
export class ExternalPageLinkComponent implements OnInit {
  @Input() public url: string | undefined = '';
  @Input() public title = '';

  public isValidLink = false;

  ngOnInit() {
    this.isValidLink = validateUrl(this.url);
  }
}
