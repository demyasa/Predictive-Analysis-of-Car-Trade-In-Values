const playwright = require('playwright');
const { chromium, webkit, devices } = require('playwright');
const fs = require('fs');

/*
    HELPERS
*/

const delay = function (second = 1) {   // Delay Helper
    return new Promise(resolve => {
      setTimeout(() => resolve(second * 1000), second * 1000)
    });
};

/*
    VARIABLES
*/

const URL = "https://www.carmax.com/";

const SEARCH_BTN = '//hzn-button[@class="hero-featured-content--cta"]';

const SEE_MORE_BTN = '';


/*
    METHODS
*/


const carMaxSkrp = {

    initialize: async () => {
        browser = await chromium.launch({
            headless: false, 
            // headless: true, 
            slowMo: 500
        });
        page = await browser.newPage();
        console.log('\n>> Initiated browser and opened page...\n')

        // Navigate to ACV
        await page.goto(URL, {waitUntil: "load", timeout: 60000});
        console.log('>> Initialized & Navigated to CarMax ...\n');
        await delay(2);
    },
    clickSearch: async () => {
        console.log('>> Attempting to Click Search...\n');
        await page.locator(SEARCH_BTN).click();
        await delay(3);
        console.log('>> Clicked Search...\n');
    },
    checkSeeMore: async () => {
        console.log('>> Checking if See More button is Present...\n');
        
        let clickNext = await page.getByText('See More Matches');
        await delay(1);
        await clickNext.click();
        await delay(2);
        console.log('>> Clicked See More button...\n');

    },
    scrapeData: async (obj) => {
        await delay(2);
        let newObj = { ...obj };

        let value = await page.locator(VALUE);
        let Value = await value.innerText();
        console.log(`{{scrapeData}} Low Value: ${Value}`);
        newObj["Value"] = Value;

    },
    jsonizeWrite: async (arr, fileName) => {
        let json = JSON.stringify(arr);
        // console.log("JSON JSON JSON: ", json)
        fs.writeFileSync(`${fileName}.json`, json);
    },
    jsonizeAppend: async (arr, fileName) => {
        let json = JSON.stringify(arr);
        // string.slice(startingindex, endingindex);
        json = json.slice(1,-1)
        json = "," + json
        // console.log("JSON JSON JSON: ", json)
        fs.appendFileSync(`${fileName}.json`, json);
    },
    end: async () => {
        // STEP 7: CLOSE BROWSER
        console.log('Closing browser in 5 seconds...')
        await delay(2)
        await browser.close();
    }
}

module.exports = carMaxSkrp;