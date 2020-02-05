#!/bin/sh

/presentation/node_modules/.bin/ts-node /presentation/scripts/build.ts "$@"
cp -R /presentation/theme /build/theme

mkdir /build/node_modules
cp -R /presentation/node_modules/asciinema-player /build/node_modules/asciinema-player
cp -R /presentation/node_modules/reveal.js /build/node_modules/reveal.js
cp -R /presentation/node_modules/typeface-ubuntu /build/node_modules/typeface-ubuntu
cp -R /presentation/node_modules/typeface-ubuntu-mono /build/node_modules/typeface-ubuntu-mono
