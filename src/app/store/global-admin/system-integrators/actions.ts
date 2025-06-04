import { createActionGroup, emptyProps } from '@ngrx/store';

export const GlobalAdminSystemIntegratorActions = createActionGroup({
  source: 'GlobalAdminSystemIntegrator',
  events: {
    'Edit System Integrator': (userUuid: string, requestedSystemIntegratorStatus: boolean) => ({
      userUuid,
      requestedSystemIntegratorStatus,
    }),
    'Edit System Integrator Success': () => emptyProps(),
    'Edit System Integrator Error': () => emptyProps(),
  },
});
