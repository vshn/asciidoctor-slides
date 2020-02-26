# Step 1: Builder image
FROM node:10.15.3-alpine AS builder

WORKDIR /presentation
COPY ["package.json", "package-lock.json", "/presentation/"]
RUN npm install

COPY ["tsconfig.json", "gulpfile.ts", "./"]
COPY src /presentation/src
RUN node_modules/.bin/gulp


# Step 2: Runtime image
FROM node:10.15.3-alpine

WORKDIR /presentation
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --production

# Required by the asciidoctor-kroki plugin, to store diagrams correctly
WORKDIR /build

COPY --from=builder /presentation/dist /presentation/dist
COPY theme /presentation/theme
COPY generate-vshn-slides.sh /usr/local/bin/generate-vshn-slides

ENTRYPOINT [ "generate-vshn-slides" ]
