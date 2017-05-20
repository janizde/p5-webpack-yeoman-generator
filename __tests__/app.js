'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const defaultProps = {
  packageName: 'my-project',
  packageVersion: '1.2.3',
  mode: 'instance',
  libraries: ['dom', 'sound']
};

const makeProps = props => Object.assign({}, defaultProps, props);

describe('generator-p5-webpack:app', () => {
  const generatorPath = path.join(__dirname, '../generators/app');

  describe('standard setup', () => {
    beforeAll(() => {
      return helpers.run(generatorPath)
        .withPrompts(defaultProps);
    });

    it('should copy static files', () => {
      assert.file([
        '.babelrc',
        '.gitignore',
        'package.json',
        'webpack.config.js',
        'assets/.gitkeep',
        'src/index.html',
        'src/index.js',
        'src/sketch/index.js'
      ]);
    });

    it('should set project name and version in package.json', () => {
      assert.fileContent('package.json', `"name": "${defaultProps.packageName}"`);
      assert.fileContent('package.json', `"version": "${defaultProps.packageVersion}"`);
    });

    it('should set index.html title to package name', () => {
      assert.fileContent('src/index.html', `<title>${defaultProps.packageName}</title>`);
    });
  });

  describe('p5 libraries', () => {
    it('should not reference any library if none has been selected', () => {
      return helpers.run(generatorPath)
        .withPrompts(makeProps({
          libraries: []
        }))
        .then(() => {
          assert.noFileContent('src/index.js', /import 'p5\/lib\/addons\/.*?;'/);
        });
    });

    it('should only reference selected libraries', () => {
      return helpers.run(generatorPath)
        .withPrompts(makeProps({
          libraries: ['sound']
        }))
        .then(() => {
          assert.fileContent('src/index.js', 'import \'p5/lib/addons/p5.sound\';');
          assert.noFileContent('src/index.js', 'import \'p5/lib/addons/p5.dom\';');
        });
    });

    it('should reference multiple libraries when selected', () => {
      return helpers.run(generatorPath)
        .withPrompts(makeProps({
          libraries: ['sound', 'dom']
        }))
        .then(() => {
          assert.fileContent('src/index.js', 'import \'p5/lib/addons/p5.sound\';');
          assert.fileContent('src/index.js', 'import \'p5/lib/addons/p5.dom\';');
        });
    });
  });

  describe('instance mode', () => {
    beforeAll(() => {
      return helpers.run(generatorPath)
        .withPrompts(makeProps({
          mode: 'instance'
        }));
    });

    it('should use index.instance.js as sketch bootstrap', done => {
      fs.readFile(path.join(generatorPath, 'templates/dynamic/src/sketch/index.instance.js'), (err, templateData) => {
        if (err) {
          done(err);
          return;
        }

        assert.fileContent('src/sketch/index.js', String(templateData));
        done();
      });
    });

    it('should run sketch in instance mode', () => {
      assert.fileContent('src/index.js', 'import p5 from \'p5\';');
      assert.noFileContent('src/index.js', 'import \'p5\';');

      assert.fileContent('src/index.js', 'import sketch from \'./sketch\';');

      assert.fileContent('src/index.js', 'new p5(sketch);');
    });
  });

  describe('global mode', () => {
    beforeAll(() => {
      return helpers.run(generatorPath)
        .withPrompts(makeProps({
          mode: 'global'
        }));
    });

    it('should use index.global.js as sketch bootstrap', done => {
      fs.readFile(path.join(generatorPath, 'templates/dynamic/src/sketch/index.global.js'), (err, templateData) => {
        if (err) {
          done(err);
          return;
        }

        assert.fileContent('src/sketch/index.js', String(templateData));
        done();
      });
    });

    it('should run sketch in global mode', () => {
      assert.fileContent('src/index.js', 'import \'p5\';');
      assert.noFileContent('src/index.js', 'import p5 from \'p5\';');

      assert.fileContent('src/index.js', 'import * as sketchHooks from \'./sketch\';');

      assert.fileContent('src/index.js', /\(w => .*?\)\(window\)/);
    });
  });
});
