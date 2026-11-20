const sharp = require('sharp');
const fs = require('fs');

(async () => {
  const buf = await sharp('../public/gticc_logo_new.webp').resize(64, 64).png().toBuffer();
  const b64 = buf.toString('base64');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <image href="data:image/png;base64,${b64}" width="64" height="64" />
</svg>
`;
  fs.writeFileSync('../public/favicon.svg', svg);
  console.log('GTICC favicon.svg updated successfully!');
})();
