const fs = require('fs');
const path = require('path');

/**

 * Reads all JSON files from a specified directory and combines their content into a single array.
 
 * @param {string} folderPath The path to the folder containing JSON files.

 * @returns {Array} An array containing the parsed content of all JSON files.

 * @throws {Error} If the provided path is not a directory or if there are issues reading/parsing files.

**/

function extractJsonFilesToArray(folderPath) {
    const allJsonData = [];

    // Check if passed in folder path is present
    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
        throw new Error(`Error: '${folderPath}' is not a valid directory.`);
    }

    // Read in all files from folder path
    const files = fs.readdirSync(folderPath);

    for (const file of files) { // Iterate files
        if (path.extname(file) === '.json') {   // Consider removing
            const filePath = path.join(folderPath, file);
            try {
                const fileContent = fs.readFileSync(filePath, 'utf8');  // decode UTF8
                const jsonData = JSON.parse(fileContent);
                allJsonData.push(jsonData);
            } catch (error) {   // Error handling
                console.error(`Error processing file '${file}': ${error.message}`);
            }
        }
    }

    return allJsonData;
}

// Use function
const myData = extractJsonFilesToArray('./data/6_23_2025');
console.log(myData);