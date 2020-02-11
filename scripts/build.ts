/**
 * Drives the creation of the Reveal.js presentation using
 * the asciidoctor-reveal.js JavaScript library.
 */
import asciidoctor from '@asciidoctor/core'
import * as fs from 'fs';
import * as path from 'path';

// Check that there is a 'filename' parameter
if (process.argv.length < 3) {
    console.error('asciidoctor-slides: Missing "filename" parameter. Exiting');
    process.exit(1);
}

// Check that the parameter points to a file that actually exists
const filename = process.argv[2];
const filepath : string = path.join('/', 'build', filename);
if (!fs.existsSync(filepath)) {
    console.error('asciidoctor-slides: The path "%s" is invalid. Exiting.', filepath);
    process.exit(1);
}

const adoc = asciidoctor();

console.log('asciidoctor-slides: Loading plugins')
const registry = adoc.Extensions.create();
require('./asciinema.ts').register(registry);
require('./footer.ts').register(registry);
require('asciidoctor-kroki').register(registry);
require('asciidoctor-reveal.js').register(registry);

const options = {
    safe: 'safe',
    backend: 'revealjs',
    outdir: '/build',
    'extension_registry': registry,
    'attributes': {
        'imagesdir': 'assets/images',
        'icons': 'font',
        'icon-set': 'fi',
        'hide-uri-scheme': '',
        'source-highlighter': 'highlightjs',
        'kroki-server-url': 'https://vshn-kroki.appuioapp.ch',
        'stem': '',
        'revealjsdir': 'node_modules/reveal.js',
        'revealjs_customtheme': 'theme/vshn.css',
        'revealjs_controls': 'false',
        'revealjs_controlsTutorial': 'false',
        'revealjs_transition': 'none',
        'revealjs_history': 'true',
        'revealjs_backgroundTransition': 'none',
        'revealjs_slideNumber': 'true'
    }
};
console.log('asciidoctor-slides: Transforming Asciidoc source to HTML with attributes:')
console.dir(options.attributes)
adoc.convertFile(filepath, options);
