const puppeteer = require('puppeteer')

async function benzinga() {
    const browser = await puppeteer.launch({
        // headless: false,
        timeout: 300000000
    })
    const page = await browser.newPage();
    await page.setViewport({ width: 2000, height: 2000 });
    await page.goto(`https://www.benzinga.com/news`, { waitUntil: 'networkidle0', timeout: 3000000 }); // wait until page load
    const results = await page.evaluate(() => {
        const elements = document.querySelectorAll('.newsfeed-card')
        console.log(elements)
        const news = []
        elements.forEach((elem) => {
            const imageSrc = elem.querySelector('img').getAttribute('src')
            const time = elem.querySelector('.post-elapsed').textContent
            const title = elem.querySelector('.post-title').textContent
            const link = elem.querySelector('a').getAttribute('href')
            const text = elem.querySelector('.post-card-description').textContent
            news.push({
                company: "Benzinga",
                title,
                time,
                text,
                link,
                imageSrc
            })
        })
        return news


    })
    console.log("benzinga: " + results.length)
    browser.close()
    return results
}
// benzinga()
module.exports = benzinga