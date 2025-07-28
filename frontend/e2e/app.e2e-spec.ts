import { MaterialDashboardAngularPage } from "./app.po";

describe("material-dashboard-angular App", () => {
  let page: MaterialDashboardAngularPage;

  beforeEach(() => {
    page = new MaterialDashboardAngularPage();
  });

  it("should display the landing page with correct title", async () => {
    await page.navigateTo();
    console.log('Navigated to page');
    
    // Check for the hero title which should be present
    const heroTitle = await page.getHeroTitle();
    console.log('Hero title:', heroTitle);
    expect(heroTitle).toContain("Transform Your Business");
  });

  it("should display features section title", async () => {
    await page.navigateTo();
    const sectionTitle = await page.getParagraphText();
    console.log('Section title:', sectionTitle);
    expect(sectionTitle).toEqual("Everything you need to succeed");
  });

  it("should have login and register links", async () => {
    await page.navigateTo();
    
    const loginLink = await page.getLoginLink();
    const registerLink = await page.getRegisterLink();
    
    expect(await loginLink.isDisplayed()).toBe(true);
    expect(await registerLink.isDisplayed()).toBe(true);
  });
});
