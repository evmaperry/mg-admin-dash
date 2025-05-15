const fs = require('fs');
const path = require('path');

function copyFiles(sourceDir: string, destDir: string) {
  // Ensure destination directory exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Read all files from source directory
  fs.readdir(sourceDir, (err:Error, files: any[]) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach((file) => {
      const sourceFile = path.join(sourceDir, file);
      const destFile = path.join(destDir, file);

      // If the destination file doesn't already exist...
      if (!fs.existsSync(destFile)) {
        // ...copy the file
        fs.copyFile(sourceFile, destFile, (err:Error) => {
          if (err) {
            console.error('Error copying file:', err);
          } else {
            console.log(
              `File copied successfully: ${sourceFile} -> ${destFile}`
            );
          }
        });
      }
    });
  });
}

const sourceDirectory = 'node_modules/mgmarkers/markerImages';
const destinationDirectory = 'public/assets/images';

copyFiles(sourceDirectory, destinationDirectory);
