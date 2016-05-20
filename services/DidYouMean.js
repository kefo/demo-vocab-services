var config = require('../config');
var SparqlClient = require('sparql-client-2');

var didyoumean = {};

didyoumean.search = function(q, minScore, cb) {
    console.log(q);
    
    sparqlEndpoint = 'http://' + config.endpoint.host + ':' + config.endpoint.port + config.endpoint.path;
    console.log(sparqlEndpoint);
    /*
    PREFIX bds: <http://www.bigdata.com/rdf/search#> 
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
    SELECT ?prefLabel ?uri (MAX(?sc) as ?maxSC)
    WHERE { 
        ?label bds:search 'Leonardo'^^<string> . 
        ?label bds:minRelevance .625 .
        ?label bds:matchAllTerms "true" .
        ?uri skos:altLabel|skos:prefLabel ?label . 
        ?label bds:relevance ?score . 
        ?label bds:rank ?rank . 
        BIND ( IF (?score = 1.0, 10000, ?score * ?rank) AS ?sc)
        ?uri skos:prefLabel ?prefLabel .
        FILTER(LANG(?prefLabel) = "" || LANGMATCHES(LANG(?prefLabel), "en"))
    } 
    GROUP BY ?prefLabel ?uri
    ORDER BY DESC (?maxSC) 
    LIMIT 5
    */
    var query = "PREFIX bds: <http://www.bigdata.com/rdf/search#> " +
                "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " +
                "SELECT ?prefLabel ?uri (MAX(?sc) as ?maxSC)" +
                "WHERE { " +
                    "?label bds:search ?query . " +
                    "?label bds:minRelevance ?minScore . " +
                    "?label bds:matchAllTerms 'true' . " +
                    "?uri skos:altLabel|skos:prefLabel ?label . " +
                    "?label bds:relevance ?score . " + 
                    "?label bds:rank ?rank . " +
                    "BIND ( IF (?score = 1.0, 10000, ?score * ?rank) AS ?sc) . " +
                    "?uri skos:prefLabel ?prefLabel . " +
                    'FILTER(LANG(?prefLabel) = "" || LANGMATCHES(LANG(?prefLabel), "en")) . ' +
                "} " +
                "GROUP BY ?prefLabel ?uri " +
                "ORDER BY DESC (?maxSC) " +
                "LIMIT 5";
    var client = 
        new SparqlClient(sparqlEndpoint, {
            defaultParameters: {
                format: 'json'
            }
        });

    client.query(query)
        //.bind("query", q)
        .bind({
            query: {value: q, type: 'string'},
            minScore: {value: minScore, type: 'decimal'}
        })
        .execute(function(error, sparql_results) {
            console.dir(results, {depth: null});
            
            var results = [];
            for (var i in sparql_results.results.bindings) {
                var b = sparql_results.results.bindings[i];
                console.log(b);
                var result = {
                    "label": b.prefLabel.value,
                    "score": b.maxSC.value,
                    "uri": b.uri.value,
                }
                results.push(result);
            }
            var response = {
                "service": "didyoumean",
                "q": q,
                "results": results
            }
            cb(null, response);
        });
}

module.exports = didyoumean;