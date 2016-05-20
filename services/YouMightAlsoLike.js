var config = require('../config');
var SparqlClient = require('sparql-client-2');

var youmightalsolike = {};

youmightalsolike.search = function(q, cb) {
    console.log(q);
    
    sparqlEndpoint = 'http://' + config.endpoint.host + ':' + config.endpoint.port + config.endpoint.path;
    console.log(sparqlEndpoint);
    /*
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
    SELECT ?label ?uri
    WHERE {
        { ?s skos:prefLabel "Raphael"@en } UNION { ?s skos:prefLabel "Raphael" } .
        ?s skos:related ?uri .
        ?uri skos:prefLabel ?label .
        FILTER(LANG(?label) = "" || LANGMATCHES(LANG(?label), "en")) .
    }
    */
    var query = "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " +
                "SELECT ?prefLabel ?uri " +
                "WHERE { " +
                    "{ ?s skos:prefLabel ?query_en } UNION { ?s skos:prefLabel ?query } ." +
                    "?s skos:related ?uri ." +
                    "?uri skos:prefLabel ?prefLabel ." +
                    'FILTER(LANG(?prefLabel) = "" || LANGMATCHES(LANG(?prefLabel), "en")) . ' +
                "}";
    var client = 
        new SparqlClient(sparqlEndpoint, {
            defaultParameters: {
                format: 'json'
            }
        });

    client.query(query)
        //.bind("query", q)
        .bind({
            query_en: {value: q, lang: 'en'},
            query: q
        })
        .execute(function(error, sparql_results) {
            console.dir(sparql_results, {depth: null});
            
            var results = [];
            for (var i in sparql_results.results.bindings) {
                var b = sparql_results.results.bindings[i];
                console.log(b);
                var result = {
                    "label": b.prefLabel.value,
                    "uri": b.uri.value
                }
                results.push(result);
            }
            var response = {
                "service": "youmightalsolike",
                "q": q,
                "results": results
            }
            cb(null, response);
        });
}

module.exports = youmightalsolike;