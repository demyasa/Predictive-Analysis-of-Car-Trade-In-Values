let RAW_DATA = require('./CarMax-6-17-25.json');

let DATA = JSON.parse(RAW_DATA);

console.log(`Raw Data Count: ${RAW_DATA.length}`);
for (let raw of DATA) {
    console.log(raw.vin);
}