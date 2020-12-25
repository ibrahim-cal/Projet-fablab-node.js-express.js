module.exports = {
    populateMongo: _populateMongo,
};
var jsyaml = require('js-yaml');
var fs = require('fs');
var generateObject = require("./generate").generate;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function _populateMongo(url, opt, collection, urischema, duration, range, count) {
    //Test = mongoose.model(collection, new Schema(jsyaml.safeLoad(fs.readFileSync(schema, 'utf8'))), collection);
    var Test = mongoose.model(collection, new Schema(jsyaml.safeLoad(fs.readFileSync(urischema, 'utf8'))), collection);

    mongoose.connect(url, opt, function(error, success) {
        let counter_timer = 0;
        let interval = setInterval(function() {

            if (counter_timer == duration) {
                clearInterval(interval);
                mongoose.connection.close();
            } else {
                counter_timer++;
            }
            for (var i = 0; i < count; i++) {
                objectRan = generateObject();
                //console.log(objectRan);
                thing = new Test(objectRan);
                thing.save(objectRan);
            }
        }, range * 1000);

    });

}

//_populateMongo("mongodb://localhost/test", {}, "pruebasa", "./schema.yaml", 3, 2, 10);
