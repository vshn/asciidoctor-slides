/**
 * Drives the creation of the Reveal.js presentation using
 * the asciidoctor-reveal.js JavaScript library.
 */
import asciidoctor from '@asciidoctor/core';
import program from 'commander';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Outputs text to the console log only if the user has requested the --verbose option.
 * @param message The message to show
 */
function logVerbose(message: any) : void {
    if (opts.verbose) {
        console.log(message);
    }
}

// Parse the command line parameters
program.version('1.17.0')
    .requiredOption('-f, --filename <path>', '(mandatory) path of the Asciidoc file to process')
    .option('-o, --output <path>', '(optional) path to the output file')
    .option('-v, --verbose', '(optional) display information about the transformation process', false)
    .option('-s, --show-notes', '(optional) generate slides with embedded speaker notes', false)
    .option('-a, --attribute [attributes...]', '(optional) additional Asciidoctor attributes to pass to the generator', '')
    .option('-e, --embedded', '(optional) make slides embeddable', false)
    .parse(process.argv);
const opts = program.opts()

// Check that the parameter points to a file that actually exists
const filepath : string = path.join('/', 'build', opts.filename);
if (!fs.existsSync(filepath)) {
    console.error('asciidoctor-slides: The path "%s" is invalid. Exiting.', filepath);
    program.outputHelp();
    process.exit(1);
}

const adoc = asciidoctor();

logVerbose('asciidoctor-slides: Loading plugins');

// Load extensions
const registry = adoc.Extensions.create();
require('./asciinema.js').register(registry);
require('./footer.js').register(registry);
require('./header.js').register(registry);
require('asciidoctor-kroki').register(registry);
require('@asciidoctor/reveal.js').register(registry);

const options = {
    safe: 'safe',
    backend: 'revealjs',
    outdir: '/build',
    'extension_registry': registry,
    'attributes': {
        'imagesdir': 'assets/images',
        'icons': 'font',
        'iconfont-cdn': 'theme/fontawesome.css',
        'hide-uri-scheme': '',
        'source-highlighter': 'highlightjs',
        'highlightjs-theme': 'node_modules/highlightjs/styles/vs.css',
        'kroki-server-url': 'https://kroki.vshn.net/',
        'kroki-fetch-diagram': '',
        'stem': '',
        'revealjsdir': 'node_modules/reveal.js',
        'revealjs_backgroundTransition': 'none',
        'revealjs_controls': 'false',
        'revealjs_controlsTutorial': 'false',
        'revealjs_transition': 'none',
        'revealjs_history': 'true',
        'revealjs_slideNumber': 'true',
        'revealjs_preloadIframes': 'true'
    }
};

// Activate output of speaker notes if required
if (opts.showNotes) {
    options['attributes']['revealjs_showNotes'] = 'true';
}

// Set the output path if specified
if (opts.output) {
    options['to_file'] = opts.output;
}

// Set embedded output if required
if (opts.embedded) {
    options['attributes']['data-uri'] = ''
    options['attributes']['allow-uri-read'] = ''
    options['attributes']['revealjs_embedded'] = 'true'
}

// Add more attributes, if any
for (const index in opts.attribute) {
    const attr = opts.attribute[index]
    if (attr.includes('=')) {
        const parts = opts.attribute[index].split('=')
        if (parts.length > 0) {
            options['attributes'][parts[0]] = parts[1]
        }
    }
    else {
        options['attributes'][attr] = ''
    }
}

logVerbose('asciidoctor-slides: Transforming Asciidoc source to HTML with options:');
logVerbose(options);

// Perform the conversion and exit
adoc.convertFile(filepath, options);
