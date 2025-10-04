import fs from 'fs-extra';
import path from 'path';

export async function initProject(templateName = 'basic', projectName?: string) {
  const templateDir = path.resolve(__dirname, '../templates', templateName);

  if (!fs.existsSync(templateDir)) {
    console.error(`❌ Template "${templateName}" not found.`);
    process.exit(1);
  }

  const finalProjectName = projectName || 'my-express-app';
  
  const targetDir = path.join(process.cwd(), finalProjectName);

  if (fs.existsSync(targetDir)) {
    console.error(`❌ Directory "${finalProjectName}" already exists.`);
    process.exit(1);
  }

  await fs.ensureDir(targetDir);
  
  console.log(`📦 Creating project "${finalProjectName}" using "${templateName}" template...`);

  await fs.copy(templateDir, targetDir, {
    overwrite: false,
    errorOnExist: false,
  });

  console.log(`✅ Project initialized in ./${finalProjectName}!`);
}
