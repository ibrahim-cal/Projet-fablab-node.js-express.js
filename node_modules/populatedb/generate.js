var jsyaml = require('js-yaml');
var fs = require('fs');
var moment = require('moment');

module.exports = {
    generate: _generate,
};



function _generate() {
    var template = fs.readFileSync(__dirname + '/template.yaml', 'utf8');
    var object = jsyaml.safeLoad(template);
    var fields = object.randomFields;
    var body = object.body;
    for (var key in fields) {
        let objects = fields[key];
        let charReplaced = '"{{' + key + '}}"';
        var re = new RegExp(charReplaced, "g");
        if (!objects.indexOf("Date")) {
            body = body.replace(re, '"' + moment().toISOString() + '"');
        } else {
            body = body.replace(re, '"' + objects[Math.floor(Math.random() * (objects.length - 1))] + '"');

        }
    }

    try {
        body = JSON.parse(body);
    } catch (e) {
        throw new Error("Render has not finished, please you should sure");
    }
    return body;
}

_generate();
