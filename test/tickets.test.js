const { buyTickets, bookingTickets } = require("../lib/commands");

let page;

beforeEach(async () => {
  page = await browser.newPage();
});

afterEach(async () => {
  await page.close();
});

describe("Ticket purchase", () => {
  beforeEach(async () => {
    await page.goto("https://qamid.tmweb.ru/client/index.php");

    const days = await page.$$(".page-nav__day");
    await days[1].click();
  });

  test("Buy 5 standard tickets", async () => {
    const timeSession = await page.$("[data-seance-id='217']");
    await timeSession.click();

    await page.waitForNavigation();

    await buyTickets(page, 5, 0);
    await bookingTickets(page);

    await page.waitForNavigation();

    let expectedPayUrl = "https://qamid.tmweb.ru/client/payment.php";
    let actualPayUrl = await page.url();
    expect(actualPayUrl).toContain(expectedPayUrl);

    let expectedPrice = "500";
    let actualPrice = await page.$eval(".ticket__cost", (el) => el.textContent);
    expect(actualPrice).toContain(expectedPrice);
  });

  test("Buy 8 standard and 10 premium tickets", async () => {
    const timeSession = await page.$("[data-seance-id='218']");
    await timeSession.click();
    await page.waitForNavigation();

    await buyTickets(page, 8, 10);
    await bookingTickets(page);

    await page.waitForNavigation();

    let expectedPayUrl = "https://qamid.tmweb.ru/client/payment.php";
    let actualPayUrl = await page.url();
    expect(actualPayUrl).toContain(expectedPayUrl);

    let expectedPrice = String(3500 * 10 + 1000 * 8);
    let actualPrice = await page.$eval(".ticket__cost", (el) => el.textContent);
    expect(actualPrice).toContain(expectedPrice);
  });

  test("Can't buy 0 tickets", async () => {
    const timeSession = await page.$("[data-seance-id='217']");
    await timeSession.click();

    await page.waitForNavigation();

    const button = await page.$(".acceptin-button");
    let actualDisabled = await button.evaluate((el) =>
      el.getAttribute("disabled")
    );
    let expectedDisable = "true";
    expect(actualDisabled).toContain(expectedDisable);

    await bookingTickets(page);

    let expectedPayUrl = "https://qamid.tmweb.ru/client/hall.php";
    let actualPayUrl = await page.url();
    expect(actualPayUrl).toContain(expectedPayUrl);
  });
});
