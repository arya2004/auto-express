import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { getDatabaseConfig } from "./database.js";
import {
  createFileStructure,
  createAppFile,
  createWeatherFiles,
  createDockerfile,
  createDockerCompose,
  createDockerignore
} from "./generateFiles.js";


export const createProject = (
  folderName,
  structure,
  database,
  renderEngine,
  dockerSupport,
  isFlat = false
) => {
  const currentPath = process.cwd();

  const apiPath = path.join(currentPath, folderName);

  createFileStructure(apiPath, structure, renderEngine, isFlat);

  const databaseConfig = getDatabaseConfig(database);
  createAppFile(apiPath, databaseConfig, structure, renderEngine, isFlat);
  createWeatherFiles(
    path.join(apiPath, isFlat ? "" : "models"),
    path.join(apiPath, isFlat ? "" : "controllers"),
    path.join(apiPath, isFlat ? "" : "routes"),
    isFlat
  );

  // Setup for Docker
  createDockerfile(apiPath,dockerSupport);
  createDockerCompose(apiPath,database,dockerSupport);
  createDockerignore(apiPath,dockerSupport);


  const readme = path.join(apiPath, "README.md");
  const envr = path.join(apiPath, ".env");
  const ignore = path.join(apiPath, ".gitignore");

  fs.writeFileSync(readme, `# ${folderName}`);
  fs.writeFileSync(
    envr,
    `

# Database URIs
MONGO_URI=mongodb://localhost:27017/${folderName}
POSTGRES_URI=postgresql://localhost/${folderName}
MYSQL_URI=mysql://root:password@localhost/${folderName}
SQLSERVER_USER=your_user
SQLSERVER_PASSWORD=your_password
SQLSERVER_SERVER=localhost
SQLSERVER_DATABASE=${folderName}

`
  );
  fs.writeFileSync(
    ignore,
    `

node_modules
.env
`
  );


  let installCommand = `cd ${folderName} && npm init -y && npm install express ${
    database === "MongoDB"
      ? "mongoose"
      : database === "Postgres"
      ? "pg"
      : database === "MySQL"
      ? "mysql2"
      : "mssql"
  }`;

  if (structure === "MVC") {
    installCommand += ` ${
      renderEngine === "EJS"
        ? "ejs"
        : renderEngine === "PUG"
        ? "pug"
        : "express-handlebars"
    }`;

  }

  // Execute the npm install command
  exec(installCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error installing dependencies: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Dependency installation error: ${stderr}`);
      return;
    }
    console.log(`Dependencies installed successfully:\n${stdout}`);
  });
};
