let page;

beforeAll(async () => {
  page = await browser.newPage();
});

afterAll(async () => {
  page.close();
});

describe("Ticket purchase", () => {
  beforeEach(async () => {
    await page.goto("https://qamid.tmweb.ru/client/index.php");
    await page.$$(".page-nav__day")[1].click();

    await page.$("[data-seance-id='217']").click();
  });

  test("Buy 5 standard tickets", () => {
    let expected = "https://qamid.tmweb.ru/client/hall.php";
    let actual = page.title();

    expected(actual).toContain(expected);
  });
});
