import * as esbuild from 'esbuild';
import fs from 'fs';

async function build() {
    await esbuild.build({
        entryPoints: ['src/main.js'],
        bundle: true,
        minify: true,
        format: 'iife',
        outfile: 'dist/femto_edit.js',
        globalName: 'FemtoEdit',
        define: {
            'process.env.NODE_ENV': '"production"'
        },
        loader: {
            '.css': 'text'  // Load CSS files as strings
        }
    });
    
    console.log('Build complete! Output created in dist/femto_edit.js');

    // read output file
    const text = fs.readFileSync('dist/femto_edit.js', 'utf8');
    let bookmarklet = `javascript:((() => { ${text} })())`;
    fs.writeFileSync('dist/femto_edit_bookmarklet.js', bookmarklet);
}

build().catch(console.error);