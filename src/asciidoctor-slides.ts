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
program.version('1.11')
    .requiredOption('-f, --filename <path>', '(mandatory) path of the Asciidoc file to process')
    .option('-o, --output <path>', '(optional) path to the output file')
    .option('-v, --verbose', '(optional) display information about the transformation process', false)
    .option('-s, --show-notes', '(optional) generate slides with embedded speaker notes', false)
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
        'kroki-server-url': 'https://vshn-kroki.apps.cloudscale-lpg-2.appuio.cloud',
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

// Verify that the document has a default Reveal.js style,
// otherwise set it to the VSHN style
const doc = adoc.loadFile(filepath);
const style = doc.getAttribute('revealjs_customtheme');
const vshnStyle = 'theme/vshn.css';
const appuioStyle = 'theme/appuio.css';
const styles = [vshnStyle, appuioStyle];
if (!style || !styles.includes(style)) {
    options['attributes']['revealjs_customtheme'] = vshnStyle;
}

// Activate output of speaker notes if required
if (opts.showNotes) {
    options['attributes']['revealjs_showNotes'] = 'true';
}

// Set the output path if specified
if (opts.output) {
    options['to_file'] = opts.output;
}

logVerbose('asciidoctor-slides: Transforming Asciidoc source to HTML with attributes:');
logVerbose(options.attributes);

// Perform the conversion and exit
adoc.convertFile(filepath, options);
