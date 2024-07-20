const puppeteer = require('puppeteer')

async function cnbc() {
    const browser = await puppeteer.launch({
        headless: true,
        timeout: 300000000
    })
    const page = await browser.newPage();
    await page.setViewport({ width: 2000, height: 2000 });
    await page.goto(`https://www.cnbc.com/world/?region=world`, { waitUntil: 'networkidle0', timeout: 300_000 }); // wait until page load
    const results = await page.evaluate(() => {
        const elements = document.querySelector('.LatestNews-list').querySelectorAll('li')
        // return elements
        const news = []
        elements.forEach((elem) => {
            const header = elem.querySelector('a')
            const title = header.textContent
            const link = header.getAttribute('href')
            const time = elem.querySelector('time').textContent
            news.push({
                company: "CNBC",
                title,
                link,
                time
            })
        })
        return news


    })
    console.log("cnbc: " + results.length)
    browser.close()
    return results
}

module.exports = cnbc