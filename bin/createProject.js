#!/usr/bin/env node

import {
  getProjectName,
  selectDb,
  selectStructure,
  selectRenderEngine,
  selectDocker,
} from "../interactive.js";
import { createProject } from "../lib/setup.js";

// Extract command line arguments
const args = process.argv.slice(2); // Exclude 'node' and script name

(async () => {
  const isFlat = args.includes("--flat");
  if (args[0] === "init") {
    const projectName = await getProjectName();
    const structure = await selectStructure();
    const database = await selectDb();
    const renderEngine = await selectRenderEngine();
    const dockerSupport = await selectDocker()
    createProject(projectName, structure, database, renderEngine, dockerSupport, isFlat);
  }
  if (args[0] === "new") {
    const folderName = args[1];
    createProject(folderName, "API", "MongoDB", "EJS", "No", isFlat);

  }
})();
