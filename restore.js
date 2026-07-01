import { execSync } from 'child_process';
try {
  console.log('--- GIT STATUS ---');
  console.log(execSync('git status', { encoding: 'utf8' }));
  
  console.log('--- ATTEMPTING RESTORE ---');
  console.log(execSync('git checkout -- src/pages src/hooks src/routes src/layouts', { encoding: 'utf8' }));
  
  console.log('--- GIT STATUS AFTER ---');
  console.log(execSync('git status', { encoding: 'utf8' }));
} catch (err) {
  console.error('Error executing git commands:', err.stdout || err.message);
}
