const fs = require('fs');
const path = require('path');

/**
 * Reads all JSON files from a specified directory and combines their content into a single array.
 *
 * @param {string} folderPath The path to the folder containing JSON files.
 * @returns {Array} An array containing the parsed content of all JSON files.
 * @throws {Error} If the provided path is not a directory or if there are issues reading/parsing files.
 */

function extractJsonFilesToArray(folderPath) {
    const allJsonData = [];

    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
        throw new Error(`Error: '${folderPath}' is not a valid directory.`);
    }

    const files = fs.readdirSync(folderPath);

    for (const file of files) {
        if (path.extname(file) === '.json') {
            const filePath = path.join(folderPath, file);
            try {
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const jsonData = JSON.parse(fileContent);
                allJsonData.push(jsonData);
            } catch (error) {
                console.error(`Error processing file '${file}': ${error.message}`);
                // Optionally, you could choose to throw the error or skip the problematic file.
            }
        }
    }

    return allJsonData;
}

// Try it:
const myData = extractJsonFilesToArray('./data/6_23_2025');
console.log(myData);