import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import {
  APIChangeOrganizationUnitRegistrationV2RequestDTO,
  APIOrganizationRegistrationUnitResponseDTO,
  APIOrganizationUnitResponseDTO,
  APIPaymentRegistrationResponseDTO,
} from 'src/app/api/v2';
import { OrganizationUnitActions } from './actions';
import { OrganizationUnitState } from './state';

export const organizationUnitAdapter = createEntityAdapter<APIOrganizationUnitResponseDTO>({
  selectId: (organizationUnit) => organizationUnit.uuid,
});

export const organizationUnitInitialState: OrganizationUnitState = organizationUnitAdapter.getInitialState({
  cacheTime: undefined,
  expandedNodeUuids: [],

  registrations: undefined,
  isLoadingRegistrations: false,
});

export const organizationUnitFeature = createFeature({
  name: 'OrganizationUnit',
  reducer: createReducer(
    organizationUnitInitialState,
    on(OrganizationUnitActions.getOrganizationUnits, (state): OrganizationUnitState => ({ ...state })),
    on(
      OrganizationUnitActions.getOrganizationUnitsSuccess,
      (state, { units }): OrganizationUnitState => ({
        ...organizationUnitAdapter.setAll(units, state),
        cacheTime: new Date().getTime(),
      })
    ),
    on(OrganizationUnitActions.patchOrganizationUnitSuccess, (state, { unit }) => {
      return organizationUnitAdapter.updateOne(
        {
          id: unit.uuid,
          changes: unit,
        },
        state
      );
    }),
    on(OrganizationUnitActions.getOrganizationUnitsError, (state): OrganizationUnitState => ({ ...state })),
    on(OrganizationUnitActions.updateHierarchy, (state, { unit, units }): OrganizationUnitState => {
      const nodesCopy = units.map((u) => (u.uuid === unit.uuid ? unit : u));

      return { ...organizationUnitAdapter.setAll(nodesCopy, state) };
    }),

    on(
      OrganizationUnitActions.addExpandedNode,
      (state, { uuid }): OrganizationUnitState => ({
        ...state,
        expandedNodeUuids: [...state.expandedNodeUuids, uuid],
      })
    ),
    on(
      OrganizationUnitActions.removeExpandedNode,
      (state, { uuid }): OrganizationUnitState => ({
        ...state,
        expandedNodeUuids: state.expandedNodeUuids.filter((u) => u !== uuid),
      })
    ),
    on(
      OrganizationUnitActions.createOrganizationSubunitSuccess,
      (state, { unit }): OrganizationUnitState => ({
        ...organizationUnitAdapter.addOne(unit, state),
      })
    ),

    on(
      OrganizationUnitActions.getRegistrations,
      (state): OrganizationUnitState => ({ ...state, isLoadingRegistrations: true })
    ),
    on(
      OrganizationUnitActions.getRegistrationsSuccess,
      (state, { registrations }): OrganizationUnitState => ({
        ...state,
        registrations,
        isLoadingRegistrations: false,
      })
    ),
    on(
      OrganizationUnitActions.getRegistrationsError,
      (state): OrganizationUnitState => ({ ...state, isLoadingRegistrations: false })
    ),

    on(OrganizationUnitActions.removeRegistrationsSuccess, (state, { removedRegistrations }): OrganizationUnitState => {
      const filteredRegistrations = filterChangedRegistrations({ ...state.registrations }, removedRegistrations);

      return { ...state, registrations: filteredRegistrations };
    }),
    on(
      OrganizationUnitActions.transferRegistrationsSuccess,
      (state, { transferedRegistrations }): OrganizationUnitState => {
        const filteredRegistrations = filterChangedRegistrations({ ...state.registrations }, transferedRegistrations);

        return { ...state, registrations: filteredRegistrations };
      }
    )
  ),
});

function filterChangedRegistrations(
  registrations: APIOrganizationRegistrationUnitResponseDTO,
  changedRegistrations: APIChangeOrganizationUnitRegistrationV2RequestDTO
): APIOrganizationRegistrationUnitResponseDTO {
  registrations.itContractRegistrations = registrations.itContractRegistrations?.filter(
    (x) => !changedRegistrations.itContractRegistrations?.some((removedId) => removedId === x.id)
  );
  registrations.organizationUnitRights = registrations.organizationUnitRights?.filter(
    (x) => !changedRegistrations.organizationUnitRights?.some((removedId) => removedId === x.id)
  );
  registrations.payments?.forEach((payment) => {
    payment = filterPayments(payment, changedRegistrations);
  });
  registrations.relevantSystems = registrations.relevantSystems?.filter(
    (x) => !changedRegistrations.relevantSystems?.some((removedId) => removedId === x.id)
  );
  registrations.responsibleSystems = registrations.responsibleSystems?.filter(
    (x) => !changedRegistrations.responsibleSystems?.some((removedId) => removedId === x.id)
  );

  return registrations;
}

function filterPayments(
  payment: APIPaymentRegistrationResponseDTO,
  removedRegistrations: APIChangeOrganizationUnitRegistrationV2RequestDTO
): APIPaymentRegistrationResponseDTO {
  payment.externalPayments = payment.externalPayments?.filter(
    (x) =>
      !removedRegistrations.paymentRegistrationDetails?.some((removePayment) =>
        removePayment.externalPayments?.some((external) => external === x.id)
      )
  );
  payment.internalPayments = payment.internalPayments?.filter(
    (x) =>
      !removedRegistrations.paymentRegistrationDetails?.some((removePayment) =>
        removePayment.internalPayments?.some((internal) => internal === x.id)
      )
  );
  return payment;
}
