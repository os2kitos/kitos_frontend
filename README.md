# Kitos Frontend

Web frontend for OS2 Kitos.

## Running the project

Make sure you have installed [Node.js](https://nodejs.org/en/) (preferable using a node version manager like [nvm](https://github.com/nvm-sh/nvm)) and [yarn](https://classic.yarnpkg.com/en/docs/install).

`yarn` to install npm dependencies using yarn.

`yarn start` for a development server. Navigate to `http://localhost:4200/` or `http://127.0.0.1:4200/`. The app will automatically reload if you change any of the source files.

`yarn build` to build the project. The built web app will be placed in the `dist/` directory. `yarn build` defaults to build for development. `yarn build --configuration staging` builds for the staging environment. `yarn build --configuration production` builds for the production environment.

`yarn e2e` to serve the Angular app and afterwards start Cypress E2E testing.

`yarn lint` to run the project linter.

`yarn i18n` extract all tagged texts to `locale/messages.xlf` for internationalization.

`yarn swagger` to generate the API abstraction using the `swagger.json`.

## Frameworks and Libraries

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

https://staging.kitos.dk/swagger/ui/index for swagger definition.

`openapi-generator` is used for generating the services and models consumed by the Angular application. This ensures consistency and build time error checking with the API. See `openapitools.json` for configuration.

## Kendo Angular UI

Kendo Angular UI is a commercial licensed UI framework from Telerik. You can build and run the Angular app, but without obtaining a license key you will receive "No license found." errors in the browser console. Redistributing and hosting is illegal without a valid Kendo license.

Visit https://www.telerik.com/kendo-angular-ui/components/my-license/ for terms and how to obtain a commercial or trial license.

## Authentication

...

## State Management

...

## Internationalization

[Angular i18n](https://angular.io/guide/i18n-overview) is used for localizing texts used in the angular app.

Static strings in templates should be tagged with `i18n` and in components with `$localize`. `yarn i18n` extracts all tagged texts to `locale/messages.xlf` where translations for other languages can be added.

Current implementation is only localized to danish which is the fallback strings, so translation xlf is unnecessary at this point. Angular built-in pipes (`DatePipe`, `DecimalPipe`, etc.) are also affected by setting language to danish only.

## Troubleshooting

### This site can't provide a secure connection

If you run `yarn start`, visit http://localhost:4200 in Chrome and see "This site can't provide a secure connection". It might be because Chrome has cached a permanent redirect from http://localhost to https://localhost. Fix it by going to chrome://net-internals/#hsts , find the "Delete domain security policies" section, type in `localhost` and click "Delete".
