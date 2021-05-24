const puppeteer = require("puppeteer");
const sanitize = require("./sanitize");

module.exports = async (code) => {
  // Open the headless browser
  const browser = await puppeteer.launch({ headless: true });

  // Open a new page
  const page = await browser.newPage();

  // Redirects to the especified URL
  await page.goto(
    "https://www2.correios.com.br/sistemas/rastreamento/default.cfm"
  );

  // Search for the input and then type the code into the input
  await page.type("#sroForm textarea", `${code}`);

  // Search for the submit button and then executes a click action
  await page.click("#btnPesq");

  // Wait for search results page to load
  await page.waitForNavigation({ waitUntil: "load" });

  const pageContent = await page.evaluate(() => {
    // Get the date data
    const tables = document.querySelectorAll(".listEvent.sro");

    // Create an empty response array
    const dates = [];

    // Create an empty response array
    const descriptions = [];

    // Full response object
    const response = [];

    // Loop over each table founded
    tables.forEach((e) => {
      // Get the date and assigns it to the track date property
      const date = e.getElementsByClassName("sroDtEvent")[0].innerHTML;

      // // Add to dates array
      dates.push(date);

      // Get the description and assigns it to the track description property
      const description = e.getElementsByClassName("sroLbEvent")[0].innerHTML;

      // Add to descriptions array
      descriptions.push(description);
    });

    response.push(dates);
    response.push(descriptions);

    return response;
  });

  const events = [];

  for (let index = 0; index < pageContent[0].length; index++) {
    let date = sanitize.sanitizeDate(pageContent[0][index]);
    let description = sanitize.sanitizeDescription(
      pageContent[1][index],
      index,
      pageContent[0].length
    );

    events.push({ ...date, ...description });
  }

  const response = {
    code: code,
    events,
  };

  browser.close();

  return response;
};
