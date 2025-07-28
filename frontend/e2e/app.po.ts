import { browser, element, by } from 'protractor';

export class MaterialDashboardAngularPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('h2.section-title')).getText();
  }

  getHeroTitle() {
    return element(by.css('h1.hero-title')).getText();
  }

  getLoginLink() {
    return element(by.css('a[routerLink="/login"]'));
  }

  getRegisterLink() {
    return element(by.css('a[routerLink="/register"]'));
  }
}
