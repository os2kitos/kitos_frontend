import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { filter } from 'rxjs';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';

@Component({
  selector: 'app-usage-proxy-checkbox',
  templateUrl: './usage-proxy-checkbox.component.html',
  styleUrls: ['./usage-proxy-checkbox.component.scss'],
})
export class UsageProxyCheckboxComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('switch') switch: any;
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() entityUuid!: string;

  @Output() attemptChange = new EventEmitter<boolean>();

  constructor(private actions$: Actions, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.actions$
      .pipe(
        ofType(ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganizationSuccess),
        filter(({ itSystemUuid }) => itSystemUuid === this.entityUuid)
      )
      .subscribe(() => {
        this.checked = false;
        this.switch.updateValue(this.checked);
        this.cdRef.detectChanges();
      });

    this.actions$
      .pipe(
        ofType(ITSystemUsageActions.createItSystemUsageSuccess),
        filter(({ itSystemUuid }) => itSystemUuid === this.entityUuid)
      )
      .subscribe(() => {
        this.checked = true;
        this.switch.updateValue(this.checked);
        this.cdRef.detectChanges();
      });

    this.actions$
      .pipe(ofType(ITSystemUsageActions.getITSystemUsageCollectionPermissionsSuccess))
      .subscribe(({ permissions }) => {
        this.disabled = !permissions?.create;
        this.cdRef.detectChanges();
      });
    this.cdRef.detach();
    this.cdRef.detectChanges();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onClick(event: any) {
    this.switch.updateValue(!event);
    this.attemptChange.emit(event);
  }

  public preventDefault(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
