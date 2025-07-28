import { MaterialDashboardAngularPage } from "./app.po";

describe("material-dashboard-angular App", () => {
  let page: MaterialDashboardAngularPage;

  beforeEach(() => {
    page = new MaterialDashboardAngularPage();
  });

  it("should display message saying app works", async () => {
    await page.navigateTo();
    console.log('Navigated to page');
    const text = await page.getParagraphText();
    console.log('Paragraph text:', text);
    expect(text).toEqual("Welcome to My CRM!");
  });
});
