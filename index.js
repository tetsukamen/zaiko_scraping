const puppeteer = require("puppeteer");

async function mac() {
  console.log("*** Mac ***");
  const query = {
    url: "https://www.apple.com/jp/shop/refurbished/mac/16gb",
    itemSelector: "li.as-producttile",
    nameSelector: "a.as-producttile-tilelink",
    priceSelector: "div.as-producttile-currentprice",
    pagenation: "span.as-pagination-totalnumbers",
  };

  const browser = await puppeteer.launch({ headless: false }); // browser起動
  const page = await browser.newPage(); // ページ生成
  await page.goto(query.url); // ページへ移動

  // ページ数の取得
  const pageAmount = parseInt(
    await page.$eval(query.pagenation, (item) => {
      return item.textContent;
    })
  );
  console.log("pageAmount", pageAmount);

  const originalData = []; // 収集した生データ

  // １ページ目のスクレイピング
  const list = await page.$$(query.itemSelector);
  for (let i = 0; i < list.length; i++) {
    // 製品名
    const a = await list[i].$(query.nameSelector);
    const name = await (await a.getProperty("textContent")).jsonValue();
    const link = await (await a.getProperty("href")).jsonValue();
    // 価格
    const div = await list[i].$(query.priceSelector);
    const price = await (await div.getProperty("textContent")).jsonValue();

    originalData.push({ name, price, link });
  }

  for (let i = 0; i < pageAmount - 1; i++) {
    // ページネーションのクリック
    await page.click("button.paddlenav-arrow.paddlenav-arrow-next");
    await page.waitForTimeout(1000);
    await page.waitForSelector(query.itemSelector);

    // スクレイピング
    const list = await page.$$(query.itemSelector);
    for (let i = 0; i < list.length; i++) {
      // 製品名
      const a = await list[i].$(query.nameSelector);
      const name = await (await a.getProperty("textContent")).jsonValue();
      const link = await (await a.getProperty("href")).jsonValue();
      // 価格
      const div = await list[i].$(query.priceSelector);
      const price = await (await div.getProperty("textContent")).jsonValue();

      originalData.push({ name, link, price });
    }
  }

  browser.close();

  // 取得したデータを加工
  const processedData = originalData.map((item) => {
    // core数
    const coreObj = item.name.match(/Core i(\d+)/);
    const core = coreObj ? parseInt(coreObj[1]) : null;
    // 価格
    const priceObj = item.price.match(/(\d|,)+/);
    const price = priceObj ? parseInt(priceObj[0].replace(",", "")) : null;
    return { core, price };
  });

  // 加工したデータを表示
  console.log(processedData);
}

async function cleaner() {
  console.log("*** クリーナー ***");

  const query = {
    url: "https://www.galliumwebshop.com/p/item-detail/detail/i68.html",
    querySelector: ".itemstock .i_value",
  };

  const browser = await puppeteer.launch({ headless: false }); // browser起動
  const page = await browser.newPage(); // ページ生成
  await page.goto(query.url); // ページへ移動

  // 在庫テキストの取得
  const text = await page.$eval(query.querySelector, (item) => {
    return item.textContent;
  });

  browser.close();

  if (isNaN(text)) {
    console.log("在庫なし");
  } else {
    console.log("在庫:", cleaner);
  }
}

async function main() {
  try {
    // const url =
    //   "https://jp.hotels.com/search.do?f-accid=1&q-destination=%E6%97%A5%E6%9C%AC%E3%80%81%E6%96%B0%E6%BD%9F%E7%9C%8C%E5%8D%97%E9%AD%9A%E6%B2%BC%E5%B8%82&q-check-in=2021-12-30&q-check-out=2022-01-04&q-rooms=1&q-room-0-adults=1&q-room-0-children=1&q-room-0-child-0-age=11";

    await mac();

    // await cleaner();
  } catch (e) {
    console.log(e);
  }
}

main();
