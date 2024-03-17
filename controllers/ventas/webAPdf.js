const playwright = require('playwright');


const generatePdfBase64FromHtml = async (reportPath) => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:3000${reportPath}`);
  const buffer = await page.pdf({ format: 'A4' });
  const base64 = buffer.toString('base64');
  await browser.close();

  return `data:application/pdf;base64,${base64}`;
};

module.exports = {
    generatePdfBase64FromHtml
};