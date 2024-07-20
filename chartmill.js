const puppeteer = require('puppeteer')

async function chartmill() {
    const browser = await puppeteer.launch({
        headless: true,
        timeout: 300000000
    })
    const page = await browser.newPage();
    await page.goto(`https://www.chartmill.com/news`, { waitUntil: 'networkidle0', timeout: 300_000 }); // wait until page load
    const results = await page.evaluate(() => {
        const elements = document.querySelectorAll('.elem')
        // return elements
        const news = []
        elements.forEach((elem) => {
            const divs = elem.querySelectorAll('div')
            const imageSrc = divs[0].querySelector('img').getAttribute('src')
            const time_name = divs[1].querySelector('small').textContent
            const titleDiv = divs[1].querySelector('h3')
            const title = titleDiv.textContent
            const link = titleDiv.querySelector('a').getAttribute('href')
            const text = divs[1].querySelector('.ng-star-inserted').textContent
            news.push({
                company: "ChartMill",
                title,
                time: time_name,
                text,
                link: "https://www.chartmill.com/" + link,
                imageSrc
            })
        })
        return news


    })
    console.log("chartmill: " + results.length)
    browser.close()
    return results
}

module.exports = chartmill