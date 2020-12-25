# populaterandomDB
## Example for populating Mongo
``` javascript
//url, opts, collection,  url of schema, duration, range of time, amount
populate.populateMongo("mongodb://localhost/test", {}, "pruebasa", "./schema.yaml", 3, 2, 10);
```
## Example for populating ElasticSearch
``` javascript
// url, index,type,duration,range of time, amount
populate.populateElastic("localhost:9200", "test", "log", 30, 2, 10);
```
