const puppeteer = require('puppeteer')

const tradingview = async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        headless: true
    });


    const page = await browser.newPage();

    // Navigate the page to a URL.
    await page.goto('https://www.tradingview.com/news/', { timeout: 30_0000 });

    // Set screen size.
    await page.setViewport({ width: 1080, height: 1024 });
    
    const data = await page.evaluate(() => {

        const data = []

        const topStories = document.querySelectorAll('.topstories-A62b5xSn div .grid-iTt_Zp4a')[0].querySelectorAll('a').forEach(x => {
            const link = x.href;

            x = x.firstElementChild.firstElementChild

            const articleDivs = x.querySelectorAll('div')

            console.log(articleDivs);

            let title;

            articleDivs.forEach(x => {
                if (x.className.includes('title-DmjQR0Aa')) {
                    title = x.innerText;
                }
            })
            const time = articleDivs[0].querySelectorAll('span relative-time')[0]?.title

            const imageSrc = articleDivs[1].querySelectorAll('picture img')[0]?.src

            data.push({
                company: "TradingView",
                link,
                title,
                imageSrc,
                time
            })
        })
        return data
        
    });
    console.log("tradingview: " + data.length)
    browser.close();
    return data
}

module.exports = tradingview