import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import {
  APIChangeOrganizationUnitRegistrationV2RequestDTO,
  APINamedEntityV2DTO,
  APINamedEntityWithEnabledStatusV2DTO,
  APINamedEntityWithUserFullNameV2DTO,
  APIOrganizationRegistrationUnitResponseDTO,
  APIOrganizationUnitResponseDTO,
  APIPaymentRegistrationResponseDTO,
} from 'src/app/api/v2';
import { OrganizationUnitRegistrationTypes } from 'src/app/shared/models/organization-unit/organization-unit-registration-type';
import {
  PaymentRegistrationModel,
  RegistrationModel,
} from 'src/app/shared/models/organization-unit/organization-unit-registration.model';
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

  organizationUnitRights: [],
  itContractRegistrations: [],
  internalPayments: [],
  externalPayments: [],
  responsibleSystems: [],
  relevantSystems: [],
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
    on(OrganizationUnitActions.getRegistrationsSuccess, (state, { registrations }): OrganizationUnitState => {
      const mappedRegistrations = mapRegistraitons(registrations);

      return { ...state, registrations, isLoadingRegistrations: false, ...mappedRegistrations };
    }),
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
    ),

    on(
      OrganizationUnitActions.changeOrganizationUnitRegistrationSelect,
      (state, { registration }): OrganizationUnitState => {
        const updatedRegistrations = { ...state.registrations };

        updatedRegistrations.organizationUnitRights = updatedRegistrations.organizationUnitRights?.map((reg) =>
          reg.id === registration.registration.id ? { ...reg, ...registration } : reg
        );

        return { ...state, registrations: updatedRegistrations };
      }
    ),
    on(OrganizationUnitActions.changeItContractRegistrationSelect, (state, { registration }): OrganizationUnitState => {
      const updatedRegistrations = { ...state.registrations };

      updatedRegistrations.itContractRegistrations = updatedRegistrations.itContractRegistrations?.map((reg) =>
        reg.id === registration.registration.id ? { ...reg, ...registration } : reg
      );

      return { ...state, registrations: updatedRegistrations };
    }),
    on(
      OrganizationUnitActions.changeInternalPaymentSelect,
      (state, { registration, contractId }): OrganizationUnitState => {
        const updatedRegistrations = { ...state.registrations };
        const paymentToUpdate = updatedRegistrations.payments?.find((payment) => payment.itContractId === contractId);
        if (!paymentToUpdate) {
          return state;
        }

        paymentToUpdate.internalPayments = paymentToUpdate.internalPayments?.map((reg) =>
          reg.id === registration.registration.id ? { ...reg, ...registration } : reg
        );

        return { ...state, registrations: updatedRegistrations };
      }
    ),
    on(
      OrganizationUnitActions.changeExternalPaymentSelect,
      (state, { registration, contractId }): OrganizationUnitState => {
        const updatedRegistrations = { ...state.registrations };
        const paymentToUpdate = updatedRegistrations.payments?.find((payment) => payment.itContractId === contractId);
        if (!paymentToUpdate) {
          return state;
        }

        paymentToUpdate.externalPayments = paymentToUpdate.externalPayments?.map((reg) =>
          reg.id === registration.registration.id ? { ...reg, ...registration } : reg
        );

        return { ...state, registrations: updatedRegistrations };
      }
    ),
    on(OrganizationUnitActions.changeResponsibleSystemSelect, (state, { registration }): OrganizationUnitState => {
      const updatedRegistrations = { ...state.registrations };

      updatedRegistrations.responsibleSystems = updatedRegistrations.responsibleSystems?.map((reg) =>
        reg.id === registration.registration.id ? { ...reg, ...registration } : reg
      );

      return { ...state, registrations: updatedRegistrations };
    }),
    on(OrganizationUnitActions.changeRelevantSystemSelect, (state, { registration }): OrganizationUnitState => {
      const updatedRegistrations = { ...state.registrations };

      updatedRegistrations.relevantSystems = updatedRegistrations.relevantSystems?.map((reg) =>
        reg.id === registration.registration.id ? { ...reg, ...registration } : reg
      );

      return { ...state, registrations: updatedRegistrations };
    }),

    on(OrganizationUnitActions.changeCollectionSelect, (state, { value, registrationType }): OrganizationUnitState => {
      return updateCollectionByType(state, value, registrationType);
    }),
    on(OrganizationUnitActions.changeAllSelect, (state, { value }): OrganizationUnitState => {
      let updatedState = updateCollectionByType(state, value, 'unitRights');
      updatedState = updateCollectionByType(updatedState, value, 'itContract');
      updatedState = updateCollectionByType(updatedState, value, 'internalPayment');
      updatedState = updateCollectionByType(updatedState, value, 'externalPayment');
      updatedState = updateCollectionByType(updatedState, value, 'responsibleSystem');
      updatedState = updateCollectionByType(updatedState, value, 'relevantSystem');
      return updatedState;
    })
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

function mapRegistraitons(registrations: APIOrganizationRegistrationUnitResponseDTO): any {
  const internalPayments: any[] = [];
  const externalPayments: any[] = [];

  registrations.payments?.forEach((payment) => {
    payment.internalPayments?.forEach((internalPayment) => {
      internalPayments.push({
        itContract: payment.itContract,
        itContractId: payment.itContractId,
        payment: internalPayment,
        isSelected: false,
      });
    });

    payment.externalPayments?.forEach((externalPayment) => {
      externalPayments.push({
        itContract: payment.itContract,
        itContractId: payment.itContractId,
        payment: externalPayment,
        isSelected: false,
      });
    });
  });

  return {
    organizationUnitRights: registrations.organizationUnitRights?.map((registration) => ({
      registration,
      isSelected: false,
    })),
    itContractRegistrations: registrations.organizationUnitRights?.map((registration) => ({
      registration,
      isSelected: false,
    })),
    internalPayments: internalPayments,
    externalPayments: externalPayments,
    responsibleSystems: registrations.responsibleSystems?.map((registration) => ({
      registration,
      isSelected: false,
    })),
    relevantSystems: registrations.relevantSystems?.map((registration) => ({
      registration,
      isSelected: false,
    })),
  };
}

function updateCollectionByType(
  state: OrganizationUnitState,
  value: boolean,
  registrationType: OrganizationUnitRegistrationTypes
) {
  switch (registrationType) {
    case 'unitRights':
      return {
        ...state,
        organizationUnitRights: updateOrganizationUnitRights(
          JSON.parse(JSON.stringify(state.organizationUnitRights)),
          value
        ),
      };
    case 'itContract':
      return {
        ...state,
        itContractRegistrations: updateItContractRegistrations(
          JSON.parse(JSON.stringify(state.itContractRegistrations)),
          value
        ),
      };
    case 'internalPayment':
      return {
        ...state,
        internalPayments: updateInternalPayments(JSON.parse(JSON.stringify(state.internalPayments)), value),
      };
    case 'externalPayment':
      return {
        ...state,
        externalPayments: updateExternalPayments(JSON.parse(JSON.stringify(state.externalPayments)), value),
      };
    case 'responsibleSystem':
      return {
        ...state,
        responsibleSystems: updateResponsibleSystems(JSON.parse(JSON.stringify(state.responsibleSystems)), value),
      };
    case 'relevantSystem':
      return {
        ...state,
        relevantSystems: updateRelevantSystems(JSON.parse(JSON.stringify(state.relevantSystems)), value),
      };
  }
}

function updateOrganizationUnitRights(
  registrations: Array<RegistrationModel<APINamedEntityWithUserFullNameV2DTO>>,
  value: boolean
): Array<RegistrationModel<APINamedEntityWithUserFullNameV2DTO>> {
  registrations.forEach((reg) => {
    reg.isSelected = value;
  });

  return registrations;
}
function updateItContractRegistrations(
  registrations: Array<RegistrationModel<APINamedEntityV2DTO>>,
  value: boolean
): Array<RegistrationModel<APINamedEntityV2DTO>> {
  registrations.forEach((reg) => {
    reg.isSelected = value;
  });

  return registrations;
}
function updateInternalPayments(
  payments: Array<PaymentRegistrationModel>,
  value: boolean
): Array<PaymentRegistrationModel> {
  payments.forEach((payment) => {
    payment.isSelected = value;
  });

  return payments;
}
function updateExternalPayments(
  payments: Array<PaymentRegistrationModel>,
  value: boolean
): Array<PaymentRegistrationModel> {
  payments.forEach((payment) => {
    payment.isSelected = value;
  });

  return payments;
}
function updateResponsibleSystems(
  registrations: Array<RegistrationModel<APINamedEntityWithEnabledStatusV2DTO>>,
  value: boolean
): Array<RegistrationModel<APINamedEntityWithEnabledStatusV2DTO>> {
  registrations.forEach((reg) => {
    reg.isSelected = value;
  });

  return registrations;
}
function updateRelevantSystems(
  registrations: Array<RegistrationModel<APINamedEntityWithEnabledStatusV2DTO>>,
  value: boolean
): Array<RegistrationModel<APINamedEntityWithEnabledStatusV2DTO>> {
  registrations.forEach((reg) => {
    reg.isSelected = value;
  });

  return registrations;
}
