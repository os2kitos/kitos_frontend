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
- [Angular Material](https://material.angular.io/) for Material UI components.
- [openapi-generator](https://openapi-generator.tech/) to generate API abstraction.
- [Cypress](https://www.cypress.io/) for e2e tests.
- [Typescript](https://www.typescriptlang.org) for type-safe javascript programming.
- [yarn](https://yarnpkg.com/lang/en/) for dependency management and execution.

## API

https://staging.kitos.dk/swagger/ui/index for backend API swagger definition.

`openapi-generator` is used for generating the API services and models consumed by the Angular application. This ensures consistency and build time error checking with the API. See `openapitools.json` for configuration. `openapi-generator` has a peer dependency on [Java](https://www.java.com/en/), which needs to be installed on the system.

Webpacks [proxy](https://webpack.js.org/configuration/dev-server/#devserverproxy) is used to route requests to the API doing development. See `src/proxy.conf.json`.

## Angular Material

[Angular Material](https://material.angular.io/) is chosen for Angular Material UI components - customized to match the Kitos design language. `src/styles/typography.scss` defines Material fonts and `src/styles/material.scss` defines the Material theme palette which is set to the same color across all hues, because the shades does not match the design.

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

## Tests

[Cypress](https://www.cypress.io/) runs end-to-end and Angular component tests. Critical user journeys (e.g. login flow, changing an IT system, adding an IT contract, etc.) are covered by E2E tests using live API. Rest of functionality is tested using intercepted / mocked API requests.

Code is instrumented using (istanbul)[https://github.com/istanbuljs/istanbuljs] doing CI test and coverage is continuously reported to build server.

## Editor

Please respect the `.editorconfig` configuration when making changes to this project.

In Visual Studio Code this is easiest done using the `EditorConfig.editorconfig` extension. See `.vscode/extensions.json` for more recommendations.

## Troubleshooting

### This site can't provide a secure connection

If you run `yarn start`, visit http://localhost:4200 in Chrome and see "This site can't provide a secure connection". It might be because Chrome has cached a permanent redirect from http://localhost to https://localhost. Fix it by going to [chrome://net-internals/#hsts](chrome://net-internals/#hsts) , find the "Delete domain security policies" section, type in `localhost` and click "Delete".

## Developer Guide

### Dealing with cached NgRx state

Whenever we add state to the NgRx store it will remain there until the application is reloaded or the state is forcefully changed. In KITOS we deal with two different types of reset actions.

#### Reset organization state

Whenever an active user changes organization (but does not log out in between) we must purge any state related to the current organization context. This could be data such as

- Available Organization Units
- Available Contract Types (options types in general)

If you create a store which contains cached state related to the current organization context, make sure to update the `initialStateDependingOnOrganization` property in the `reset.reducer.ts`.

#### Reset everything

Upon logout all KITOS state should be reset - both the state which depends on the active organization as well as more "global state" such as

- Available KLE items

If you are introducing cross-organization, cached state, make sure you update the `case resetStateAction.type:` case in the `reset.reducer.ts`.

### Dealing with subscriptions in `ngOnInit`

As a general rule we add our subscriptions in the ngOnInit and write our code so it is reactive (depends on observalbes and combinators/operators that work on them).

#### Adding subscriptions the right way

When a component subscribes to events from a global store/publisher, the subscriptions must be removed no later than when the component is removed from the DOM (`OnDestroy`).

This means that if subscriptions are not removed, the "old" subscribers will be kept in memory until the publisher itself is removed (page reload for global objects), and this may lead to [nasty behavior and memory leaks](https://blog.bitsrc.io/6-ways-to-unsubscribe-from-observables-in-angular-ab912819a78f).

In order to make it easier to follow this pattern, all custom components should derive from `BaseComponent` and subscriptions should be created like this:

```
  ngOnInit() {
    //Adding subscriptions to a global publisher (the ngrx store in this case)
    this.subscriptions.add(
      this.store
        .select(SOME_SELECTOR)
        .subscribe((SOME_ARG) =>
          /*Handler logic!*/
        )
    );
  }
```

Adding subscriptions in this way, we maintain a list of the active subscriptions within a local member in the `BaseComponent`. Since the `BaseComponent` implements `OnDestroy` it will make sure to clean up active subscriptions when the component is removed from the DOM.
