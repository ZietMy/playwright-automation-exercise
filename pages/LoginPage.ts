import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // --- Form Signup ---
  readonly newUserHeader: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupBtn: Locator;
  readonly signupErrorMessage: Locator; // Thông báo lỗi khi đăng ký trùng email

  // --- Form Login ---
  readonly loginHeader: Locator;
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginBtn: Locator;
  readonly loginErrorMessage: Locator; // Thông báo lỗi khi sai email/pass

  // --- Detailed Signup Form ---
  readonly enterAccountInfoHeading: Locator;
  readonly titleMrRadio: Locator;
  readonly passwordInput: Locator;
  readonly daysSelect: Locator;
  readonly monthsSelect: Locator;
  readonly yearsSelect: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly addressInput: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountBtn: Locator;
  readonly accountCreatedHeading: Locator;
  readonly continueBtn: Locator;

  constructor(page: Page) {
    super(page);

    // Initial Signup Locators
    this.newUserHeader = page.getByRole('heading', { name: 'New User Signup!' });
    this.signupNameInput = page.getByPlaceholder('Name');
    this.signupEmailInput = page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address');
    this.signupBtn = page.getByRole('button', { name: 'Signup' });
    this.signupErrorMessage = page.locator('form').filter({ hasText: 'Signup' }).locator('p');

    // Login Locators
    this.loginHeader = page.getByRole('heading', { name: 'Login to your account' });
    this.loginEmailInput = page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address');
    this.loginPasswordInput = page.getByPlaceholder('Password');
    this.loginBtn = page.getByRole('button', { name: 'Login' });
    this.loginErrorMessage = page.locator('form').filter({ hasText: 'Login' }).locator('p');

    // Detailed Registration Form Locators
    this.enterAccountInfoHeading = page.getByRole('heading', { name: 'Enter Account Information' });
    this.titleMrRadio = page.getByLabel('Mr.');
    this.passwordInput = page.getByLabel('Password *');
    this.daysSelect = page.locator('#days');
    this.monthsSelect = page.locator('#months');
    this.yearsSelect = page.locator('#years');
    
    this.firstNameInput = page.getByLabel('First name *');
    this.lastNameInput = page.getByLabel('Last name *');
    this.companyInput = page.locator('[data-qa="company"]');
    this.addressInput = page.locator('[data-qa="address"]');
    this.countrySelect = page.getByLabel('Country *');
    this.stateInput = page.getByLabel('State *');
    this.cityInput = page.getByLabel('City *');
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileNumberInput = page.getByLabel('Mobile Number *');
    this.createAccountBtn = page.getByRole('button', { name: 'Create Account' });
    this.accountCreatedHeading = page.getByText('ACCOUNT CREATED!');
    this.continueBtn = page.getByRole('link', { name: 'Continue' });
  }

  // --- Actions ---

  async fillInitialSignup(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupBtn.click();
  }

  async login(email: string, password: string) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginBtn.click();
  }

  async fillAccountDetails(details: any) {
    await expect(this.enterAccountInfoHeading).toBeVisible();
    await this.titleMrRadio.check();
    await this.passwordInput.fill(details.password);

    await this.daysSelect.selectOption(details.day);
    await this.monthsSelect.selectOption(details.month);
    await this.yearsSelect.selectOption(details.year);

    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    if (details.company) {
      await this.companyInput.fill(details.company);
    }
    await this.addressInput.fill(details.address);
    await this.countrySelect.selectOption(details.country);
    await this.stateInput.fill(details.state);
    await this.cityInput.fill(details.city);
    await this.zipcodeInput.fill(details.zipcode);
    await this.mobileNumberInput.fill(details.mobile);

    await this.createAccountBtn.click();
  }

  async verifyAccountCreated() {
    await expect(this.accountCreatedHeading).toBeVisible();
    await this.continueBtn.click();
  }

  async verifySignupError(expectedMessage: string) {
    await expect(this.signupErrorMessage).toBeVisible();
    await expect(this.signupErrorMessage).toHaveText(expectedMessage);
  }

  async verifyLoginError(expectedMessage: string) {
    await expect(this.loginErrorMessage).toBeVisible();
    await expect(this.loginErrorMessage).toHaveText(expectedMessage);
  }
}