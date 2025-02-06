export const XSRFCOOKIE = 'XSRF-TOKEN';
export const XSRFTOKEN = 'X-XSRF-TOKEN';

export const DEFAULT_DATE_FORMAT = 'dd-MM-yyyy';

export const DIALOG_DEFAULT_WIDTH = 620;
export const KLE_DIALOG_DEFAULT_WIDTH = 750;
export const ORG_UNIT_DIALOG_DEFAULT_WIDTH = 750;
export const NOTIFICATIONS_DIALOG_DEFAULT_WIDTH = 1100;
export const NOTIFICATIONS_DIALOG_DEFAULT_HEIGHT = 870;

export const DEFAULT_INPUT_DEBOUNCE_TIME = 300;
export const TWO_MINUTES_IN_MILLISECONDS = 120000;

export const DEFAULT_NOTIFICATION_DURATION = 3500;

export const BOUNDED_PAGINATION_QUERY_MAX_SIZE = 250;
export const GRID_DATA_CACHE_CHUNK_SIZE = 50;
export const MAX_INTEGER = 2147483647;

export const YES_TEXT = $localize`Ja`;
export const NO_TEXT = $localize`Nej`;
export const CONFIRM_TEXT = $localize`Ok`;
export const DECLINE_TEXT = $localize`Annuller`;

export const WRITE_TEXT = $localize`Skriv`;
export const READ_TEXT = $localize`Læs`;

export const ARCHIVE_TEXT = $localize`Rigsarkivet`;

export const NULL_PLACEHOLDER = '---';

export const MAX_DATE = 8640000000000000;

export const DEFAULT_UNCLICKABLE_GRID_COLUMN_STYLES = [
  'link',
  'page-link',
  'title-link',
  'usages',
  'action-buttons',
  'checkbox',
];
export const DEFAULT_CHANGELOG_SIZE = 5; //(as per old UI) the size of the changelog should always be 5, this could change in the future

export const KLE_FILE_NAME = $localize`KLE-Changes.csv`;
export const GDPR_REPORT_FILE_PREEFIX = 'kitos_gdpr_report';

export const EMAIL_REGEX_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const DEFAULT_COLUMN_WIDTH = 270;
export const DEFAULT_COLUMN_MINIMUM_WIDTH = 120;
export const DEFAULT_PRIMARY_COLUMN_MINIMUM_WIDTH = 120;
export const DEFAULT_DATE_COLUMN_WIDTH = 220;
export const DEFAULT_DATE_COLUMN_MINIMUM_WIDTH = 200;

export const STRING_FIELD_MAX_LENGTH = 100;

export const GRID_ROW_HEIGHT = 63;

export const MAX_DIALOG_HEIGHT = '750px';

export const NON_EDITABLE_LOCAL_OPTION_TYPE_CATEGORY_HELP_TEXT = $localize`Dette udfaldsrum kan kun redigeres af OS2Kitos sekretariatet`;
export const OBLIGATORY_LOCAL_OPTION_HELP_TEXT = $localize`Dette udfald er obligatorisk og kan kun deaktiveres af OS2Kitos sekretariatet`;
