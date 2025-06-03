// @ts-check
import { test, expect } from '@playwright/test';
import { basePage } from '../page-objects/base_page.locators.js';
import { loginPage } from '../page-objects/login_page.locators.js';
import { productsPage } from '../page-objects/products_page.locators.js';


test.describe('Login Scenarios', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC1|Valid Login', async ({ page }) => {
    const userDetails = {
      username: 'standard_user',
      password: 'secret_sauce',
    };
    const commonPage = new basePage(page);
    const login = new loginPage(page);
    await login.userLogin(userDetails);
    await expect(page).toHaveURL('/inventory.html');
    await expect(commonPage.pageTitle).toContainText('Products');
  });

  test('TC2| Invalid Login | Locked Out User', async ({ page }) => {
    const userDetails = {
      username: 'locked_out_user',
      password: 'secret_sauce',
      errorMsg: 'Sorry, this user has been locked out',
    };
    const commonPage = new basePage(page);
    const login = new loginPage(page);
    await login.userLogin(userDetails);
    await expect(login.loginPageTitle).toBeVisible();
    await expect(login.loginErrorMsg).toContainText(userDetails.errorMsg);
  });

  test('TC3| Invalid Login | User Not In Service', async ({ page }) => {
    const userDetails = {
      username: 'nonexistent_user',
      password: 'secret_sauce',
      errorMsg: 'Username and password do not match any user in this service',
    };
    const commonPage = new basePage(page);
    const login = new loginPage(page);
    await login.userLogin(userDetails);
    await expect(login.loginPageTitle).toBeVisible();
    await expect(login.loginErrorMsg).toContainText(userDetails.errorMsg);
  });

  test('TC4| Invalid Login |Blank Username', async ({ page }) => {
    const userDetails = {
      username: '',
      password: 'secret_sauce',
      errorMsg: ' Username is required',
    };
    const commonPage = new basePage(page);
    const login = new loginPage(page);
    await login.userLogin(userDetails);
    await expect(login.loginPageTitle).toBeVisible();
    await expect(login.loginErrorMsg).toContainText(userDetails.errorMsg);
  });

  test('TC5| Invalid Login |Blank Password', async ({ page }) => {
    const userDetails = {
      username: 'standard_user',
      password: '',
      errorMsg: 'Password is required',
    };
    const commonPage = new basePage(page);
    const login = new loginPage(page);
    await login.userLogin(userDetails);
    await expect(login.loginPageTitle).toBeVisible();
    await expect(login.loginErrorMsg).toContainText(userDetails.errorMsg);
  });



});