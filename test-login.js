const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  await page.goto('http://localhost:5174/');
  console.log('Navigated to site');
  
  // Click lock icon
  await page.locator('nav button').click();
  console.log('Clicked login icon');

  // Wait for login form
  await page.waitForSelector('input[type="password"]');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  console.log('Submitted login');

  await page.waitForTimeout(2000); // wait for render
  console.log('Done waiting');
  await browser.close();
})();
