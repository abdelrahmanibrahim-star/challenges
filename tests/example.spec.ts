import { test, expect } from '@playwright/test';
import fs from'fs';
import { beforeEach } from 'node:test';
import path from 'path';

test.describe('Test Challenges', () => {
  test.beforeEach(async ({ page }) => {
  await page.goto('auth/login');
  await page.getByRole('textbox', { name: 'Email' }).fill('abdelrahman.ibrahim@intellaworld.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('@Aa12345');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('#notistack-snackbar')).toContainText('Login successful!',{ timeout: 20000 });
  });
test('1-Upload File and Interact with drop down', async ({ page }) => {
  await page.getByTestId('upload file-tab').click();
  await page.getByRole('combobox', { name: 'Select a project' }).click();
  await page.locator(`//li[contains(. , '27_11_cloud (call)')]`).click();
  await page.getByRole('combobox', { name: 'Select an agent' }).click();
  await page.locator(`//li[contains(. , 'abdelrahman.ibrahim@intellaworld.com (supervisor)')]`).click();
  await page.getByTestId('upload-file-input').setInputFiles('./files/Calls_Arab_Bank_calls_1.wav');
  await page.getByTestId('start-processing-btn').click();
  await expect(page.locator(`[class='MuiTypography-root MuiTypography-body1 css-9w0uuq']`)).toHaveText('Processing started!')
});
test('2-Scrolling', async ({ page }) => {
  await page.getByTestId('all calls-tab').click();
  await page.locator('[aria-label="Go to page 2"]').click();
 // await page.mouse.wheel(0, 1000);
//we don`t need to  scrolling in  playwrite

});
test('3-Search', async ({ page }) => {
  await page.locator(`//p[contains(. , 'Customer satisfaction')]`).waitFor({ state: 'visible' });
  await expect(page.locator(`//p[contains(. , 'Customer satisfaction')]`)).toBeVisible({timeout:10000});
  await page.getByRole('combobox', { name: 'Without label' }).click();
  await page.getByRole('option', { name: 'Transcription' }).click();
   await page.locator('[placeholder="Search..."]').click();
  await page.locator('[placeholder="Search..."]').fill('السلام عليكم');
  await page.locator('[aria-label="Search"]').click();
  await expect(page.locator('[class="MuiBox-root css-1x9qqrq"]')).toContainText('السلام عليكم');
});
test('4-Filterations', async ({ page }) => {
  await expect(page.locator(`//p[contains(. , 'Customer satisfaction')]`)).toBeVisible();
  await page.locator(`//div[@class="MuiBox-root css-yivtgr" and ./p [contains( . , 'Project')]]`).click();
  await page.getByRole('button', { name: '27_11_cloud' }).click();
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.locator(`//div[@class="MuiBox-root css-yivtgr" and ./p [contains( . , 'Project')]]`).filter( {has:page.locator(`[class="MuiTypography-root MuiTypography-body1 css-zqw61f"]`)})).toContainText('1');
  await page.getByTestId('all calls-tab').click();
  await page.locator('div').filter({ hasText: /^Project$/ }).click();
  await page.getByRole('button', { name: '27_11_cloud' }).click();
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.locator(`//div[@class="MuiBox-root css-yivtgr" and ./p [contains( . , 'Project')]]`).filter( {has:page.locator(`[class="MuiTypography-root MuiTypography-body1 css-zqw61f"]`)})).toContainText('1');
  //await expect(page.locator('tbody')).toContainText('27_11_cloud');
  const rows = page.locator('[class="MuiTypography-root MuiTypography-body1 MuiTypography-alignLeft css-96149b"]');
const count = await rows.count();
for (let i = 0; i < count; i++) {
  const row = rows.nth(i);
  await expect(row).toBeVisible();
  await expect(row).toContainText('27_11_cloud');
}
});
test('5-DatePacker', async ({ page }) => {
const startDate = new Date(2025, 12, 1);  // December = 11
const endDate = new Date(2025, 12, 10);
  await expect(page.locator(`//p[contains(. , 'Customer satisfaction')]`)).toBeVisible({timeout:30000});
  await page.getByTestId('all calls-tab').click();
  await page.getByRole('button', { name: 'Interact with the calendar' }).click();
  await page.getByRole('button', { name: 'Choose Monday, December 1,' }).click();
  await page.getByRole('button', { name: 'Choose Wednesday, December 10' }).click();
  await page.getByTestId('confirm-btn').click();
  await expect(page.getByAltText('view icon').first()).toBeVisible();
const elements = page.locator('[class="MuiTypography-root MuiTypography-body1 MuiTypography-alignLeft css-1cyrlhr"]');
const count = await elements.count();
console.log("count is = ",count);
for (let i = 0; i < count; i++) {
  const text = await elements.nth(i).textContent();
  if (!text) throw new Error(`Element ${i} has no text`);
  // Extract date in DD/MM/YYYY
  const [datePart] = text.match(/\d{1,2}\/\d{1,2}\/\d{4}/) || [];
  if (!datePart) throw new Error(`No date found in element ${i}`);
  const [day, month, year] = datePart.split('/').map(Number);
  const date = new Date(year, month, day);
  // Assert the date is in range
  expect(date >= startDate && date <= endDate).toBe(true);
}
});
test('6-Export file', async ({ page }) => {
   await expect(page.locator(`//p[contains(. , 'Customer satisfaction')]`)).toBeVisible({timeout:30000});
   await page.getByTestId('export-calls-btn').click();
   await page.getByRole('radio', { name: 'Excel file(This will export' }).check();
  const [download] = await Promise.all([
    page.waitForEvent('download'),       // wait for download event
    page.getByTestId('export-btn').click(),         // trigger the download
  ]);
  const filePath = path.join('./downloads', download.suggestedFilename());
  await download.saveAs(filePath);
  const fileName = download.suggestedFilename();
expect(fileName).toBe('dashboard-analysis.xlsx');
  expect(fs.existsSync(filePath)).toBe(true);
});

test('7-Interact with pagination', async ({ page }) => {
  await page.getByTestId('all calls-tab').click();
  await page.getByRole('button', { name: 'Go to page 2' }).click();
  await expect(page.locator('[class="MuiBox-root css-1ho43uv"]')).toContainText('2 of')
  await expect(page).toHaveURL('/all-calls?pageNumber=2');
  await expect(page.locator('[aria-label="page 2"]')).toHaveAttribute('aria-current', "true");
  await page.getByRole('button', { name: 'Go to page 3' }).click();
  await expect(page).toHaveURL('/all-calls?pageNumber=3');
  await expect(page.locator('[aria-label="page 3"]')).toHaveAttribute('aria-current', "true");
  await page.locator(`//input[@inputmode="numeric"]`).click();
  await page.locator(`//input[@inputmode="numeric"]`).fill('4');
  await page.getByRole('spinbutton').press('Enter');
  await expect(page).toHaveURL('/all-calls?pageNumber=4');
  await expect(page.locator('[aria-label="page 4"]')).toHaveAttribute('aria-current', "true");

});


});