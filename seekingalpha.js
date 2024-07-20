const puppeteer = require('puppeteer')

const seekingAlpha = async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        headless: false
    });


    const page = await browser.newPage();

    // Navigate the page to a URL.
    await page.goto('https://seekingalpha.com/market-news/trending?source=top_market_news%3Aexpanded%3Anavbar_left', { timeout: 30_0000 });

    // Set screen size.
    await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForSelector('[data-test-id="post-list"]')

    const data = await page.evaluate(() => {

        const data = []

        const topStories = document.querySelectorAll('[data-test-id="post-list"]')[0].childNodes

        topStories.forEach(x => {


            const link = x.firstChild.firstChild?.href;
            const imageSrc = x.querySelector('img')?.src
            const title = x.firstElementChild.innerText;
            const time = x.lastChild.querySelector('[data-test-id="post-list-date"]')?.innerText;


            data.push({
                company: "SEKA",
                link,
                title,
                imageSrc,
                time
            })
        })

        return data

    });

    console.log("seekingalpha: " + data.length)
    browser.close();
    return data
}

module.exports = seekingAlpha