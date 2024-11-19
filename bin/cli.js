#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";
import fs from "fs";
import path from "path";

const program = new Command();

// Function to create a new project
async function createNewProject() {
  try {
    const questions = [
      {
        type: "input",
        name: "projectName",
        message: "Enter the project name:",
        validate: (input) => (input.trim() ? true : "Project name cannot be empty"),
      },
      {
        type: "list",
        name: "architecture",
        message: "Choose the project architecture:",
        choices: ["API", "MVC"],
      },
      {
        type: "list",
        name: "cssType",
        message: "Choose the CSS framework:",
        choices: ["None", "Bootstrap", "TailwindCSS"],
      },
      {
        type: "confirm",
        name: "useDocker",
        message: "Do you want to set up Docker?",
        default: false,
      },
      {
        type: "list",
        name: "database",
        message: "Choose the database:",
        choices: ["MongoDB", "MySQL", "None"],
      },
    ];

    const answers = await inquirer.prompt(questions);

    console.log("\nGenerating project with the following configuration:");
    console.log(JSON.stringify(answers, null, 2));

    // Create project directory
    const projectDir = path.join(process.cwd(), answers.projectName);
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir);
    }

    // Create basic files
    const filesToGenerate = [
      `${projectDir}/app.js`,
      `${projectDir}/package.json`,
      answers.useDocker && `${projectDir}/Dockerfile`,
      answers.database !== "None" && `${projectDir}/database-config.js`,
    ].filter(Boolean);

    filesToGenerate.forEach((file) => {
      fs.writeFileSync(file, `// This is the ${path.basename(file)} file.`);
    });

    console.log(`\nProject '${answers.projectName}' created successfully!`);
  } catch (error) {
    console.error("Error generating project:", error.message);
  }
}

// Set up Commander commands
program
  .command("new")
  .description("Create a new project")
  .action(createNewProject);

program
  .command("help")
  .description("Display help information")
  .action(() => {
    program.help();
  });

program.parse(process.argv);

// Display help if no command is provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
