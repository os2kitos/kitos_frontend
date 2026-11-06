# syntax=docker/dockerfile:1
FROM node:22.13.0-bookworm-slim AS dependencies

RUN corepack enable
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM dependencies AS build

COPY . .
RUN --mount=type=secret,id=KENDO_UI_LICENSE,env=KENDO_UI_LICENSE,required=true \
    test -n "$KENDO_UI_LICENSE" && \
    yarn run kendo-ui-license activate && \
    NODE_OPTIONS=--max_old_space_size=5048 yarn ng build --configuration production --base-href / --localize false

FROM nginx:1.27-alpine

ENV NGINX_ENVSUBST_FILTER=BACKEND_URL

COPY docker/nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist/kitos-web/ /usr/share/nginx/html/

EXPOSE 80
