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
      this.log(props);
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
    });
  }
};
