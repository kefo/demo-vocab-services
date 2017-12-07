var config = require('../config');
var SparqlClient = require('sparql-client-2');

var suggestions = {};

suggestions.search = function(q, y, minScore, cb) {
    console.log('q: ', q);
    console.log('y: ', y);
    console.log('minScore: ', minScore);

    sparqlEndpoint = 'http://' + config.endpoint.host + ':' + config.endpoint.port + config.endpoint.path;
    console.log('sparqlEndpoint: ', sparqlEndpoint);

    /* Sample SPARQL query:
    PREFIX bds: <http://www.bigdata.com/rdf/search#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
	PREFIX getty: <http://vocab.getty.edu/ontology#>
	PREFIX foaf: <http://xmlns.com/foaf/0.1/>
	PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

	SELECT ?prefLabel ?altLabel ?score
    WHERE {
	?uri skos:prefLabel|skos:altLabel ?label .
	?label bds:search 'Hopper, Edward'^^<string> .
	?label bds:minRelevance .625 .
	?label bds:matchAllTerms "true" .

	?uri foaf:focus ?agent .
	?agent getty:biographyPreferred ?bio .
	?bio getty:estStart "1882"^^xsd:gYear .

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
	"PREFIX getty: <http://vocab.getty.edu/ontology#> " +
	"PREFIX foaf: <http://xmlns.com/foaf/0.1/> " +
	"PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> " +

	"SELECT ?prefLabel ?altLabel ?score ?uri " +
	"WHERE { " +
	" ?uri skos:prefLabel|skos:altLabel ?label . " +
	" ?label bds:search ?query . " +
	" ?label bds:minRelevance ?minScore . " +
	" ?label bds:matchAllTerms 'true' . ";

    if (y) {
	query += " ?uri foaf:focus ?agent . " +
	    " ?agent getty:biographyPreferred ?bio . " +
	    " ?bio getty:estStart ?birthYear^^xsd:gYear . ";
    }

    query += " ?label bds:relevance ?score . " +
	" ?label bds:rank ?rank . " +
	" BIND ( IF (?score = 1.0, 10000, ?score * ?rank) AS ?score) " +
	" ?uri skos:prefLabel ?prefLabel . " +
	" FILTER(LANG(?prefLabel) = '' || LANGMATCHES(LANG(?prefLabel), 'en')) . " +
	" BIND ( IF(?prefLabel != ?label, ?label, '') AS ?altLabel ) . " +
	"} " +
	"ORDER BY DESC (?score) " +
	"LIMIT 10";

    var client =
	new SparqlClient(sparqlEndpoint, {
	    defaultParameters: {
		format: 'json'
	    }
	});

    var binds = {
	query: {value: q + '*', type: 'string'},
	minScore: {value: minScore, type: 'decimal'}
    };
    if (y) {
	binds.birthYear = y;
    }

    client.query(query)
	//.bind("query", q)
	.bind(binds)
	.execute(function(error, sparql_results) {
	    console.dir(sparql_results, {depth: null});
	    console.log('error: ', error);

	    var results = [];
	    for (var i in sparql_results.results.bindings) {
		var b = sparql_results.results.bindings[i];
		console.log(b);
		var result = {
		    "prefLabel": b.prefLabel.value,
		    "altLabel": b.altLabel.value,
		    "score": b.score.value,
		    "uri": b.uri
		}
		results.push(result);
	    }
	    var response = {
		"service": "suggestions",
		"q": q,
		"y": y,
		"results": results
	    }
	    cb(null, response);
	});
}

module.exports = suggestions;
