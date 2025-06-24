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

        // Get Date here or witihin a carmax method

        // Go To Store
        let storeAvailable = await CARMAX.goToStoreUrl(store.id);

        if (storeAvailable) {
            let vehicleInfos = [];
            // Handle Edge case of missing first batch of vehicles
            let firstBatch = await CARMAX.interceptFirstClick(store.id);
            vehicleInfos.push(firstBatch)
            // Extract # of vehicles at local store to establish pagination
            let vehicleTotal = await CARMAX.getVehicleTotal();
            console.log("VEHICLE TOTAL: ", vehicleTotal)
            console.log("TYPE OF VAR VEHICLE TOTAL: ", typeof(vehicleTotal))
            let lastIdx = Math.ceil(vehicleTotal / 24);
            console.log('Last Index: ', lastIdx);
            let i = 0;
            // Main Data
            while (i < lastIdx - 1) {
                // Gather information from network requests
                console.log(`>>>>Gathering Info on Batch ${i+1}/${lastIdx}`);
                let data = await CARMAX.interceptRequest();
                vehicleInfos.push(data);
                i++;
            }
            // Flatten array before appending?
            console.log(`Vehicle Infos Before Flatten: ${vehicleInfos.length}`);
            vehicleInfos = vehicleInfos.flat();
            console.log(`Vehicle Infos After Flatten: ${vehicleInfos.length}`);
            // Append local store info to main data file
            await CARMAX.jsonizeStore(vehicleInfos, `${store.id}`);
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


})();


