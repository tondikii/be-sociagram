const { execSync } = require('child_process');

try {
  // Run Sequelize migrations
  execSync('npx sequelize-cli db:migrate');
  console.log('Sequelize migrations executed successfully.');
} catch (error) {
  console.error('Error running Sequelize migrations:', error);
  process.exit(1);
}
