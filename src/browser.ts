const puppeteer = require('puppeteer');

async function startBrowser(){
    let browser;
    try {
        console.log("Opening the browser......");
        browser = await puppeteer.launch({
            headless: true,
            args: [
                "--incognito",
                "--no-sandbox",
                "--single-process",
                "--no-zygote",
                '--js-flags="--max-old-space-size=90"'
            ] 
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}

module.exports = {
    startBrowser
};