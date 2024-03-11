import { createActionGroup, emptyProps } from "@ngrx/store";
import { GridState } from "src/app/shared/models/grid-state.model";
import { ITInterface } from "src/app/shared/models/it-interface/it-interface.model";

export const ITInterfaceActions = createActionGroup({
  source: 'ITInterface',
  events: {
    'Get IT Interfaces': (odataString: string) => ({ odataString }),
    'Get IT Interfaces Success ': (itInterfaces: ITInterface[], total: number) => ({ itInterfaces, total }),
    'Get IT Interfaces Error': emptyProps(),
    'Update Grid State': (gridState: GridState) => ({ gridState }),
  }
})
