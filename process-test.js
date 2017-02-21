const spawn = require('child_process').spawn;
const execFile = require('child_process').execFile;

const child = execFile('C:\\Users\\Andros Yang\\Desktop\\SmashladderCustom\\Binary\\x64\\Dolphin.exe', [], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
});

child.stdout.on('data', function(data) {
    console.log(data.toString()); 
});

child.on('error', (err) => {
  console.log('Failed to start child process.');
});