'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {

  prompting() {
    this.log(yosay(
      'Welcome to the groovy ' + chalk.red('p5-webpack') + ' generator!'
    ));

    const prompts = [
      {
        type: 'text',
        name: 'packageName',
        message: 'Your package\'s name',
        validate: name => {
          if (!name.match(/^(@[a-z0-9][a-z0-9-]*[a-z0-9]\/)?[a-z0-9][a-z0-9-]*[a-z0-9]$/)) {
            return "Your package name does not comply with the npm requirements.";
          }

          if (name.length > 214) {
            return "The package name must not be larger than 214 characters.";
          }

          return true;
        }
      },
      {
        type: 'text',
        name: 'packageVersion',
        message: 'Your package\'s version',
        default: '0.1.0',
        validate: version => {
          if (version.match(/^([0-9]+\.){2}[0-9]+$/)) {
            return true;
          }

          return "Version must comply with semver.";
        },
      },
      {
        type: 'checkbox',
        name: 'libraries',
        message: 'What additional p5 libraries do you want to use?',
        choices: [
          {
            name: 'p5.dom',
            value: 'dom',
          },
          {
            name: 'p5.sound',
            value: 'sound',
          },
        ],
      },
      {
        type: 'list',
        name: 'mode',
        message: 'In which mode do you want to use p5?',
        choices: [
          {
            name: 'Instance mode (recommended)',
            value: 'instance',
          },
          {
            name: 'Global mode',
            value: 'global',
          },
        ],
      },
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    // Copy all static files
    this.fs.copyTpl(
      this.templatePath('static/**/*'),
      this.destinationPath('.'),
      {
        props: this.props,
      },
      null,
      {
        globOptions: {
          dot: true,
          ignore: [
            '**/.DS_Store',
          ],
        },
      }
    );

    // Copy sketch file according to selected mode
    this.fs.copy(
      this.templatePath(`dynamic/src/sketch/index.${this.props.mode}.js`),
      this.destinationPath('src/sketch/index.js')
    );
  }

  install() {
    this.installDependencies({
      bower: false,
      callback: () => this.log(`All done. Run ${chalk.bold('npm start')} to start the dev server.`),
    });
  }
};
