import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly newUserHeader: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupBtn: Locator;
  // --- Locators màn hình Điền thông tin tài khoản chi tiết (/signup) ---
  readonly enterAccountInfoHeading: Locator;
  readonly titleMrRadio: Locator;
  readonly passwordInput: Locator;
  readonly daysSelect: Locator;
  readonly monthsSelect: Locator;
  readonly yearsSelect: Locator;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  // readonly companyInput?: Locator;
  readonly addressInput: Locator;
  readonly address2Input?: Locator;
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

    // Initial Signup Form
    this.newUserHeader = page.getByRole('heading', { name: 'New User Signup!' });
    this.signupNameInput = page.getByPlaceholder('Name');
    this.signupEmailInput = page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address');
    this.signupBtn = page.getByRole('button', { name: 'Signup' });

    // Detailed Registration Form
    this.enterAccountInfoHeading = page.getByText('ENTER ACCOUNT INFORMATION');
    this.titleMrRadio = page.getByLabel('Mr.');
    this.passwordInput = page.getByLabel('Password *');
    this.daysSelect = page.locator('#days');
    this.monthsSelect = page.locator('#months');
    this.yearsSelect = page.locator('#years');

    // Address Information Form
    this.firstNameInput = page.getByLabel('First name *');
    this.lastNameInput = page.getByLabel('Last name *');
    // this.companyInput = page.getByLabel('Company');
    this.addressInput = page.getByLabel('Address * (Street address, P.O. box, company name, c/o)');
    this.countrySelect = page.getByLabel('Country *');
    this.stateInput = page.getByLabel('State *');
    this.cityInput = page.getByLabel('City *');
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileNumberInput = page.getByLabel('Mobile Number *');

    this.createAccountBtn = page.getByRole('button', { name: 'Create Account' });
    this.accountCreatedHeading = page.getByText('ACCOUNT CREATED!');
    this.continueBtn = page.getByRole('link', { name: 'Continue' });
  }

  //Action
  async fillInitialSignup(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupBtn.click();
  }
  async fillAccountDetails(details: {
    password: string;
    day: string;
    month: string;
    year: string;
    firstName: string;
    lastName: string;
    company?:string;
    address: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobile: string;
  }) {
    // Chờ màn hình nhập thông tin chi tiết hiển thị
    await expect(this.enterAccountInfoHeading).toBeVisible();

    await this.titleMrRadio.check();
    await this.passwordInput.fill(details.password);

    // Chọn ngày tháng năm sinh
    await this.daysSelect.selectOption(details.day);
    await this.monthsSelect.selectOption(details.month);
    await this.yearsSelect.selectOption(details.year);

    // Điền thông tin địa chỉ
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    // await this.companyInput.fill(details.company || '');
    await this.addressInput.fill(details.address);
    await this.countrySelect.selectOption(details.country);
    await this.stateInput.fill(details.state);
    await this.cityInput.fill(details.city);
    await this.zipcodeInput.fill(details.zipcode);
    await this.mobileNumberInput.fill(details.mobile);

    // Submit tạo tài khoản
    await this.createAccountBtn.click();
  }
  async verifyAccountCreated() {
    await expect(this.accountCreatedHeading).toBeVisible();
    await this.continueBtn.click();
  }
  
}