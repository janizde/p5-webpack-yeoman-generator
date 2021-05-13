# generator-p5-webpack [![NPM version][npm-image]][npm-url] [![Build Status](https://travis-ci.org/janizde/p5-webpack-yeoman-generator.svg?branch=master)](https://travis-ci.org/janizde/p5-webpack-yeoman-generator) [![Dependency Status](https://david-dm.org/janizde/p5-webpack-yeoman-generator.svg)](https://david-dm.org/janizde/p5-webpack-yeoman-generator)

Yeoman generator for p5.js with webpack, dev server and ES6 through babel

## Contents

- [Installtion](#installation)
- [Features](#features)
- [p5 Libraries](#p5-libraries)
- [Babel presets and plugins](#babel)
- [Dev server](#dev-server)
- [NPM commands](#npm-commands)
- [Project structure](#project-structure)
- [Sketch modes](#sketch-modes)
  _ [Instance mode](#instance-mode)
  _ [Global mode](#global-mode)
- [Getting to know Yeoman](#getting-to-know-yeoman)
- [Changelog](#changelog)
- [License](#license)

## <a name="installation"></a>Installation

First, install [Yeoman](http://yeoman.io) and generator-p5-webpack using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-p5-webpack
```

Then generate your new project:

```bash
yo p5-webpack
```

## <a name="features"></a>Features

- Webpack setup including dev server and build process
- ES6 support with babel
- Automatic installation of p5.dom and p5.sound if desired
- Boilerplate sketch in either Instance mode or Global mode
- `assets` directory to put any assets like audio, images into, which is served by the dev server and bundled in the build process

## <a name="p5-libraries"></a>p5 Libraries

The generator currently supports all of the **official** p5 libraries (i.e. `p5.sound`). However there is **no guaranteed support for community contributed libraries,** as many of them are not available on npm or are not prepared for the use with a module bundler.

> **Note:** Previous versions of this generator offered to include the official library `p5.dom` which became part of the p5 core. Hence, this option has been removed from the generator dialog and will be enhanced with more options soon.

## <a name="babel"></a>Babel presets and plugins

Previous versions of this generator included `stage-0` plugins to make use of next generation JavaScript features. Since version `v0.2.0` only the `preset-env` preset is shipped with the template and selects language features based on the `browserslist` entry in `package.json`. Plugins for rules of other stages have to be added manually. Options to include polyfills from `core-js` and `regenerator-runtime` will be included in a future version.

## <a name="dev-server"></a>Dev server

The dev server builds your whole project through the webpack build pipeline and keeps the generated artifacts in its memory (bundled files are not saved to your disk). It automatically detects when something in your files has changed, builds the changed code with webpack and automatically reloads the browser window.

You can change the port on which the HTTP server listens and more dev server related options in the `webpack.config.js`.

[More on the webpack dev server](https://webpack.js.org/configuration/dev-server/)

## <a name="npm-commands"></a>NPM commands

- `npm start`: Runs the dev server and opens the project in your standard browser
- `npm run build`: Builds the whole project and saves the resulting bundles in the `dist` directory
- `npm run clean`: Cleans out the `dist` directory

## <a name="project-structure"></a>Project structure

### Directory Tree

```
your-project
|- assets [1]
|- src
|	|- index.html [2]
|	|- index.js [3]
|	|- sketch [4]
|		|- index.js [5]
|
|- package.json
|- webpack.config.js
```

### Description

| Number | File                  | Description                                                                                                                                                                                     |
| -----: | :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|      1 | `assets`              | assets directory that will be served by the dev server as `/assets`. Put any required media like audio or images inside this directory and reference it in your sketch as `/assets/my-file.jpg` |
|      2 | `src/index.html`      | HTML template. `<script>` tags for all bundles will be injected automatically by `html-webpack-plugin`.                                                                                         |
|      3 | `src/index.js`        | Application entry point. Contains bootstrapping and imports of modules. Do not put your actual sketch code here.                                                                                |
|      4 | `src/sketch`          | The source directory of your sketch. Place all of your custom code in this directory.                                                                                                           |
|      5 | `src/sketch/index.js` | Entry point of sketch. Contains bootstrap sketch based on the selected [sketch mode](#sketch-modes)                                                                                             |
|      6 | `package.json`        | Your package information. Add description and other fields as you like.                                                                                                                         |
|      7 | `webpack.config.js`   | The webpack configuration of the project.                                                                                                                                                       |

## <a name="sketch-modes"></a>Sketch Modes

Sketches can either be run in Instance or Global mode. The generator bootstraps an example sketch based on the option you have selected.

You can read about the different modes in the [p5 documentation](https://github.com/processing/p5.js/wiki/Global-and-instance-mode)

### <a name="instance-mode"></a>Instance mode (recommended)

It is recommended to use Instance mode with this generator as it complies best with the CommonJS module pattern. With Instance mode your sketch lives in its own portion of the project and does not operate in the global namespace.

When creating a project in Instance mode, you will find a bootstrapped `sketch` function in the `src/sketch/index.js` file. This file (module) must export a `sketch` function as the default export. The `sketch` function receives an instance of p5 as its first and only parameter. All of the p5 functions are available as members of this instance. Also, all of the p5 hooks like `setup`, `draw` or `mousePressed` must be set on the p5 instance itself. A very basic sketch would be:

```javascript
export default sketch(s) {
	let bgColor;

	s.setup = () => {
		bgColor = s.color(s.random(255), s.random(255), s.random(255));
	};

	s.draw = () => {
		s.background(bgColor);
		s.fill(s.color(255, 0, 0));
		s.ellipse(0, 0, 10, 10);
	};
}
```

### <a name="global-mode"></a>Global mode

Though Global mode is the mode that most p5 tutorials and projects refer to, it is not so straight forward to integrate it with the CommonJS module pattern.

While for a standard p5 setup it's enough to specify your hooks by just defining a function in the global namespace (e.g. `function setup() {...}`), in CommonJS modules there is no real global namespace.

When creating a new project in Global mode, you will find a bootstrapped sketch in Global mode in the `src/sketch/index.js` file. Instead of just defining the `setup`, `draw` etc. functions you will additionally have to export these functions. A code snippet in the `src/index.js` file attaches everything that is exported from the actual sketch file to the global `window` object, so p5 works as expected. Please also note, that everything else you export from the sketch file will also be attached to the global `window` object. So please make sure you only export hook functions from your sketch file.

The above example in Instance mode would look like this in Global mode:

```javascript
let bgColor;

export function setup() {
  bgColor = color(random(255), random(255), random(255));
}

export function draw() {
  background(bgColor);
  fill(color(255, 0, 0));
  ellipse(0, 0, 10, 10);
}
```

## <a name="getting-to-now-yeoman"></a>Getting To Know Yeoman

- Yeoman has a heart of gold.
- Yeoman is a person with feelings and opinions, but is very easy to work with.
- Yeoman can be too opinionated at times but is easily convinced not to be.
- Feel free to [learn more about Yeoman](http://yeoman.io/).

## <a name="changelog"></a>Changelog

### v0.2.4

Upgrade dependencies

### v0.2.3

Upgrade dependencies

### v0.2.2

Upgrade dependencies

### v0.2.1

Upgrade dependencies with security vulnerabilities

### v0.2.0

- Generator
  _ Upgrade yeoman toolchain to `yeoman-generator@^4.4.0` `yosay@^2.0.0`
  _ Upgrade test dependencies to `jest@^24.9.0`, `jest-cli@^24.9.0`, `yeoman-assert@^3.0.0`, `yeoman-test@^2.0.0`
  _ Replace deprecated `nps` with `npm audit`
  _ Remove library option `p5.dom` (now part of `p5`)
- Project template
  _ Upgrade p5 to `p5@^0.10.2`
  _ Upgrade babel & friends to `@babel/core@^7.0.0`
  _ Drop `stage-0` preset of babel
  _ Add `browserslist` entry to `package.json`
  _ Upgrade webpack & friends to `webpack@^4.41.4`
  _ Remove `vendor` commons chunk

### v0.1.1

- Fixed bug that did not load sketched in global mode properly @carolineartz
- Added quick fix for `webpack-dev-server` at version `2.5.0`, see [issue on GitHub](https://github.com/webpack/webpack-dev-server/issues/972) @janizde

### v0.1.0

Initial implementation of the generator-p5-webpack containing webpack setup, dev server and global / instance mode.

## <a name="license"></a>License

GPL-3.0 © [Jannik Portz](http://jannikportz.de)

[npm-image]: https://badge.fury.io/js/generator-p5-webpack.svg
[npm-url]: https://npmjs.org/package/generator-p5-webpack
[travis-image]: https://travis-ci.org/janizde/generator-p5-webpack.svg?branch=master
[travis-url]: https://travis-ci.org/janizde/generator-p5-webpack
[daviddm-image]: https://david-dm.org/janizde/generator-p5-webpack.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/janizde/generator-p5-webpack
[coveralls-image]: https://coveralls.io/repos/janizde/generator-p5-webpack/badge.svg
[coveralls-url]: https://coveralls.io/r/janizde/generator-p5-webpack
