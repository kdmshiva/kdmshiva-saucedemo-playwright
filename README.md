# Playwright Automated Testing for SauceDemo

This repository contains automated tests for the SauceDemo e-commerce website using Playwright. These tests cover various scenarios, including user login, product management, and checkout processes.

## Getting Started

To run the automated tests locally, follow these steps:

Clone this repository to your local machine:

git clone https://github.com/your-username/kdmshiva-saucedemo-playwright.git

## Install project dependencies:
npm install

## Run the tests:

npm playwright test

## Features

Login and authentication tests

Product management and shopping cart tests

Checkout process tests

Cross-browser testing (Chromium, Firefox, WebKit)

Data-driven testing

## Project Structure

The project adopts a structured approach to maintainability and scalability. Here's an overview of the project's directory structure:

demo/
├── .gitignore
├── package.json
├── playwright.config.js
├── .github/
│   └── workflows/
│       └── playwright.yml         # GitHub Actions for CI
├── page-objects/
│   ├── base_page.locators.js     # Base/shared locators (e.g., page title)
│   ├── login_page.locators.js    # Login page locators + userLogin method
│   └── products_page.locators.js # Product page locators
├── tests/
│   ├── login.spec.js             # Login test cases (valid + invalid)
│   └── products.spec.js          # Product-related test validations


