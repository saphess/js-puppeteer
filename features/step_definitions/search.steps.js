const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const {
  Given,
  When,
  Then,
  Before,
  After,
  BeforeAll,
  AfterAll,
} = require("cucumber");
const { buyTickets, bookingTickets } = require("../../lib/commands");

// BeforeAll(async function () {
//   const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
//   this.browser = browser;
// });

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 25 });
  this.browser = browser;
  const page = await this.browser.newPage();
  this.page = page;
});

After(async function () {
  await this.page.close();
  if (this.browser) {
    await this.browser.close();
  }
});

// AfterAll(async function () {
//   if (this.browser) {
//     await this.browser.close();
//   }
// });

Given("user is on {string} page", async function (path) {
  let url = "https://qamid.tmweb.ru/client" + path;
  await this.page.goto(url);
});

When("user goes over on next day", async function () {
  const days = await this.page.$$(".page-nav__day");
  await days[1].click();
});

When("clicks session with {string}", async function (session) {
  const timeSession = await this.page.$(session);
  await timeSession.click();

  await this.page.waitForNavigation();
});

When(
  "selects {int} standard and {int} premium tickets",
  { timeout: 10000 },
  async function (cntStandard, cntPremium) {
    await buyTickets(this.page, cntStandard, cntPremium);
  }
);

When("he's booking", async function () {
  await bookingTickets(this.page);
});

Then("user is located on {string}", async function (uri) {
  await this.page.waitForNavigation();
  let expectedPayUrl = "https://qamid.tmweb.ru/client" + uri;
  let actualPayUrl = await this.page.url();
  expect(actualPayUrl).contain(expectedPayUrl);
});

Then("price is equal to {string}", async function (price) {
  let expectedPrice = price;
  let actualPrice = await this.page.$eval(
    ".ticket__cost",
    (el) => el.textContent
  );
  expect(actualPrice).contain(expectedPrice);
});

Then("button have disable", async function () {
  const button = await this.page.$(".acceptin-button");
  let actualDisabled = await button.evaluate((el) =>
    el.getAttribute("disabled")
  );
  let expectedDisable = "true";
  expect(actualDisabled).contain(expectedDisable);
});

Then("user stay on {string}", async function (uri) {
  let expectedPayUrl = "https://qamid.tmweb.ru/client" + uri;
  let actualPayUrl = await this.page.url();
  expect(actualPayUrl).contain(expectedPayUrl);
});
