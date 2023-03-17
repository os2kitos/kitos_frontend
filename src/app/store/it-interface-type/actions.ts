import { createActionGroup, emptyProps } from "@ngrx/store";
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';

export const InterfaceTypeActions = createActionGroup({
  source: "InterfaceType",
  events: {
    'Get interface types': emptyProps(),
    'Get interface types Success': (interfaceType: APIRegularOptionResponseDTO[]) => ({
      interfaceType
    }),
    'Get interffcae types Error': emptyProps()
  },
})
