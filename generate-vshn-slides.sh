#!/bin/sh

# Build the HTML presentation
node /presentation/dist/asciidoctor-slides.js "$@"

# Copy theme
cp -R /presentation/theme /build/theme

# Copy required Node.js modules
mkdir -p /build/node_modules
cp -R /presentation/node_modules/asciinema-player /build/node_modules/asciinema-player
cp -R /presentation/node_modules/reveal.js /build/node_modules/reveal.js
cp -R /presentation/node_modules/lato-font /build/node_modules/lato-font
cp -R /presentation/node_modules/typeface-ubuntu /build/node_modules/typeface-ubuntu
cp -R /presentation/node_modules/typeface-ubuntu-mono /build/node_modules/typeface-ubuntu-mono
cp -R /presentation/node_modules/@fortawesome /build/node_modules/@fortawesome
cp -R /presentation/node_modules/@fontsource /build/node_modules/@fontsource
cp -R /presentation/node_modules/highlightjs /build/node_modules/highlightjs
