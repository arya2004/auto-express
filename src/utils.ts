export function generateGitignoreContent(): string {
  return `# Node modules
/node_modules

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*

# Build output
/dist
/build

# Environment variables
.env
  `.trim();
}
