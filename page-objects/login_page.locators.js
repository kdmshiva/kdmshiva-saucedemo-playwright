const { expect } = require('@playwright/test')
const { basePage } = require('./base_page.locators')


// Create page class
exports.loginPage = class LoginPage extends basePage {
    /**
    * 
    * @param {import ('@playwright/test').Page} page  
    */

    constructor(page) {
        super(page)
        this.page = page
        this.loginPageTitle = page.locator('.login_logo')
        this.userName = page.locator('[data-test="username"]')
        this.usrPassword = page.locator('[data-test="password"]')
        this.btnLogin = page.getByRole('button', { name: 'Login' })
        this.loginErrorMsg = page.locator('[data-test="error"]')
    }

    async userLogin(credentials) {
        await this.userName.fill(credentials.username)
        await this.usrPassword.fill(credentials.password)
        await this.btnLogin.click()
    }


    async getLoginErrorMsg() {
        await this.loginErrorMsg.waitFor({ state: 'visible' })
        return (await this.loginErrorMsg.textContent()).trim()
    }
}