module.exports = {
  buyTickets: async function (page, cntStandard, cntPremium) {
    const seats = await page.$$(".buying-scheme__wrapper .buying-scheme__chair");
    let cntBuyStandard = 0;
    let cntBuyPremium = 0;
    for (let seat of seats) {
      let hasTaken = await seat.evaluate((el) =>
        el.classList.contains("buying-scheme__chair_taken")
      );
      let hasPremium = await seat.evaluate((el) =>
        el.classList.contains("buying-scheme__chair_vip")
      );
      let hasStandard = await seat.evaluate((el) =>
        el.classList.contains("buying-scheme__chair_standart")
      );

      if (hasStandard && !hasTaken && (cntBuyStandard < cntStandard)) {
        cntBuyStandard += 1;
        await seat.click();
      }
      if (hasPremium && !hasTaken && (cntBuyPremium < cntPremium)) {
        cntBuyPremium += 1;
        await seat.click();
      }

      if (cntBuyStandard === cntStandard && cntBuyPremium === cntPremium) {
        break;
      }
    }
  },

  bookingTickets: async function (page) {
    await (await page.$(".acceptin-button")).click();
  }
};
