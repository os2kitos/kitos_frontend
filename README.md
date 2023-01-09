# Kitos Frontend

Web frontend for OS2 Kitos.

## Running the project

Install [Node.js](https://nodejs.org/en/) (preferable using a node version manager like [nvm](https://github.com/nvm-sh/nvm)) and [yarn](https://classic.yarnpkg.com/en/docs/install).

`yarn` to install npm dependencies using yarn.

`yarn start` for a development server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

`yarn build` to build the project. The build artifacts will be stored in the `dist/` directory. See `package.json` for builds to different environments.

`yarn e2e` to serve the Angular app and afterwards start Cypress.

`yarn lint` to run the project linter.

`yarn swagger` to generate the API abstraction using the `swagger.json`. OBS: Needs to be run first!

## Frameworks and libraries

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

`openapi-generator` is used for generating the services and models consumed by the Angular application. This ensures consistency and error checking with the API.

## Authentication

...

