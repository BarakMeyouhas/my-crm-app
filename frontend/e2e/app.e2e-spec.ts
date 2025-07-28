import { MaterialDashboardAngularPage } from "./app.po";

describe("material-dashboard-angular App", () => {
  let page: MaterialDashboardAngularPage;

  beforeEach(() => {
    page = new MaterialDashboardAngularPage();
  });

  it("should display message saying app works", async () => {
    await page.navigateTo();
    const text = await page.getParagraphText();
    expect(text).toEqual("app works!");
  });
});
