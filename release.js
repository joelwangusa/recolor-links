import bestzip from 'bestzip';
import { readFile } from 'fs/promises';

async function createZip() {
  const packageJson = JSON.parse(await readFile(new URL('./package.json', import.meta.url), 'utf8'));
  const version = packageJson.version;
  const name = packageJson.name;
  const timestamp = new Date().toISOString().replace(/[:\-T]/g, '').split('.')[0];
  const filename = `./${name}-v${version}-${timestamp}.zip`;

  bestzip({
    source: ['./dist/*', './images/*', 'manifest.json'],
    destination: `dist/${filename}`,
  }).then(function() {
    console.log('Zip file was created successfully');
  }).catch(function(err) {
    console.error(err.stack);
  });
}

createZip();