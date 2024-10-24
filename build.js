import * as esbuild from 'esbuild';
import fs from 'fs/promises';

async function build() {
    await esbuild.build({
        entryPoints: ['src/main.js'],
        bundle: true,
        minify: true,
        format: 'iife',
        outfile: 'dist/page-builder.js',
        globalName: 'PageBuilder',
        define: {
            'process.env.NODE_ENV': '"production"'
        },
        loader: {
            '.css': 'text'  // Load CSS files as strings
        }
    });
    
    console.log('Build complete! Output created in dist/page-builder.js');
}

build().catch(console.error);