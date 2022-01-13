#!/usr/bin/env node

var converter = require('api-spec-converter');
const axios = require('axios').default;
const fs = require('fs');

const ADOBESIGN_SWAGGER_URL = "https://secure.na1.echosign.com/restapijson/v6/restapi";
var DIST = './dist/';

if (fs.existsSync(DIST)) {
    console.log('Cleaning directory: ' + DIST);
    fs.rmdirSync(DIST, { recursive: true });
}
fs.mkdirSync(DIST);

console.log('Fetching APIs from: ' + ADOBESIGN_SWAGGER_URL);

axios.get(ADOBESIGN_SWAGGER_URL)
    .then(function (response) {
        // handle success
        // console.log(response);
        response.data.apis.forEach(element => {

            console.log('Processing: ' + element.path);

            converter.convert(
                {
                    from: 'swagger_1',
                    to: 'swagger_2',
                    source: element.path,
                },
                function (err, converted) {
                    var options = { syntax: 'yaml', order: 'openapi' };
                    var fileName = element.path.substring(element.path.lastIndexOf('/')+1, element.path.length) + '.yaml';
                    var fileDest = DIST + fileName;

                    fs.writeFile(fileDest , converted.stringify(options), err => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        console.log('Wrote: ' + fileDest);
                    });
                });
        });
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });

