FROM node:10.14.2-alpine AS htmlmaker

WORKDIR /presentation
COPY ["package.json", "package-lock.json", "/presentation/"]
RUN npm install

COPY . /presentation
COPY generate-vshn-slides.sh /usr/local/bin/generate-vshn-slides

ENTRYPOINT [ "generate-vshn-slides" ]
