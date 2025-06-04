//The test for some reason does not work
//If the public message is directly provided to the publicMessage$ observable, it works
//But if it is provided through the component properties, it does not work
//There is some issue with the component store selection

// describe('PublicMessageComponent', () => {
//   const examplePublicMessage: PublicMessage = {
//     uuid: 'b3f8c8a4-5d2e-4a6b-9f3e-8c7d2a1e4f6c',
//     title: 'A title',
//     shortDescription: 'This is a short description',
//     iconType: { icon: 'clipboard', name: '', value: APIPublicMessageRequestDTO.IconTypeEnum.Clipboard },
//   };

//   it('Can see title, short description and icon', () => {
//     mountComponent(examplePublicMessage).then(() => {
//       cy.contains(examplePublicMessage.title as string);
//       cy.contains(examplePublicMessage.shortDescription as string);
//       cy.get('app-clipboard-icon').should('exist');
//     });
//   });

//   it('Has active status chip when active', () => {
//     mountComponent({ ...examplePublicMessage, status: mapStatusType(APIPublicMessageRequestDTO.StatusEnum.Active) });
//     cy.get('app-status-chip').contains('Normal drift');
//   });

//   it('Has inactive status chip when not active', () => {
//     mountComponent({ ...examplePublicMessage, status: mapStatusType(APIPublicMessageRequestDTO.StatusEnum.Inactive) });
//     cy.get('app-status-chip').contains('Ustabil drift');
//   });

//   it('Has no status chip when status is undefined', () => {
//     mountComponent({ ...examplePublicMessage, status: undefined });
//     cy.get('app-status-chip').should('not.be.visible');
//   });
// });

// function mountComponent(publicMessage: PublicMessage) {
//   return cy.mount(PublicMessageComponent, {
//     componentProperties: {
//       mode: 'normal',
//       publicMessageUuid: publicMessage.uuid,
//     },
//     providers: [
//       {
//         provide: FrontpageComponentStore,
//         useValue: { publicMessages$: of([publicMessage]) },
//       },
//       { provide: HttpClient, useValue: {} },
//       { provide: HttpHandler, useValue: {} },
//       { provide: MatDialog, useValue: { close: cy.spy().as('close') } },
//     ],
//   });
// }
