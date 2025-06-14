const playwright = require('playwright');
const { chromium, webkit, devices } = require('playwright');
const fs = require('fs');
const CARMAX = require('./methods.js');

(async() => {


    await CARMAX.initialize();

    
    await CARMAX.clickSearch();
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


