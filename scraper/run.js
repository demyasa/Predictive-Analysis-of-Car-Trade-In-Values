const playwright = require('playwright');
const { chromium, webkit, devices } = require('playwright');
const fs = require('fs');
const CARMAX = require('./methods.js');

/*
    Flatten Array Helper
*/
Object.defineProperty(Array.prototype, 'flat', {
    value: function(depth = 1) {
      return this.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
      }, []);
    }
});

(async() => {

    let stores = await CARMAX.loadStores();

    for (let store of stores){

        // Initialize Browser
        await CARMAX.initialize();

        // Go To Store
        let storeAvailable = await CARMAX.goToStoreUrl(store.id);

        if (storeAvailable) {
            // Extract # of vehicles at local store to establish pagination
            let vehicleTotal = await CARMAX.getVehicleTotal();
            let lastIdx = vehicleTotal / 24;
            console.log('Last Index: ', lastIdx);
            let i = 0;
            // Main Data
            let vehicleInfos = [];
            while (i < lastIdx) {
                // Gather information from network requests
                console.log(`>>>>Gathering Info on Batch ${i}/${lastIdx}`);
                let data = await CARMAX.interceptRequest();
                vehicleInfos.push(data);
                i++;
            }
            // Flatten array before appending?
            console.log(`Vehicle Infos Before Flatten: ${vehicleInfos.length}`);
            vehicleInfos = vehicleInfos.flat();
            console.log(`Vehicle Infos After Flatten: ${vehicleInfos.length}`);
            // Append local store info to main data file
            await CARMAX.jsonizeAppend(vehicleInfos, "CarMax-6-17-25");
            // Close browser
            await CARMAX.end();
        } else {
            // Handle storeIds without available local store links
            console.log(`No data for ${store.id}`);
            // Append empty vehicleInfos?
            // Close browser
            await CARMAX.end();

        }

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


