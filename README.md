# Kitos Frontend

Web frontend for OS2 Kitos - Kommunernes IT OverbliksSystem.

## Running the project

Make sure you have installed [Node.js](https://nodejs.org/en/) (preferable using a node version manager like [nvm](https://github.com/nvm-sh/nvm)) and [yarn](https://classic.yarnpkg.com/en/docs/install).

`yarn` to install npm dependencies using yarn.

`yarn start` for a development server. Navigate to `http://localhost:4200/` or `http://127.0.0.1:4200/`. The app will automatically reload if you change any of the source files.

`yarn build` to build the project. The built web app will be placed in the `dist/` directory. `yarn build` defaults to build for development. `yarn build --configuration dev` builds for the dev environment. `yarn build --configuration production` builds for the production environment.

`yarn e2e` to serve the Angular app and afterwards start Cypress E2E testing.

`yarn lint` to run the project linter - eslint.

`yarn i18n` extract all tagged texts to `src/locale/messages.xlf` for internationalization.

`yarn swagger` to generate the API abstraction in `src/app/api/` using the `swagger.json`.

See `package.json` for how these scripts run and `angular.json` for serve/build configurations.

## Frameworks and Libraries

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.4.

The list below mentions some of the larger dependencies of the project.

- [Angular](https://angular.io) as overall framework for the web application.
- [NGRX](https://ngrx.io) for global state management and effects.
- [RxJS](https://rxjs-dev.firebaseapp.com/) for reactive programming.
- [Kendo Angular UI](https://www.telerik.com/kendo-angular-ui) for UI components and grid.
- [openapi-generator](https://openapi-generator.tech/) to generate API abstraction.
- [Cypress](https://www.cypress.io/) for e2e tests.
- [Typescript](https://www.typescriptlang.org) for type-safe javascript programming.
- [yarn](https://yarnpkg.com/lang/en/) for dependency management and execution.

## API

https://staging.kitos.dk/swagger/ui/index for backend API swagger definition.

`openapi-generator` is used for generating the API services and models consumed by the Angular application. This ensures consistency and build time error checking with the API. See `openapitools.json` for configuration. `openapi-generator` has a peer dependency on [Java](https://www.java.com/en/), which needs to be installed on the system.

Webpacks [proxy](https://webpack.js.org/configuration/dev-server/#devserverproxy) is used to route requests to the API doing development. See `src/proxy.conf.json`.

## Kendo Angular UI

Kendo Angular UI is a commercial licensed UI framework from Telerik. You can build and run the Angular app, but without obtaining a license key you will receive "No license found." errors in the browser console. Redistributing and hosting is illegal without a valid Kendo license.

Visit https://www.telerik.com/kendo-angular-ui/components/my-license/ for terms and how to obtain a commercial or trial license.
**Note:** Make sure you are already signed in to your telerik account and that a license has been assigned to you. The license will be available to download via a button on that page and that page alone.

## Authentication

Cookie-based authentication with anti-CSRF protection for mutations is used to login the user and authenticate requests to the API.

1. GET /api/authorize/antiforgery which returns a Cross-Site Request Forgery token and sets the `XSRF-TOKEN` cookie.
2. POST /api/authorize with basic login and `X-XSRF-TOKEN` header set, which returns a user object and sets the `.ASPXAUTH` cookie.
3. Future requests in the session will automatically have the authentication cookie set, until it expires.

Web app is hosted under the same origin, so SameSite cookies is valid. Doing development webpacks proxy is used to route requests to the API and the browser thereby sees the cookies coming from localhost / same origin also.

## State Management

(NGRX)[https://ngrx.io/guide/store] is used to manage component state, global app state, entity collections and side effects. NGRX helps creating reactive Angular apps with decoupled components inspired by Redux.

## Internationalization

[Angular i18n](https://angular.io/guide/i18n-overview) is used for localizing texts used in the angular app.

Static strings in templates should be tagged with `i18n` and in components with `$localize`. `yarn i18n` extracts all tagged texts to `src/locale/messages.xlf` where translations for other languages can be added.

Current implementation is only localized to danish (da) which is just the fallback strings, so manual translations in the xlf files is not necessary. Angulars built-in pipes (`DatePipe`, `DecimalPipe`, etc.) are also affected by setting language to danish only.

`yarn kendo-translate src/locale/messages.da.xlf --locale da-DK` can be used for translating Kendo UI component strings. See https://www.telerik.com/kendo-angular-ui/components/globalization/localization/messages/#toc-translating-the-messages.

## Tests

[Cypress](https://www.cypress.io/) runs end-to-end and Angular component tests. Critical user journeys (e.g. login flow, changing an IT system, adding an IT contract, etc.) are covered by E2E tests using live API. Rest of functionality is tested using intercepted / mocked API requests.

Code is instrumented using (istanbul)[https://github.com/istanbuljs/istanbuljs] doing CI test and coverage is continuously reported to build server.

## Editor

Please respect the `.editorconfig` configuration when making changes to this project.

In Visual Studio Code this is easiest done using the `EditorConfig.editorconfig` extension. See `.vscode/extensions.json` for more recommendations.

## Troubleshooting

### This site can't provide a secure connection

If you run `yarn start`, visit http://localhost:4200 in Chrome and see "This site can't provide a secure connection". It might be because Chrome has cached a permanent redirect from http://localhost to https://localhost. Fix it by going to [chrome://net-internals/#hsts](chrome://net-internals/#hsts) , find the "Delete domain security policies" section, type in `localhost` and click "Delete".
