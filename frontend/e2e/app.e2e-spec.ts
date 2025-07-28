import { MaterialDashboardAngularPage } from "./app.po";
import { browser, by, element } from 'protractor';

describe("material-dashboard-angular App", () => {
  let page: MaterialDashboardAngularPage;

  beforeEach(() => {
    page = new MaterialDashboardAngularPage();
  });

  it("should display the landing page with correct title", async () => {
    await page.navigateTo();
    console.log('Navigated to page');
    
    // Wait for Angular to be ready
    await browser.waitForAngular();
    console.log('Angular is ready');
    
    // Wait for the page to load completely
    await browser.sleep(2000);
    console.log('Waited for page load');
    
    // Check for the hero title which should be present
    const heroTitle = await page.getHeroTitle();
    console.log('Hero title:', heroTitle);
    expect(heroTitle).toContain("Transform Your Business");
  });

  it("should display features section title", async () => {
    await page.navigateTo();
    await browser.waitForAngular();
    await browser.sleep(2000);
    
    const sectionTitle = await page.getParagraphText();
    console.log('Section title:', sectionTitle);
    expect(sectionTitle).toEqual("Everything you need to succeed");
  });

  it("should have login and register links", async () => {
    await page.navigateTo();
    await browser.waitForAngular();
    await browser.sleep(2000);
    
    const loginLink = await page.getLoginLink();
    const registerLink = await page.getRegisterLink();
    
    expect(await loginLink.isDisplayed()).toBe(true);
    expect(await registerLink.isDisplayed()).toBe(true);
  });
});
