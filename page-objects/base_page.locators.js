const { expect } = require('@playwright/test')
const basePage = require('./base_page.locators.js')

exports.basePage = class BasePage {
    /**
     * 
     * @param {import ('@playwright/test').Page} page  
     */
    constructor(page) {
        this.page = page

        this.pageTitle = page.locator('[data-test="title"]')
    }

    async getPageTitle() {
        await this.pageTitle.waitFor({ state: 'visible' })
        return await this.pageTitle.textContent()
    }
}