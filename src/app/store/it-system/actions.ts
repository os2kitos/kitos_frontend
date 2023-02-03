import { createActionGroup, emptyProps } from '@ngrx/store';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITSystem } from 'src/app/shared/models/it-system.model';

export const ITSystemActions = createActionGroup({
  source: 'ITSystem',
  events: {
    'Get IT Systems': (odataString: string) => ({ odataString }),
    'Get IT Systems Success ': (itSystems: ITSystem[], total: number) => ({ itSystems, total }),
    'Get IT Systems Error': emptyProps(),

    'Update Grid State': (gridState: GridState) => ({ gridState }),
  },
});
