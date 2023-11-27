const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('http://5.189.186.217/login/');
  await expect(page).toHaveTitle("Client");
  
  //const email = page.locator('#email');

});

import { ApiHelper } from "../tests/apiHelper";

let token: string;
let categoryId: string;

test.beforeAll(async () => {
  token = await ApiHelper.getToken({
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
  });
});

test.beforeEach(async ({page}) => {
  page.addInitScript((value) => {
    window.localStorage.setItem("auth-token", value);
  }, token);
  await page.goto("/overview");
  
});

test("Create a category with positions", async ({page}) => {

  const categoriesMenuItem = page
    .getByRole("listitem")
    .filter({ hasText: "Асортимент" });
  const categoriesListElements = page
    .locator("app-categories-page")
    .getByRole("link");
  const addCategoryBtn = page.getByText("Додати категорію");
  const categoryName = page.locator("#name");
  await categoriesMenuItem.click();
  await page.waitForLoadState('networkidle');
  await addCategoryBtn.click();
  await categoryName.fill("PW Test category");
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByText("Завантажити зображення").click();
  const fileChooser = await fileChooserPromise;
 await fileChooser.setFiles("image.jpg");
  const responsePromise = page.waitForResponse('/api/category');
  await page.getByText("Зберегти зміни").click();
  const response = await responsePromise;
  const parsed = await response.json();
  categoryId = parsed._id;


  await page.waitForLoadState('networkidle');
  const data = {
    name: "TEST POSITION",
    cost: 100,
    category: categoryId
  };
  const response1 = await ApiHelper.createPosition(token, data);
  console.log(response1);
});

