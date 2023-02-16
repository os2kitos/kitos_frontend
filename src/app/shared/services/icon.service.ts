import { Injectable } from '@angular/core';
import { IconSettingsService, SVGIcon } from '@progress/kendo-angular-icons';

interface CustomSvg {
  content: string;
  viewBox?: string;
}

@Injectable()
export class IconService extends IconSettingsService {
  private customSvgs: { [key: string]: CustomSvg } = {
    'caret-alt-down': {
      content: `
        <path d="M8 10L12 14L16 10" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      `,
    },
    calendar: {
      content: `
        <g clip-path="url(#clip0_233_22197)" fill="none">
        <path d="M1.70914 9.42889C1.60434 10.583 1.53284 11.7552 1.53284 12.9424C1.53284 14.6778 1.68565 16.3815 1.8719 18.0432C2.14848 20.5107 4.15409 22.4698 6.63419 22.5893C8.34839 22.6718 10.0995 22.7148 12 22.7148C13.9006 22.7148 15.6517 22.6718 17.3659 22.5893C19.846 22.4698 21.8515 20.5107 22.1282 18.0432C22.3144 16.3815 22.4673 14.6778 22.4673 12.9424C22.4673 11.7552 22.3958 10.583 22.2909 9.42889H1.70914Z" fill="white"/>
        <path d="M1.70914 9.42889C1.60434 10.583 1.53284 11.7552 1.53284 12.9424C1.53284 14.6778 1.68565 16.3815 1.8719 18.0432C2.14848 20.5107 4.15409 22.4698 6.63419 22.5893C8.34839 22.6718 10.0995 22.7148 12 22.7148C13.9006 22.7148 15.6517 22.6718 17.3659 22.5893C19.846 22.4698 21.8515 20.5107 22.1282 18.0432C22.3144 16.3815 22.4673 14.6778 22.4673 12.9424C22.4673 11.7552 22.3958 10.583 22.2909 9.42889H1.70914Z" stroke="#284B7B" stroke-width="1.4"/>
        <path d="M22.2915 9.42878H1.70972C1.75813 8.89572 1.81364 8.36652 1.87247 7.84152C2.14905 5.374 4.15466 3.41484 6.63476 3.29539C8.34897 3.21283 10.1001 3.16992 12.0006 3.16992C13.9011 3.16992 15.6523 3.21283 17.3665 3.29539C19.8466 3.41484 21.8521 5.374 22.1288 7.84152C22.1876 8.36652 22.2431 8.89572 22.2915 9.42878Z" fill="#F4F7FB"/>
        <path d="M22.2915 9.42878H1.70972C1.75813 8.89572 1.81364 8.36652 1.87247 7.84152C2.14905 5.374 4.15466 3.41484 6.63476 3.29539C8.34897 3.21283 10.1001 3.16992 12.0006 3.16992C13.9011 3.16992 15.6523 3.21283 17.3665 3.29539C19.8466 3.41484 21.8521 5.374 22.1288 7.84152C22.1876 8.36652 22.2431 8.89572 22.2915 9.42878Z" stroke="#284B7B" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M8.40002 1.20001L8.40002 4.80001" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M15.8391 1.28555V4.88555" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </g>
        <defs>
        <clipPath id="clip0_233_22197">
        <rect width="24" height="24" fill="white"/>
        </clipPath>
        </defs>
      `,
    },
    'sort-asc-small': {
      content: `
        <path d="M12 19V5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 10L12 5L17 10" stroke="currentColor" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      `,
    },
    'sort-desc-small': {
      content: `
        <path d="M12 5V19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M17 14L12 19L7 14" stroke="currentColor" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      `,
    },
    'caret-alt-left': {
      content: `
        <path d="M14 16L10 12L14 8" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      `,
    },
    'caret-alt-to-left': {
      content: `
        <path d="M10 16L6 12L10 8" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M17 16L13 12L17 8" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      `,
    },
    'caret-alt-right': {
      content: `
        <path d="M10 16L14 12L10 8" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      `,
    },
    'caret-alt-to-right': {
      content: `
        <path d="M14 16L18 12L14 8" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 16L11 12L7 8" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      `,
    },
  };

  override getSvgIcon(svgIconName: string): SVGIcon {
    const customSvg = this.customSvgs[svgIconName];

    if (customSvg) {
      return {
        name: svgIconName,
        content: customSvg.content,
        viewBox: customSvg.viewBox ?? '0 0 24 24',
      };
    }
    return super.getSvgIcon(svgIconName);
  }
}
