<div align="center">

# Express Project Generator

<a href="https://www.npmjs.com/package/auto-express">
  <img src="https://img.shields.io/npm/v/auto-express?style=for-the-badge" alt="NPM Version">
</a>
<a href="https://www.npmjs.com/package/auto-express">
  <img src="https://img.shields.io/npm/dt/auto-express?style=for-the-badge" alt="NPM Downloads">
</a>
<a href="https://github.com/arya2004/auto-express/blob/main/LICENSE">
  <img src="https://img.shields.io/npm/l/auto-express?style=for-the-badge" alt="License">
</a>
<a href="https://github.com/arya2004/auto-express/issues">
  <img src="https://img.shields.io/github/issues/arya2004/auto-express?style=for-the-badge" alt="GitHub issues">
</a>

</div>

A generator for Express.js projects with database connections, caching, and MVC/API structures.

```text
   _____          __                                                               
  /  _  \  __ ___/  |_  ____     ____ ___  ________________   ____   ______ ______ 
 /  /_\  \|  |  \   __\/  _ \  _/ __ \\  \/  /\____ \_  __ \_/ __ \ /  ___//  ___/ 
/    |    \  |  /|  | (  <_> ) \  ___/ >    < |  |_> >  | \/\  ___/ \___ \ \___ \  
\____|__  /____/ |__|  \____/   \___  >__/\_ \|   __/|__|    \___  >____  >____  > 
        \/                          \/      \/|__|               \/     \/     \/  

---

## Features

- **Express.js Project Templates**: Generate projects with MVC or API structures.
- **Database Integration**: Connect to major databases like MongoDB, PostgreSQL, MySQL, and SQLServer.
- **View Engine Support**: Optional setup for popular view engines (EJS, Pug, Handlebars) for MVC projects.
- **Demo Included**: Provides a basic weather model, controller, and API endpoint as an example.
- **Customizable**: Interactive CLI allows you to configure projects according to your requirements.

---

## Installation

Install the generator globally to use it as a CLI tool:

```bash
npm install -g auto-express
```

---

## Usage

### **Start an Interactive CLI**

To initialize a new project with interactive prompts:

```bash
auto-express init
```

### **Generate a New Express API Project**

To quickly create a new API project with a specified name:

```bash
auto-express new my-express-api
```

This command sets up a new Express.js API project with MongoDB integration and basic scaffolding.

### **Specify Your Package Manager**

You can choose your preferred package manager (npm, yarn, or pnpm) when creating a project:

```bash
#  npm (default)
auto-express new my-express-api

#  yarn
auto-express new my-express-api --pm yarn

# = pnpm
auto-express new my-express-api --pm pnpm
```

The CLI will display the correct install and run commands based on your chosen package manager.

### **Using Environment Variables**

Many projects need secrets like database URLs or API keys. You can use a .env file along with dotenv.

1. Install dotenv in your project:
   ```bash
   npm install dotenv
   ```
2. Create a .env file in the root of your project:
   Example -
   ```bash
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/mydb
   ```
3. Load variables in your server.js or app.js:

   ```bash
   import express from "express";
   import dotenv from "dotenv";

   dotenv.config();

   const app = express();
   const PORT = process.env.PORT || 3000;

   app.get("/", (req, res) => {
      res.send("Hello from Auto Express 🚀");
   });
   ```

### **Display Help**

To see all available commands and options, use the `--help` flag:

```bash
auto-express --help
```

---

## Contributing

Contributions are welcome! If you'd like to contribute, please check the [Contributing Guide](CONTRIBUTING.md) for guidelines on submitting pull requests, reporting issues, and more.

---

## Code of Conduct

This project follows a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to maintain a welcoming and respectful environment for all contributors and users.

---

## License

MIT. See `LICENSE` for details.

---

Happy coding! 🚀
