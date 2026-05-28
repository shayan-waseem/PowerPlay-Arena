const fs = require('fs');
const path = require('path');

const targets = [
  path.join(__dirname, 'backend'),
  path.join(__dirname, 'admin-portal'),
  path.join(__dirname, 'mobile-app'),
  path.join(__dirname, 'docker-compose.yml')
];

targets.forEach(target => {
  if (fs.existsSync(target)) {
    try {
      const stat = fs.statSync(target);
      if (stat.isDirectory()) {
        fs.rmSync(target, { recursive: true, force: true });
        console.log(`Successfully deleted directory: ${target}`);
      } else {
        fs.unlinkSync(target);
        console.log(`Successfully deleted file: ${target}`);
      }
    } catch (err) {
      console.error(`Failed to delete ${target}: ${err.message}`);
    }
  } else {
    console.log(`Target does not exist: ${target}`);
  }
});
