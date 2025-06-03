// @ts-check
import { test, expect } from '@playwright/test';
import { basePage } from '../page-objects/base_page.locators.js';
import { loginPage } from '../page-objects/login_page.locators.js';
import { productsPage } from '../page-objects/products_page.locators.js';

const userDetails = {
  username: 'standard_user',
  password: 'secret_sauce',
};
test.describe('Products Scenarios', () => {

  test.beforeEach(async ({ page }) => {
    //navigates baseURl mentioned in playwright.config
    await page.goto('/');
    //create class page-locator class object
    const commonPage = new basePage(page);
    const login = new loginPage(page);
    //User has to login
    await login.userLogin(userDetails);
    //Verify products screen is displayed
    await expect(page).toHaveURL('/inventory.html');
    await expect(commonPage.pageTitle).toContainText('Products');

  });

  test('TC1-Products | Product Sort Order', async ({ page }) => {
    const products = new productsPage(page);
    // Get default list
    const namesAZ = await products.getProductNames();
    // Step 2: Name Z–A
    await products.selectSortOption('Name (Z to A)');
    const namesZA = await products.getProductNames();
    expect(namesZA).toEqual([...namesAZ].sort().reverse());
    // Step 3: Price Low–High
    await products.selectSortOption('Price (low to high)');
    const pricesLowHigh = await products.getProductPrices();
    expect(pricesLowHigh).toEqual([...pricesLowHigh].sort((a, b) => a - b));
    // Step 4: Price High–Low
    await products.selectSortOption('Price (high to low)');
    const pricesHighLow = await products.getProductPrices();
    expect(pricesHighLow).toEqual([...pricesHighLow].sort((a, b) => b - a));

  });

  test('TC2-Products | Add to Basket | Checkout', async ({ page }) => {
    const products = new productsPage(page);
    //Add product to the cart and verify  'Add Cart' button is changed to 'Remmove' on the selected product
    const selectedItem = await products.addProductToCart('Sauce Labs Backpack');
    expect(selectedItem[0]).toBe('Sauce Labs Backpack');
    expect(selectedItem[1]).toBe('$29.99');
    console.log('Selected Item:', selectedItem);
    //Verify cart badgecount on top right
    expect(await products.getCartItemCount()).toBe(1);
    //Navigate to cart page
    await products.goToCart()
    //Verifying the added product details on cart page
    await products.verifyProductInCart(selectedItem[0], selectedItem[1]);
    //Navigate to checkout page and submit
    await products.goToCheckout()
    await products.enterCustomerDetails('First', 'Last', '8000');
    await products.submitCustomerDetails();
    const overview = await products.getCheckoutOverviewDetails();
    expect(overview.productName).toBe(selectedItem[0]);
    expect(overview.productPrice).toBe(selectedItem[1]);
    // Check summary info (optional)
    expect(overview.summaryValues.length).toBeGreaterThan(0);
    expect(overview.summaryValues[0]).toContain('SauceCard');
    expect(overview.summaryValues[1]).toContain('Free Pony Express Delivery!');

    await products.completeCheckout();
    await expect(products.completeMessage).toBeVisible();
    await expect(products.completeMessage).toContainText('Thank you for your order!');
  });

});