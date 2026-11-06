import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EMPTY } from 'rxjs';
import { OrganizationV2Service } from '../../api/v2';
import { GdprPersonalDataDeletionSectionComponent } from '../../modules/it-systems/it-system-usages/it-system-usage-details/it-system-usage-details-gdpr/gdpr-personal-data-deletion-section/gdpr-personal-data-deletion-section.component';
import { ITSystemUsageActions } from '../../store/it-system-usage/actions';

describe('Personal data deletion verification date', () => {
  let component: GdprPersonalDataDeletionSectionComponent;
  let store: MockStore;

  beforeEach(() => {
    cy.clock(new Date(2026, 9, 27, 12).getTime(), ['Date']).then(() => {
      TestBed.configureTestingModule({ providers: [provideMockStore()] });
      store = TestBed.inject(MockStore);
      component = new GdprPersonalDataDeletionSectionComponent(store, {} as OrganizationV2Service, new Actions(EMPTY));
      component.detailsDisabled = false;
    });
  });

  afterEach(() => {
    component.ngOnDestroy();
    TestBed.resetTestingModule();
  });

  it('allows the inclusive 100-year boundary and blocks later dates from saving', () => {
    const dispatch = cy.spy(store, 'dispatch');
    expect(component.maximumVerifiedDate).to.deep.equal(new Date(2126, 9, 27));
    for (const date of [new Date(2126, 9, 28), new Date(3999, 11, 31)]) {
      component.formGroup.controls.verifiedDate.setValue(date);
      component.patchGdpr({ personalDataDeletionVerifiedDate: date.toDateString() });
      expect(component.formGroup.controls.verifiedDate.invalid).to.equal(true);
    }
    expect(dispatch).not.to.have.been.called;

    const boundary = new Date(2126, 9, 27);
    component.formGroup.controls.verifiedDate.setValue(boundary);
    const gdpr = { personalDataDeletionVerifiedDate: boundary.toDateString() };
    component.patchGdpr(gdpr);
    expect(component.formGroup.controls.verifiedDate.valid).to.equal(true);
    expect(dispatch).to.have.been.calledWith(ITSystemUsageActions.patchITSystemUsage({ gdpr }));
  });

  it('allows clearing an invalid date', () => {
    const dispatch = cy.spy(store, 'dispatch');
    component.formGroup.controls.verifiedDate.setValue(new Date(3999, 11, 31));
    component.formGroup.controls.verifiedDate.setValue(null);
    component.patchGdpr({ personalDataDeletionVerifiedDate: null });
    expect(component.formGroup.controls.verifiedDate.valid).to.equal(true);
    expect(dispatch).to.have.been.calledOnce;
  });
});
