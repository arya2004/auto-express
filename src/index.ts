import * as fs from 'fs';
import * as path from 'path';
import { Command } from 'commander';
import { generateGitignoreContent } from './utils';
import { initProject } from './template';

export function sayHello() {
  console.log('HEllo');
}

const program = new Command();

program
  .name('auto-express')
  .version('1.9.0')
  .description('A CLI to generate Express.js projects');

function createProject(projectName: string) {
  console.log(`Creating a new Express project named: ${projectName}`);
  const projectPath = path.join(process.cwd(), projectName);
  try {
    fs.mkdirSync(projectPath, { recursive: true });
    console.log(`✅ Directory created at: ${projectPath}`);
  } catch (error) {
    console.error('❌ Error creating project directory:', error);
    process.exit(1);
  }
  try {
    fs.writeFileSync(
      path.join(projectPath, '.gitignore'),
      generateGitignoreContent(),
    );
    console.log('✅ .gitignore file created.');
  } catch (error) {
    console.error('❌ Error creating .gitignore file:', error);
  }
  console.log('\n✨ Project setup complete!');
  console.log(`Move into your new project: cd ${projectName}`);
}

program
  .argument('<project-name>', 'The name of the project to create')
  .action((projectName: string) => {
    createProject(projectName);
  });

program
  .command('new')
  .description('Quickly create a new Express API project')
  .argument('<project-name>', 'The name of the project to create')
  .action((projectName: string) => {
    createProject(projectName);
  });

program
  .command('init')
  .option(
    '-t, --template <template>',
    "Specify a template (e.g., 'basic', 'typescript')",
  )
  .argument('[project-name]', 'Name of the project to create')
  .description('Initialize a new project with a template')
  .action((projectName, options) => {
    initProject(options.template, projectName);
  });

const rawArgs = process.argv.slice(2);
if (rawArgs.includes('--h')) {
  console.log(`
Usage: auto-express <project-name>
       auto-express new <project-name>
       auto-express init --template <template> [project-name]

Options:
  -h, --help          Display this help message.
  -V, --version       Output the version number.
`);
  process.exit(0);
}

program.parse(process.argv);
