const playwright = require('playwright');
const { chromium, webkit, devices } = require('playwright');
const fs = require('fs');
const jsdom = require("jsdom");

const STORES = require('./STORES.json');


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
const STORES_URL = "https://www.carmax.com/stores";

const SEARCH_BTN = '//hzn-button[@class="hero-featured-content--cta"]';

const SEE_MORE_BTN = '';

const NUM_VEHICLES = '//div[contains(@id, "search-results")]/div/span[@id="number-of-matches"]';


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

        // Navigate to Carmax
        await page.goto(URL, {waitUntil: "load", timeout: 60000});
        console.log('>> Initialized & Navigated to CarMax ...\n');
        await delay(2);
    },
    loadStores: async () => {
        console.log('>> Loading in CarMax stores...\n');
        return STORES;
        
    },
    goToStoreUrl: async (storeId) => {
        // Go To Store URL
        console.log(`>> Going to store: ${storeId}...\n`);
        await delay(1);

        await page.goto(`https://www.carmax.com/stores/${storeId}`, {waitUntil: "load", timeout: 60000});
        await delay(1);
        
        // Check if Link to Shop Local Cars is Available
        let storePage = await page.locator(`//a[@data-storeid=${storeId}]`).count()

        if (!storePage) {
            console.log(`>> No Local Cars for storeId: ${storeId}...\n`);
            return false;
        } else {
            console.log(`>> Navigating to local storeId: ${storeId}...\n`);
            return true;
        }

        // Not Available at Peachtree GA location for instance
    },
    interceptFirstClick: async (storeId) => {

        await delay(1);
        const responsePromise = page.waitForResponse(response => response.url().includes(`cars/${storeId}`));

  
        let firstClick = await page.locator(`//a[@data-storeid=${storeId}]`);
  
        // Click button
        await firstClick.click();
  
        // Await those intercepted requests now
        // const resp = await responsePromise;

        await delay(2);

        const htmlContent = await page.content();

        let htmlString = JSON.stringify(htmlContent);
        
        
        // ----------> YOU ARE HERE <---------- //
        // ----------> YOU ARE HERE <---------- //
        // ----------> YOU ARE HERE <---------- //

        // Split up the string at 
        // (1) "const cars = ""
        // (2) "Polyfill"

        // Make this prettier eventually
        let firstSplit = htmlString.split('const cars = ')[1];
        let secondSplit = firstSplit.split('// Polyfill')[0];
        let thirdSplit = secondSplit.trim();
        // Remove the / (forward slashes)
        let fourthSplit = thirdSplit.split("\\").join("");
        let parsedContent = fourthSplit.split(";n")[0];

        // This is a check
        // fs.writeFileSync(`parsedContent.json`, parsedContent);

        let finalParsed = JSON.parse(parsedContent)
        return finalParsed;

    },
    getVehicleTotal: async () => {

        await delay(1);
        let vehicleElement = await page.locator(NUM_VEHICLES);
        await delay(1);
        let vehicleCount = await vehicleElement.innerText();
        console.log(`{{{ getVehicleTotal }}} Vehicle Count: ${vehicleCount}...\n`);
        console.log(`{{{ getVehicleTotal }}} TypeOf Vehicle Count ${typeof(vehicleCount)}`);
        // Remove comma
        vehicleCount = vehicleCount.split(",").join("");
        // Convert to number
        vehicleCount = parseInt(vehicleCount);
        console.log(`{{{ getVehicleTotal }}} Vehicle Count: ${vehicleCount}...\n`);
        console.log(`{{{ getVehicleTotal }}} TypeOf Vehicle Count ${typeof(vehicleCount)}`);
        return vehicleCount;
    },
    getStores: async () => {
        console.log('>> Going to Stores URL...\n');
        
        // Await Stores Request
        const responsePromise = page.waitForResponse(response => response.url().includes("stores"));
        
        // Navigate to Carmax Stores page
        await page.goto(STORES_URL, {waitUntil: "load", timeout: 60000});
        
        const resp = await responsePromise;
        console.log('>> Got Stores URL Info...\n');
        
        // Cant Parse the html file
        // Need to convert it to string
        // Then split at "allStores"
        // JSON stringify the result[1]
        // then JSON.parse it into object?

        const data = await resp.json();

        
        console.log(data)


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
    interceptRequest: async () => {

        await delay(1);
        const responsePromise = page.waitForResponse(response => response.url().includes("cars/api/search/run"));

  
        let loc = await page.getByText('See More Matches');
        await delay(1);
  
        // Click your button
        await loc.click();
  
        await delay(1);
        // Await those intercepted requests now
        const resp = await responsePromise;
  
        // Check requests status
        // expect(response1.status()).toBe(200);
  
        // Get the request's body and print it
        const data = await resp.json();


        // console.log('>> Successfully Intercepted HTTP Request on See More Matches...');
        // console.log(data.items);
        // console.log(data.items.length);
        await delay(1);
        return data.items;
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
        let json = JSON.stringify(JSON.parse(arr));
        // string.slice(startingindex, endingindex);
        json = json.slice(1,-1)
        json = "," + json
        // console.log("JSON JSON JSON: ", json)
        fs.appendFileSync(`${fileName}.json`, json);
    },
    end: async () => {
        // STEP 7: CLOSE BROWSER
        console.log('Closing browser in 5 seconds...')
        await delay(5)
        await browser.close();
    }
}

module.exports = carMaxSkrp;