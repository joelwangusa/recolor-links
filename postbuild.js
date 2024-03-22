import fs from 'fs';
import path from 'path';

// Define the directory containing the files to rename
const directoryPath = path.join(process.cwd(), 'dist/assets');
const targetPath = path.join(process.cwd(), 'dist/scripts');

// Check if the target directory exists, if not, create it
if (!fs.existsSync(targetPath)) {
  fs.mkdirSync(targetPath, { recursive: true });
}

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  } 

  // Loop through all the files in the directory
  files.forEach((file) => {
    // Check if the file is one of the files to rename
    if (file.startsWith('content-') || file.startsWith('background-')) {
      // Define the new filename
      const newFilename = file.split('-')[0] + '.js';

      // Define the old and new paths
      const oldPath = path.join(directoryPath, file);
      const newPath = path.join(targetPath, newFilename);

      // Rename the file
      fs.renameSync(oldPath, newPath);
    }
  });
});