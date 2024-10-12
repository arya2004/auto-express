import fs from "fs";
import path from "path";
import yaml from "js-yaml";

// Function to create the file structure for the API
export const createFileStructure = (
  apiPath,
  structure,
  renderEngine,
  isFlat = false
) => {
  // Define paths for various directories
  const controllerPath = isFlat ? apiPath : path.join(apiPath, "controllers");
  const routePath = isFlat ? apiPath : path.join(apiPath, "routes");
  const modelPath = isFlat ? apiPath : path.join(apiPath, "models");
  const dtoPath = isFlat ? apiPath : path.join(apiPath, "dto");
  const midPath = isFlat ? apiPath : path.join(apiPath, "middleware");
  const utilsPath = isFlat ? apiPath : path.join(apiPath, "utils");
  const viewPath = path.join(apiPath, "views");

  // Create directories recursively
  [
    apiPath,
    controllerPath,
    routePath,
    modelPath,
    dtoPath,
    midPath,
    utilsPath,
  ].forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

  // Function to get the view template based on the selected render engine
  if (structure === "MVC") {
    fs.mkdirSync(viewPath);
    let viewTemplate;
    switch (renderEngine) {
      case "EJS":
        viewTemplate = "<h1>Weather Info</h1><p><%= weather %></p>";
        break;
      case "PUG":
        viewTemplate = "h1 Weather Info\np #{weather}";
        break;
      case "Handlebars":
        viewTemplate = "<h1>Weather Info</h1><p>{{weather}}</p>";
        break;
      default:
        throw new Error("Unsupported render engine selected");
    }
    // Write the view template file based on selected render engine
    fs.writeFileSync(
      path.join(viewPath, `index.${renderEngine.toLowerCase()}`),
      viewTemplate
    );
  }
};

// Function to create the main application file

export const createAppFile = (
  apiPath,
  databaseConfig,
  structure,
  renderEngine,
  isFlat = false
) => {
  const apiFile = path.join(apiPath, "app.js");

  // const renderEngineImport = renderEngine === 'EJS' ? 'ejs' : renderEngine === 'PUG' ? 'pug' : 'express-handlebars';
  const renderEngineImport =
    renderEngine === "EJS"
      ? "ejs"
      : renderEngine === "PUG"
      ? "pug"
      : "express-handlebars";
  const renderEngineSetup =
    renderEngine === "Handlebars"
      ? `

const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
`
      : `
app.set('view engine', '${renderEngine.toLowerCase()}');
`;

  const appContent = `
const express = require('express');
${databaseConfig.importStatement}

const app = express();

app.use(express.json());

${databaseConfig.connectionCode}

// Dynamically load routes based on flat option
const weatherRouter = ${
    isFlat ? 'require("./weather")' : 'require("./routes/weather")'
  };
app.use('/api/weather', weatherRouter);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Setup render engine if MVC structure
${structure === "MVC" ? renderEngineSetup : ""}

// MVC structure specific route for rendering weather view
${
  structure === "MVC"
    ? `
app.get('/weather', (req, res) => {
  res.render('index', { weather: 'Sunny with a chance of rain' });
});
`
    : ""
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
`;

  // Write the app.js file
  fs.writeFileSync(apiFile, appContent);
};

// Function to create the weather files
export const createWeatherFiles = (apiPath, isFlat = false) => {
  const modelPath = isFlat ? apiPath : path.join(apiPath, "models");
  const controllerPath = isFlat ? apiPath : path.join(apiPath, "controllers");
  const routePath = isFlat ? apiPath : path.join(apiPath, "routes");

  const weatherModel = `
const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  temperature: Number,
  condition: String,
  location: String,
  date: { type: Date, default: Date.now },
});

const Weather = mongoose.model('Weather', weatherSchema);
module.exports = Weather;
`;

  const weatherController = `
const Weather = ${
    isFlat ? 'require("./weatherModel")' : 'require("../models/weatherModel")'
  };

exports.getWeather = async (req, res) => {
  try {
    const weather = await Weather.find();
    res.json(weather);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
`;

  const weatherRoute = `
const express = require('express');
const router = express.Router();
const weatherController = ${
    isFlat
      ? 'require("./weatherController")'
      : 'require("../controllers/weatherController")'
  };

router.get('/', weatherController.getWeather);

module.exports = router;
`;

  // Write model, controller, and route files
  fs.writeFileSync(path.join(modelPath, "weatherModel.js"), weatherModel);
  fs.writeFileSync(
    path.join(controllerPath, "weatherController.js"),
    weatherController
  );
  fs.writeFileSync(path.join(routePath, "weather.js"), weatherRoute);
};

//Function to create Dockerfile
export const createDockerfile = (apiPath, dockerSupport = 'No') => {
  if (dockerSupport == 'Yes') {
    const dockerfileContent = `
FROM node:22-alpine3.19
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
`;
    fs.writeFileSync(path.join(apiPath, "Dockerfile"), dockerfileContent.toString().trim());
  }
};

//Function to create Docker-Compose
export const createDockerCompose = (apiPath, database, dockerSupport = 'No') => {
  const baseConfig = {
    services: {
      api: {
        build: {
          context: apiPath,
          dockerfile: "Dockerfile",
        },
        ports: ["3000:3000"],
        depends_on: ["db"],
        environment: {},
      },
    },
    volumes: {},
  };

  let dbConfig;
  switch (database.toLowerCase()) {
    case "mongodb":
      dbConfig = {
        image: "mongo:latest",
        ports: ["27017:27017"],
        volumes: ["mongodb_data:/data/db"],
      };
      baseConfig.volumes.mongodb_data = null;
      break;
    case "postgresql":
      dbConfig = {
        image: "postgres:latest",
        ports: ["5432:5432"],
        environment: {
          POSTGRES_DB: "myapp",
          POSTGRES_USER: "admin",
          POSTGRES_PASSWORD: "root",
        },
        volumes: ["postgres_data:/var/lib/postgresql/data"],
      };
      baseConfig.volumes.postgres_data = null;
      break;
    case "mysql":
      dbConfig = {
        image: "mysql:latest",
        ports: ["3306:3306"],
        environment: {
          MYSQL_DATABASE: "myapp",
          MYSQL_USER: "user",
          MYSQL_PASSWORD: "password",
          MYSQL_ROOT_PASSWORD: "rootpassword",
        },
        volumes: ["mysql_data:/var/lib/mysql"],
      };
      baseConfig.volumes.mysql_data = null;
      break;
    case "sqlserver":
      dbConfig = {
        image: "mcr.microsoft.com/mssql/server:latest",
        ports: ["1433:1433"],
        environment: {
          ACCEPT_EULA: "Y",
          SA_PASSWORD: "YourStrong!Passw0rd",
          MSSQL_PID: "Express",
        },
        volumes: ["sqlserver_data:/var/opt/mssql"],
      };
      baseConfig.volumes.sqlserver_data = null;
      break;
    default:
      throw new Error(`The ${database} is not supported`);
  }

  baseConfig.services.db = dbConfig;

  // Add database-specific environment variables to the API service
  switch (database.toLowerCase()) {
    case "mongodb":
      baseConfig.services.api.environment.DB_URI = "mongodb://db:27017/myapp";
      break;
    case "postgresql":
      baseConfig.services.api.environment.DB_URI =
        "postgresql://admin:root@db:5432/myapp";
      break;
    case "mysql":
      baseConfig.services.api.environment.DB_URI =
        "mysql://user:password@db:3306/myapp";
      break;
    case "sqlserver":
      baseConfig.services.api.environment.DB_URI =
        "mssql://sa:YourStrong!Passw0rd@db:1433/myapp";
      break;
  }

  const composeContent = yaml.dump(baseConfig);

  if (dockerSupport == 'Yes') {
    fs.writeFileSync(path.join(apiPath, "docker-compose.yml"), composeContent);
  }
};

//Function to create Docker Ignore
export const createDockerignore = (apiPath, dockerSupport = 'No') => {
  if (dockerSupport == 'Yes') {
    const dockerignoreContent = `
.env.*
node_modules
.gitignore
dist
build
`;
    fs.writeFileSync(path.join(apiPath, ".dockerignore"), dockerignoreContent.trim());
  }
};