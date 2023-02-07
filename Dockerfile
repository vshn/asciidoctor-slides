# Step 1: Builder image
FROM dockerhub.vshn.net/library/node:18.14.0-alpine3.16 AS builder

WORKDIR /presentation
COPY ["package.json", "package-lock.json", "/presentation/"]
RUN npm install

COPY ["tsconfig.json", "gulpfile.js", "./"]
COPY src /presentation/src
RUN npm run build
RUN rm -rf node_modules
RUN npm install --omit=dev


# Step 2: Runtime image
FROM dockerhub.vshn.net/library/node:18.14.0-alpine3.16

# Required by the asciidoctor-kroki plugin, to store diagrams correctly
WORKDIR /build

COPY --from=builder /presentation/dist /presentation/dist
COPY --from=builder /presentation/node_modules /presentation/node_modules
COPY theme /presentation/theme
COPY generate-vshn-slides.sh /usr/local/bin/generate-vshn-slides

ENTRYPOINT [ "generate-vshn-slides" ]
