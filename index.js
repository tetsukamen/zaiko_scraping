const puppeteer = require("puppeteer");

async function getData(url, querySelector) {
  const browser = await puppeteer.launch({ headless: false }); // browser起動
  const page = await browser.newPage(); // ページ生成
  await page.goto(url); // ページへ移動
  // テキスト取得
  const text = await page.$eval(querySelector, (item) => {
    return item.textContent;
  });
  browser.close();
  console.log(text);
}

async function main() {
  try {
    // const url = "https://www.apple.com/jp/shop/refurbished/mac/16gb";
    const url =
      "https://jp.hotels.com/search.do?f-accid=1&q-destination=%E6%97%A5%E6%9C%AC%E3%80%81%E6%96%B0%E6%BD%9F%E7%9C%8C%E5%8D%97%E9%AD%9A%E6%B2%BC%E5%B8%82&q-check-in=2021-12-30&q-check-out=2022-01-04&q-rooms=1&q-room-0-adults=1&q-room-0-children=1&q-room-0-child-0-age=11";
    // const url = "https://www.galliumwebshop.com/p/item-detail/detail/i68.html";
    const querySelector = "title";

    getData(url, querySelector);
  } catch (e) {
    console.log(e);
  }
}

main();
