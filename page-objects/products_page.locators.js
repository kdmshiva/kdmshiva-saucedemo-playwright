const { expect } = require('@playwright/test')
const { basePage } = require('./base_page.locators')


// Create page class
exports.productsPage = class ProductsPage extends basePage {
    /**
    * 
    * @param {import ('@playwright/test').Page} page  
    */

    constructor(page) {
        super(page);
        this.page = page;
        this.pageTile = page.locator('[data-test="username"]');
        this.sortType = page.locator('[data-test="product-sort-container"]');
        this.productName = page.locator('.inventory_item_name');
        this.productPrice = page.locator('.inventory_item_price');
        this.shoppingCart = page.locator('.shopping_cart_container');
        this.cartItem = page.locator('.cart_item');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.customerFirstName = page.locator('[data-test="firstName"]');
        this.customerLastName = page.locator('[data-test="lastName"]');
        this.customerPostalCode = page.locator('[data-test="postalCode"]');
        this.btnContinue = page.locator('[data-test="continue"]');
        this.checkoutSummary = page.locator('#checkout_summary_container');
        this.btnFinish = page.locator('[data-test="finish"]');
        this.completeMessage = page.locator('.complete-header');

    }

    async selectSortOption(srtType) {
        await this.sortType.selectOption({ label: srtType });
        await this.page.waitForTimeout(2000)
    }

    async getProductNames() {
        return await this.productName.allTextContents();
    }
    /**
     * This function is to get all the products prices in products list
     * @returns 
     */

    async getProductPrices() {
        const pricesText = await this.productPrice.allTextContents();
        return pricesText.map(price => parseFloat(price.replace('$', '')));
    }
/**
 * This function is to select the product, add into cart and  retun the selected productname, prices
 * @param {*} itemName 
 * @returns 
 */
    async addProductToCart(itemName) {
        const selectedProduct = []
        const items = this.page.locator('.inventory_item');
        const count = await items.count();

        for (let i = 0; i < count; i++) {
            const item = items.nth(i);
            const name = await item.locator('.inventory_item_name').textContent();
            const price = await item.locator('.inventory_item_price').textContent();
            selectedProduct.push(name.trim());
            selectedProduct.push(price.trim());
            if (name.trim() === itemName) {
                const addToCartButton = item.locator('button');
                await addToCartButton.click();
                 await this.page.waitForTimeout(2000)
                await expect(addToCartButton).toHaveText('Remove');
                break;
            }
        }
        return selectedProduct;
    }
    /**
     * This 
     * @returns 
     */
    async getCartItemCount() {
        const cartBadge = this.shoppingCart.locator('.shopping_cart_badge');
        if (await cartBadge.isVisible()) {
            return parseInt(await cartBadge.textContent());
        }
        return 0;
    }
    async goToCart() {
        await this.shoppingCart.click();
         await this.page.waitForTimeout(2000)
        await expect(this.page).toHaveURL('/cart.html');
    }
/**
 * 
 * @param {*} productName 
 * @param {*} productPrice 
 */
    async verifyProductInCart(productName, productPrice) {
        const itemName = await this.cartItem.locator('.inventory_item_name').textContent();
        const itemPrice = await this.cartItem.locator('.inventory_item_price').textContent();
        expect(itemName.trim()).toBe(productName);
        expect(itemPrice.trim()).toBe(productPrice);
    }
    async goToCheckout() {
        await this.checkoutButton.click();
        await expect(this.page).toHaveURL('/checkout-step-one.html');
    }
    async enterCustomerDetails(firstName, lastName, postalCode) {
        await this.customerFirstName.fill(firstName);
        await this.customerLastName.fill(lastName);
        await this.customerPostalCode.fill(postalCode);
    }
    /**
     * Tthis function is to click on continue button
     */
    async submitCustomerDetails() {
        await this.btnContinue.click();
         await this.page.waitForTimeout(2000)
        await expect(this.page).toHaveURL('/checkout-step-two.html');
    }
    /**
     * Tthis function is to get the checkout information in checkout overview page
     * @returns 
     */
    async getCheckoutOverviewDetails() {
        const productInfo = this.checkoutSummary.locator('.cart_item_label');
        const summaryValues = this.checkoutSummary.locator('.summary_info .summary_value_label');

        const productName = (await productInfo.locator('.inventory_item_name').textContent()).trim();
        const productPrice = (await productInfo.locator('.inventory_item_price').textContent()).trim();

        const summaryTextList = await summaryValues.allTextContents();
        const summaryCleaned = summaryTextList.map(text => text.trim());

        return {
            productName,
            productPrice,
            summaryValues: summaryCleaned,
        };

    }
    /**
     * This function is to click on FIinish button checkout overview page
     */
    async completeCheckout() {
        await this.btnFinish.click();
         await this.page.waitForTimeout(2000)
        await expect(this.page).toHaveURL('/checkout-complete.html');
    }


}