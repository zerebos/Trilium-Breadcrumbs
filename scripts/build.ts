import fs from "node:fs";
import path from "node:path";
// import {fileURLToPath} from "node:url";

import dotenv from "dotenv";
import tepi from "trilium-etapi";
import * as esbuild from "esbuild";


// const fileURL = fileURLToPath(import.meta.url);
// let baseDir = path.dirname(fileURL);
// if (fileURL.includes("esrun-")) baseDir = path.join(baseDir, "..", "..", "scripts");
// const rootDir = path.join(baseDir, "..");
// console.log(process.env.npm_package_json);
const rootDir = path.dirname(process.env.npm_package_json!);


dotenv.config();
if (process.env.TRILIUM_ETAPI_TOKEN) tepi.token(process.env.TRILIUM_ETAPI_TOKEN);

const bundleMap = {
    "widget.js": process.env.MAIN_NOTE_ID
};

const triliumPlugin: esbuild.Plugin = {
    name: "Trilium",
    setup(build) {
        build.onEnd(async result => {
            if (!result.metafile) return;

            const bundles = Object.keys(result.metafile.outputs);
            for (const bundle of bundles) {
                const filename = path.basename(bundle);
                const noteId = bundleMap[filename as keyof typeof bundleMap];
                if (!noteId) {
                    console.info(`No note id found for bundle ${bundle}`);
                    continue;
                }

                const bundlePath = path.join(rootDir, bundle);
                if (!fs.existsSync(bundlePath)) {
                    console.error(`Could not find bundle ${bundle}`);
                    continue;
                }

                const contents = fs.readFileSync(bundlePath).toString();
                await tepi.putNoteContentById(noteId, contents);
            }
            
        });
    }
};


async function runBuild() {
    const before = performance.now();
    await esbuild.build({
        entryPoints: [{"in": path.join(rootDir, "src", "index.ts"), "out": "widget"}],
        bundle: true,
        outdir: path.join(rootDir, "dist"),
        format: "cjs",
        // external: ["fs", "path", "electron", "@electron/remote"],
        // banner: {js: "const require = mod => {try{return window.require(mod);}catch{return {};}};"},
        target: ["chrome96", "node16"],
        loader: {
            ".png": "dataurl",
            ".gif": "dataurl",
            ".woff": "dataurl",
            ".woff2": "dataurl",
            ".ttf": "dataurl",
            ".html": "text",
            ".css": "text"
        },
        plugins: [triliumPlugin],
        logLevel: "info",
        metafile: true,
        minify: process.argv.includes("--minify")
    });
    const after = performance.now();
    console.log(`Build actually took ${(after - before).toFixed(2)}ms`);
}

runBuild().catch(console.error);
