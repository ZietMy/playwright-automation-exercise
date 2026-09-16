import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productsLink: Locator;
  readonly searchInput: Locator;
  readonly searchBtn: Locator;
  readonly searchedProductsHeader: Locator;
  readonly productList: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.productsLink = page.getByRole('link', { name: ' Products' });
    this.searchInput = page.locator('#search_product');
    this.searchBtn = page.locator('#submit_search');
    this.searchedProductsHeader = page.getByRole('heading', { name: 'SEARCHED PRODUCTS' });
    this.productList = page.locator('.single-products .productinfo p');
    this.noResultsMessage = page.getByText('No products to display');
  }

  async goToProductsPage() {
    await this.productsLink.click();
    await expect(this.page).toHaveURL(/.*products/);
  }

  async searchProduct(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchBtn.click();
  }

  async verifySearchResultsContain(keyword: string) {
    await expect(this.searchedProductsHeader).toBeVisible();
    const productNames = await this.productList.allTextContents();
    expect(productNames.length).toBeGreaterThan(0);

    // Kiểm tra xem CÓ ÍT NHẤT 1 sản phẩm chứa từ khóa search hay không
    const hasMatchingProduct = productNames.some(name => 
      name.toLowerCase().includes(keyword.toLowerCase())
    );
    
    expect(hasMatchingProduct).toBeTruthy();
  }

  async verifyNoProductsFound() {
    await expect(this.searchedProductsHeader).toBeVisible();
    // Verify danh sách sản phẩm trả về = 0
    const count = await this.productList.count();
    expect(count).toBe(0);
  }

  async getProductCount(): Promise<number> {
    return await this.productList.count();
  }
}