var config = require('../config');
var SparqlClient = require('sparql-client-2');

var suggestions = {};

suggestions.search = function(q, by, dy, minScore, cb) {
    console.log('q: ', q);
    console.log('by: ', by);
    console.log('dy: ', dy);
    console.log('minScore: ', minScore);

    sparqlEndpoint = 'http://' + config.endpoint.host + ':' + config.endpoint.port + config.endpoint.path;
    console.log('sparqlEndpoint: ', sparqlEndpoint);

    /* Sample SPARQL query:
    PREFIX bds: <http://www.bigdata.com/rdf/search#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX getty: <http://vocab.getty.edu/ontology#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    SELECT ?prefLabel ?sc ?uri ?locUri
    WHERE {
	?uri skos:prefLabel|skos:altLabel ?label .
	?label bds:search 'Hopper, Edward'^^<string> .
	?label bds:minRelevance .625 .
	?label bds:matchAllTerms 'true' .

	?uri foaf:focus ?agent .
	?agent getty:biographyPreferred ?bio .
	?bio getty:estStart "1882"^^xsd:gYear .

	?uri foaf:focus ?agent .
	?agent getty:biographyPreferred ?bio .
	?bio getty:estEnd "1967"^^xsd:gYear .

	?label bds:relevance ?score .
	?label bds:rank ?rank .
	BIND ( IF (?score = 1.0, 10000, ?score * ?rank) AS ?sc)
	?uri skos:exactMatch ?locUri .
	FILTER(str(?locUri) = "" || regex(str(?locUri), "^http://id.loc.gov") ) .
	?uri skos:prefLabel ?prefLabel .
	FILTER(LANG(?prefLabel) = "" || LANGMATCHES(LANG(?prefLabel), "en")) .
	BIND ( IF(?prefLabel != ?label, ?label, '') AS ?altLabel ) .
    }
    ORDER BY DESC (?sc)
    LIMIT 10
    */
    var query = "PREFIX bds: <http://www.bigdata.com/rdf/search#> " +
	"PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " +
	"PREFIX getty: <http://vocab.getty.edu/ontology#> " +
	"PREFIX foaf: <http://xmlns.com/foaf/0.1/> " +
	"PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> " +

	"SELECT ?prefLabel ?sc ?uri ?locUri " +
	"WHERE { " +
	" ?uri skos:prefLabel|skos:altLabel ?label . " +
	" ?label bds:search ?query . " +
	" ?label bds:minRelevance ?minScore . " +
	" ?label bds:matchAllTerms 'true' . ";

    if (by != null) {
	query += " ?uri foaf:focus ?agent . " +
	    " ?agent getty:biographyPreferred ?bio . " +
	    " ?bio getty:estStart ?birthYear^^xsd:gYear . ";
    }
    if (dy != null) {
	query += " ?uri foaf:focus ?agent . " +
	    " ?agent getty:biographyPreferred ?bio . " +
	    " ?bio getty:estEnd ?deathYear^^xsd:gYear . ";
    }

    query += " ?label bds:relevance ?score . " +
	" ?label bds:rank ?rank . " +
	" BIND ( IF (?score = 1.0, 10000, ?score * ?rank) AS ?sc) " +
	" ?uri skos:exactMatch ?locUri . " +
	" FILTER(str(?locUri) = '' || regex(str(?locUri), '^http://id.loc.gov') ) . " +
	" ?uri skos:prefLabel ?prefLabel . " +
	" FILTER(LANG(?prefLabel) = '' || LANGMATCHES(LANG(?prefLabel), 'en')) . " +
	" BIND ( IF(?prefLabel != ?label, ?label, '') AS ?altLabel ) . " +
	"} " +
	"ORDER BY DESC (?sc) " +
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
    if (by != null) {
	binds.birthYear = by;
    }
    if (dy != null) {
	binds.deathYear = dy;
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
		    "score": b.sc.value,
		    "uri": b.uri,
		    "locUri": b.locUri
		}
		results.push(result);
	    }
	    var response = {
		"service": "suggestions",
		"q": q,
		"by": by,
		"dy": dy,
		"results": results
	    }
	    cb(null, response);
	});
}

module.exports = suggestions;
