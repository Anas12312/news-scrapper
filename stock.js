const puppeteer = require('puppeteer');
const config = require('./config');
function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }
async function stockTwits(text, link, imagesSrc, company) {
    const browser = await puppeteer.launch({
        args: [
            '--disable-features=PasswordLeakDetection',
            '--block-new-web-contents',
            '--disable-features=AutofillServerCommunication',
            '--disable-features=AutofillCredentialProvider'
        ],
        timeout: 300_000,
        // headless: false
    })
    
    // const incognito = await browser.createIncognitoBrowserContext();
    const page = await browser.newPage()
    page.setViewport({
        width: 1600,
        height: 900
    })
    await page.goto("https://stocktwits.com/", {
        timeout: 500_000
    })
    await page.waitForSelector('.SignUpButtons_logInLink__vrXFQ')
    await page.click(".SignUpButtons_logInLink__vrXFQ")
    await page.waitForSelector('.TextInput_input__dUehr')
    const anas = await page.$$('.TextInput_input__dUehr')
    await anas[0].type(config.stockTwitsEmail, {
        delay: 10
    })
    await anas[1].type(config.stockTwitsPassword, {
        delay: 10
    })
    await page.waitForSelector('.Button_button__mg_cR')
    await page.click(".Button_button__mg_cR")
    // await page.waitForSelector('.DraftEditor-editorContainer')
    await page.waitForNavigation()
    console.log("here")
    // setInterval(() => {
    //     page.keyboard.press('Enter')
    //     console.log("here")
    // }, 5000)
     



    await page.close()
    const page2 = await browser.newPage()
    page2.setViewport({
        width: 1600,
        height: 900
    })
    await page2.goto('https://stocktwits.com/')
    

    const editorContainer = await page2.$$('.DraftEditor-editorContainer')
    // console.log(editorContainer)
    const span1 = await editorContainer[0].$('div')
    // console.log(span1)
    const span2 = await span1.$('div')
    const span3 = await span2.$('div')
    const dataId = await span3.evaluate((div) => {
        return div.getAttribute('data-editor')
        // div.innerHTML = '<div class="" data-block="true" data-editor="60sn6" data-offset-key="foo-0-0"><div data-offset-key="foo-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span data-offset-key="foo-0-0">A7AAAA</span></div></div>'
    })
    const div = await page2.$('#placeholder-' + dataId)
    // console.log(div)
    await div.click()
    await div.type(text + "\n\n", {
        delay: 1
    })
    // await div.type(imagesSrc + "\n\n", {
    //     delay: 1
    // })
    await div.type("Find out more on: \n" + link + "\n\n", {
        delay: 1
    })
    await div.type("$" + company + "\n", {
        delay: 1
    })
    await page2.waitForSelector(".Button_button__mg_cR")
    await page2.click(".ButtonPost_text__0hTj4")
    console.log("waiting")
    await delay(3000)
    // const pages = await browser.pages(); // get all open pages by the browser
    // const popup = pages[pages.length - 1]; // the popup should be the last page opened
    // console.log(pages.length, popup)
    // const done = await span2.evaluate((div, dataId) => {
    //     div.innerHTML += `<div class="" data-block="true" data-editor="${dataId}" data-offset-key="foo-0-0"><div data-offset-key="foo-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span data-offset-key="foo-0-0">A7AAAA</span></div></div>`
    // }, dataId)
    // const span2 = await span1.$('span')
    // console.log(span2)
    // const done2 = await span2.evaluate((s) => s.textContent = "Hello World!\n\n$testing")
    await browser.close()
}

module.exports = stockTwits