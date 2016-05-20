var config = require('../config');
var SparqlClient = require('sparql-client-2');

var suggestions = {};

suggestions.search = function(q, minScore, cb) {
    console.log(q);
    
    sparqlEndpoint = 'http://' + config.endpoint.host + ':' + config.endpoint.port + config.endpoint.path;
    console.log(sparqlEndpoint);
    /*
    PREFIX bds: <http://www.bigdata.com/rdf/search#> 
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
    SELECT ?prefLabel ?altLabel ?score
    WHERE { 
        ?label bds:search 'Raphae*'^^<string> . 
        ?label bds:minRelevance .625 .
        ?label bds:matchAllTerms "true" .
        ?uri skos:prefLabel|skos:altLabel ?label . 
        ?label bds:relevance ?score . 
        ?label bds:rank ?rank . 
        BIND ( IF (?score = 1.0, 10000, ?score * ?rank) AS ?sc) 
        ?uri skos:prefLabel ?prefLabel .
        FILTER(LANG(?prefLabel) = "" || LANGMATCHES(LANG(?prefLabel), "en")) .
        BIND ( IF(?prefLabel != ?label, ?label, '') AS ?altLabel ) .
    } 
    ORDER BY DESC (?score)
    LIMIT 10
    */
    var query = "PREFIX bds: <http://www.bigdata.com/rdf/search#> " +
                "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " +
                "SELECT ?prefLabel ?altLabel ?sc " +
                "WHERE { " +
                    "?label bds:search ?query . " +
                    "?label bds:minRelevance ?minScore . " +
                    "?label bds:matchAllTerms 'true' . " +
                    "?uri skos:prefLabel|skos:altLabel ?label .  " +
                    "?label bds:relevance ?score . " + 
                    "?label bds:rank ?rank . " +
                    "BIND ( IF (?score = 1.0, 10000, ?score * ?rank) AS ?sc) . " +
                    "?uri skos:prefLabel ?prefLabel . " +
                    'FILTER(LANG(?prefLabel) = "" || LANGMATCHES(LANG(?prefLabel), "en")) . ' +
                    "BIND ( IF(?prefLabel != ?label, ?label, '') AS ?altLabel ) . " +
                "} " +
                "ORDER BY DESC (?sc) " +
                "LIMIT 10";
    var client = 
        new SparqlClient(sparqlEndpoint, {
            defaultParameters: {
                format: 'json'
            }
        });

    client.query(query)
        //.bind("query", q)
        .bind({
            query: {value: q + '*', type: 'string'},
            minScore: {value: minScore, type: 'decimal'}
        })
        .execute(function(error, sparql_results) {
            console.dir(sparql_results, {depth: null});
            
            var results = [];
            for (var i in sparql_results.results.bindings) {
                var b = sparql_results.results.bindings[i];
                console.log(b);
                var result = {
                    "prefLabel": b.prefLabel.value,
                    "altLabel": b.altLabel.value,
                    "score": b.sc.value
                }
                results.push(result);
            }
            var response = {
                "service": "suggestions",
                "q": q,
                "results": results
            }
            cb(null, response);
        });
}

module.exports = suggestions;