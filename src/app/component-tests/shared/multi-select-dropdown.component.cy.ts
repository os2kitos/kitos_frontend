import { Subject } from 'rxjs';
import { MultiSelectDropdownComponent } from '../../shared/components/dropdowns/multi-select-dropdown/multi-select-dropdown.component';
import { MultiSelectDropdownItem } from '../../shared/models/dropdown-option.model';
import { NotificationService } from '../../shared/services/notification.service';

describe('Multiselect descriptions', () => {
  const first = { name: 'First', value: 'first', selected: false, description: 'First description' };
  const second = { name: 'Second', value: 'second', selected: false, description: 'Second description' };
  const withoutDescription = { name: 'Third', value: 'third', selected: false };

  function mountDropdown(
    properties: Partial<MultiSelectDropdownComponent<unknown>> = {},
    data: MultiSelectDropdownItem<unknown>[] = [first, second, withoutDescription],
  ) {
    return cy.mount(MultiSelectDropdownComponent<unknown>, {
      componentProperties: { data, showDescription: true, ...properties },
      providers: [{ provide: NotificationService, useValue: {} }],
    });
  }

  it('shows option descriptions and updates the label when selecting, deselecting and clearing', () => {
    mountDropdown({ initialSelectedValues: [first] });
    cy.get('app-textbox-info').should('contain.text', first.description);
    cy.get('.ng-select-container').click();
    cy.get('.ng-option').contains(second.description).should('be.visible').click();
    cy.get('app-textbox-info').should('contain.text', first.description).and('contain.text', second.description);
    cy.get('.ng-option').contains(first.description).click();
    cy.get('app-textbox-info').should('not.contain.text', first.description).and('contain.text', second.description);
    cy.get('.ng-option').contains(withoutDescription.name).click();
    cy.get('app-textbox-info').should('contain.text', second.description).and('not.contain.text', 'undefined');
    cy.get('.ng-clear-wrapper').click();
    cy.get('app-textbox-info').should('not.exist');
  });

  it('supports nested descriptions, custom fields, programmatic selections and reset', () => {
    const resetSubject$ = new Subject<void>();
    const nested = { name: 'Nested', value: { details: 'Nested description' }, selected: false };
    mountDropdown({ itemDescriptionField: 'details', resetSubject$ }, [nested]).then(({ component, fixture }) => {
      component.setValues([nested]);
      fixture.detectChanges();
      cy.get('app-textbox-info').should('contain.text', nested.value.details);
      cy.get('.ng-select-container').click();
      cy.get('.ng-option').should('contain.text', nested.value.details);
      cy.then(() => {
        resetSubject$.next();
        fixture.detectChanges();
      });
    });
    cy.get('app-textbox-info').should('not.exist');
  });

  it('updates descriptions when initial selections arrive after initialization', () => {
    mountDropdown().then(({ fixture }) => {
      fixture.componentRef.setInput('initialSelectedValues', [first]);
      fixture.detectChanges();
    });
    cy.get('app-textbox-info').should('contain.text', first.description);
  });

  it('keeps descriptions opt-in and allows hiding the selected description label', () => {
    mountDropdown({ showDescription: false, initialSelectedValues: [first] }).then(({ fixture }) => {
      cy.get('app-textbox-info').should('not.exist');
      cy.get('.ng-select-container').click();
      cy.get('.ng-option').should('not.contain.text', first.description);
      cy.then(() => {
        fixture.componentRef.setInput('showDescription', true);
        fixture.componentRef.setInput('showDescriptionLabel', false);
        fixture.detectChanges();
      });
    });
    cy.get('.ng-option').should('contain.text', first.description);
    cy.get('app-textbox-info').should('not.exist');
  });
});
