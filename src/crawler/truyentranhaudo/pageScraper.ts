const scraperObject = {
    url: 'https://truyentranhaudio.online/',
    async scraper(browser){
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        // Navigate to the selected page
        await page.goto(this.url);
        // Wait for the required DOM to be rendered
        await page.waitForSelector('.row-last-update');
        // Get the link to all the required books
        let urls = await page.$$eval('.thumb-item-flow .thumb-wrapper', links => {
            // Extract the links from the data
            links = links.map(el => el.querySelector('a').href)
            return links;
        });
        console.log(urls);

    }
}

module.exports = scraperObject;