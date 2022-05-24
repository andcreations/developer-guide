# Developer guide

__Developer guide__ is a tool to generate documentation. The key feature is that it can read specially marked comment blocks and insert them into generated documentation. The comment blocks can be read from source code so that the documentation very likely will stay up-to-date.
The tool generates markdown files and the index file for [docsify](https://docsify.js.org/). Therefore, the documentation can be served by docsify.

## Partials

The aforementioned comment blocks are called partials. Partials are pulled from single-line comments of special format. Each partial comment block starts with a front matter section. Each partial must begin with a front matter. Each line of a front matter starts with triple dash (`---`). The front matter is parsed as YAML.

Each partial has its identifier which is given under `devGuideId`. The below example code snippet contains a partial with identifier `command.args`:
```ts
export function parseArgs(): void {
// --- devGuideId: command.args
// - `--port`, `-p` - port on which start the server
// - `--src', `-s' directory with files to serve.
}
```

Partials are read from the following file types:
* JavaScript and TypeScript (including React syntax),
* C/C++ files,
* YAML files.

Partials are injected in documentation source files using a special marker:

```
$partial<id>
```

`id` is the partial identifier. The marker must be at the beginning of a line.

## Configuring and building documentation

Developer guide is intended to be incorporated into a Node.JS application which contains documentation source (Markdown) files. The documentation is configured and built through a single JavaScript file (`index.js`):

```javascript
const path = require('path');
const { DevGuide } = require('@andcreations/developer-guide');

const cfg = {
  // directory with documentation source files
  srcDir: __dirname,

  // destination directory for built documentation
  dstDir: path.join(__dirname, '../dist'),

  // directories with partials
  partialSrcDirs: [
    path.join(__dirname, '../../backend'),
    path.join(__dirname, '../../frontend'),
  ],

  // documentation description
  title: 'Documentation',
  name: 'Cool project',
  description: 'Cool project documentation',
};

const devGuide = new DevGuide(cfg);
devGuide.run(process.argv.slice(2));
```

The last line takes process arguments. They determine the action to perform. Currently only `build` is supported.

The corresponding `package.json` could be as follows:

```json
{
  "name": "cool-project-documentation",
  "version": "1.0.0",
  "description": "Cool project documentation",
  "main": "src/index.js",
  "directories": {},
  "scripts": {
    "build": "node src/index.js build",
    "start": "node_modules/.bin/docsify serve dist --port=3077"
  },
  "author": "",
  "license": "MIT",
  "dependencies": {
    "docsify": "^4.7.1",
    "docsify-cli": "^4.2.1"
  }
}
```

The docsify dependencies together with the `start` script allow to run a HTTP server and serve the documentation.

## Sidebar

The documentation provides a sidebar with project name, search box and tree navigation. The navigation depends on the documentation itself and is provided by a file `_sidebar.md` which must be contained in the `srcDir` directory.

An example sidebar file could be:
```markdown
* Developer's guide
    * [Getting started](/)
    * [Development environment](DevelopmentEnvironment.md)
    * [Building the project](BuildingProject.md)
* Libraries and modules    
    * [Request router](RequestRouter.md)
    * [Proxy server](ProxyServer.md)
    * [Provided libraries](ProvidedLibraries.md)
* Others
    * [Documentation development](DocumentationDevelopment.md)
```