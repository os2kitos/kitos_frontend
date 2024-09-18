import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import {
  APIChangeOrganizationUnitRegistrationV2RequestDTO,
  APINamedEntityV2DTO,
  APINamedEntityWithEnabledStatusV2DTO,
  APINamedEntityWithUserFullNameV2DTO,
  APIOrganizationRegistrationUnitResponseDTO,
  APIOrganizationUnitResponseDTO,
} from 'src/app/api/v2';
import { copyObject } from 'src/app/shared/helpers/object.helpers';
import { OrganizationUnitRegistrationTypes } from 'src/app/shared/models/organization-unit/organization-unit-registration-type';
import {
  PaymentRegistrationModel,
  RegistrationModel,
} from 'src/app/shared/models/organization-unit/organization-unit-registration.model';
import { removeUnitAndUpdateChildren } from '../helpers/organization-unit-helper';
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

  permissions: undefined,
  collectionPermissions: undefined,

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

    on(OrganizationUnitActions.deleteOrganizationUnitSuccess, (state, { uuid }): OrganizationUnitState => {
      const organizationUnits = organizationUnitAdapter.getSelectors().selectAll(state);
      const unitToRemove = organizationUnits.find((unit) => unit.uuid === uuid);
      if (!unitToRemove) return state;
      const parent = organizationUnits.find((unit) => unit.uuid === unitToRemove.parentOrganizationUnit?.uuid);
      if (!parent) return state;
      const children = organizationUnits.filter((unit) => unit.parentOrganizationUnit?.uuid === uuid);

      return removeUnitAndUpdateChildren(unitToRemove, children, parent, state);
    }),

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

    on(
      OrganizationUnitActions.transferRegistrations,
      OrganizationUnitActions.removeRegistrations,
      (state): OrganizationUnitState => ({ ...state, isLoadingRegistrations: true })
    ),
    on(OrganizationUnitActions.removeRegistrationsSuccess, (state, { removedRegistrations }): OrganizationUnitState => {
      return filterChangedRegistrations({ ...state }, removedRegistrations);
    }),
    on(
      OrganizationUnitActions.transferRegistrationsSuccess,
      (state, { transferedRegistrations }): OrganizationUnitState => {
        return filterChangedRegistrations({ ...state }, transferedRegistrations);
      }
    ),
    on(
      OrganizationUnitActions.transferRegistrationsError,
      OrganizationUnitActions.removeRegistrationsError,
      (state): OrganizationUnitState => ({ ...state, isLoadingRegistrations: false })
    ),

    on(
      OrganizationUnitActions.changeOrganizationUnitRegistrationSelect,
      (state, { registration }): OrganizationUnitState => {
        const organizationUnitRights = [...state.organizationUnitRights];

        const mappedOrganizationUnitRights = organizationUnitRights?.map((reg) =>
          reg.registration.id === registration.registration.id ? { ...reg, ...registration } : reg
        );

        return { ...state, organizationUnitRights: mappedOrganizationUnitRights };
      }
    ),
    on(OrganizationUnitActions.changeItContractRegistrationSelect, (state, { registration }): OrganizationUnitState => {
      const itContractRegistrations = [...state.itContractRegistrations];

      const mappedItContractRegistrations = itContractRegistrations?.map((reg) =>
        reg.registration.id === registration.registration.id ? { ...reg, ...registration } : reg
      );

      return { ...state, itContractRegistrations: mappedItContractRegistrations };
    }),
    on(OrganizationUnitActions.changeInternalPaymentSelect, (state, { registration }): OrganizationUnitState => {
      const internalPayments = [...state.internalPayments];

      const mappedInternalPayments = internalPayments?.map((reg) =>
        reg.itContractId === registration.itContractId && reg.registration.id === registration.registration.id
          ? { ...reg, ...registration }
          : reg
      );

      return { ...state, internalPayments: mappedInternalPayments };
    }),
    on(OrganizationUnitActions.changeExternalPaymentSelect, (state, { registration }): OrganizationUnitState => {
      const externalPayments = [...state.externalPayments];

      const mappedExternalPayments = externalPayments?.map((reg) =>
        reg.itContractId === registration.itContractId && reg.registration.id === registration.registration.id
          ? { ...reg, ...registration }
          : reg
      );

      return { ...state, externalPayments: mappedExternalPayments };
    }),
    on(OrganizationUnitActions.changeResponsibleSystemSelect, (state, { registration }): OrganizationUnitState => {
      const responsibleSystems = [...state.responsibleSystems];

      const mappedResponsibleSystems = responsibleSystems?.map((reg) =>
        reg.registration.id === registration.registration.id ? { ...reg, ...registration } : reg
      );

      return { ...state, responsibleSystems: mappedResponsibleSystems };
    }),
    on(OrganizationUnitActions.changeRelevantSystemSelect, (state, { registration }): OrganizationUnitState => {
      const relevantSystems = [...state.relevantSystems];

      const mappedRelevantSystems = relevantSystems?.map((reg) =>
        reg.registration.id === registration.registration.id ? { ...reg, ...registration } : reg
      );

      return { ...state, relevantSystems: mappedRelevantSystems };
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
    }),
    on(
      OrganizationUnitActions.getPermissionsSuccess,
      (state, { permissions }): OrganizationUnitState => ({
        ...state,
        permissions,
      })
    ),
    on(
      OrganizationUnitActions.getCollectionPermissionsSuccess,
      (state, { permissions }): OrganizationUnitState => ({ ...state, collectionPermissions: permissions })
    )
  ),
});

function filterChangedRegistrations(
  state: OrganizationUnitState,
  changedRegistrations: APIChangeOrganizationUnitRegistrationV2RequestDTO
): OrganizationUnitState {
  const itContractRegistrations = copyObject(state.itContractRegistrations)?.filter(
    (x) => !changedRegistrations.itContractRegistrations?.some((removedId) => removedId === x.registration.id)
  );

  const organizationUnitRights = copyObject(state.organizationUnitRights)?.filter(
    (x) => !changedRegistrations.organizationUnitRights?.some((removedId) => removedId === x.registration.id)
  );

  let internalPayments: Array<PaymentRegistrationModel> = copyObject(state.internalPayments);
  let externalPayments: Array<PaymentRegistrationModel> = copyObject(state.externalPayments);
  changedRegistrations.paymentRegistrationDetails?.forEach((removedPayment) => {
    internalPayments = filterPayments(internalPayments, removedPayment.itContractId, removedPayment.internalPayments);
    externalPayments = filterPayments(externalPayments, removedPayment.itContractId, removedPayment.externalPayments);
  });
  const relevantSystems = copyObject(state.relevantSystems)?.filter(
    (x) => !changedRegistrations.relevantSystems?.some((removedId) => removedId === x.registration.id)
  );
  const responsibleSystems = copyObject(state.responsibleSystems)?.filter(
    (x) => !changedRegistrations.responsibleSystems?.some((removedId) => removedId === x.registration.id)
  );

  return {
    ...state,
    itContractRegistrations,
    organizationUnitRights,
    internalPayments,
    externalPayments,
    relevantSystems,
    responsibleSystems,
    isLoadingRegistrations: false,
  };
}

function filterPayments(
  payments: Array<PaymentRegistrationModel>,
  itContractId: number | undefined,
  removedPayment: Array<number> | undefined
): Array<PaymentRegistrationModel> {
  return payments?.filter(
    (x) => x.itContractId === itContractId && !removedPayment?.some((removed) => removed === x.registration.id)
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRegistraitons(registrations: APIOrganizationRegistrationUnitResponseDTO): any {
  const internalPayments: PaymentRegistrationModel[] = [];
  const externalPayments: PaymentRegistrationModel[] = [];

  registrations.payments?.forEach((payment) => {
    if (!payment.itContract || !payment.itContractId) return;

    payment.internalPayments?.forEach((internalPayment) => {
      internalPayments.push({
        itContract: payment.itContract!,
        itContractId: payment.itContractId!,
        registration: internalPayment,
        isSelected: false,
      });
    });

    payment.externalPayments?.forEach((externalPayment) => {
      externalPayments.push({
        itContract: payment.itContract!,
        itContractId: payment.itContractId!,
        registration: externalPayment,
        isSelected: false,
      });
    });
  });

  return {
    organizationUnitRights: registrations.organizationUnitRights?.map((registration) => ({
      registration,
      isSelected: false,
    })),
    itContractRegistrations: registrations.itContractRegistrations?.map((registration) => ({
      registration,
      isSelected: false,
    })),
    internalPayments: internalPayments,
    externalPayments: externalPayments,
    responsibleSystems: registrations.responsibleSystems?.map((registration) => ({
      registration: { ...registration, name: getDisabledName(registration) },
      isSelected: false,
    })),
    relevantSystems: registrations.relevantSystems?.map((registration) => ({
      registration: { ...registration, name: getDisabledName(registration) },
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
        organizationUnitRights: updateOrganizationUnitRights(copyObject(state.organizationUnitRights), value),
      };
    case 'itContract':
      return {
        ...state,
        itContractRegistrations: updateItContractRegistrations(copyObject(state.itContractRegistrations), value),
      };
    case 'internalPayment':
      return {
        ...state,
        internalPayments: updateInternalPayments(copyObject(state.internalPayments), value),
      };
    case 'externalPayment':
      return {
        ...state,
        externalPayments: updateExternalPayments(copyObject(state.externalPayments), value),
      };
    case 'responsibleSystem':
      return {
        ...state,
        responsibleSystems: updateResponsibleSystems(copyObject(state.responsibleSystems), value),
      };
    case 'relevantSystem':
      return {
        ...state,
        relevantSystems: updateRelevantSystems(copyObject(state.relevantSystems), value),
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
function getDisabledName(registration: APINamedEntityWithEnabledStatusV2DTO) {
  return registration.disabled ? `${registration.name} ` + $localize`(Ikke tilgængeligt)` : registration.name;
}
