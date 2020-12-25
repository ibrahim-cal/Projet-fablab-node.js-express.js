module.exports = {
    populateElastic: _populateElastic,
};
var jsyaml = require('js-yaml');
var fs = require('fs');
var generateObject = require("./generate").generate;
var elasticsearch = require('elasticsearch');
var client;



function _populateElastic(url, index, type, duration, range, count) {
    client = new elasticsearch.Client({
        host: url,
    })
    let metainfo = {
        "index": {
            "_index": index,
            "_type": type
        }
    };
    let counter_timer = 0;

    let interval = setInterval(function() {
        if (counter_timer == duration) {
            clearInterval(interval);
        } else {
            counter_timer++;
        }
        let array = [];
        for (var i = 0; i < count; i++) {
            objectRan = generateObject();
            array.push(metainfo);
            array.push(objectRan);
        }
        _sendBulk(array);

    }, range * 1000);


}



function _sendBulk(object) {
    return new Promise(function(resolve, reject) {
        client.bulk({
            body: object
        }, function(err, resp) {
            if (resp) {
                //console.log(resp);
                resolve(resp);
            }

            if (err) {
                reject(err);
            }
        });
    });
}
//_populateElastic("localhost:9200", "test", "log", 30, 2, 10);
