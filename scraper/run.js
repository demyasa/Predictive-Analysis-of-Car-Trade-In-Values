const playwright = require('playwright');
const { chromium, webkit, devices } = require('playwright');
const fs = require('fs');
const CARMAX = require('./methods.js');

(async() => {


    await CARMAX.initialize();

    let stores = await CARMAX.loadStores();

    for (let store of stores){
        console.log('\n\nSTORE ID:')
        console.log(store.id);

        await CARMAX.goToStoreUrl(store.id);
    }


// await CARMAX.getStores();
    
    // await CARMAX.clickSearch();



    // // (1) Need to get button to click See More
    // let i = 0;




    // while (i < 3625) {
    //     let data = await CARMAX.interceptRequest();
    //     console.log(`> Gathering Info on Batch ${i}/3625`);

    //     await CARMAX.jsonizeAppend(data, "CarMax-6-16-25")
    //     i++;
    // }



    // (2) Need to have method monitor for the http request
    //  - add a contains within the parameters some how?



    // (3) Click See More -> Intercept Request -> Repeat


    // (4) Offload into JSON file


    // await CARMAX.navigateToMarketReport();
    // let newObjs = [];
    // let restructuredArr = restructured[i];
    //     console.log("OBJ: ", obj);
    //     await CARMAX.enterVin(obj.Vin);
    //     await CARMAX.enterMiles(obj.Mileage);

    //     let newObj = await CARMAX.scrapeData(obj);
    //     newObjs.push(newObj);

    // await CARMAX.jsonizeAppend(newObjs, "-1");
    // // Close browser
    // await CARMAX.end();
    // console.log(`>> Stored We Buy Vehicle Infos in JSON: {-1}...`);


})();


