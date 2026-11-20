(async () => {
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const fileContent = 'Dummy PDF test content for audit verification';
  const body = 
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="docType"\r\n\r\n` +
    `professional_cert\r\n` +
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="file"; filename="audit_cert_test.pdf"\r\n` +
    `Content-Type: application/pdf\r\n\r\n` +
    `${fileContent}\r\n` +
    `--${boundary}--\r\n`;

  const res = await fetch('http://localhost:3000/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    },
    body: body
  });
  console.log('Upload HTTP status:', res.status);
  const data = await res.json();
  console.log('Upload response:', data);

  if (data.fileUrl) {
    const getRes = await fetch('http://localhost:3000' + data.fileUrl);
    console.log('Fetch from Next.js server:', data.fileUrl, '-> HTTP', getRes.status);
    const content = await getRes.text();
    console.log('Fetched content matches?', content === fileContent);
  }
})().catch(console.error);
