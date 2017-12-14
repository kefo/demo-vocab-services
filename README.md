# ULAN Search Service

This Node app is a service that provides a search API to Getty's [Union List of Artist Names](http://www.getty.edu/research/tools/vocabularies/ulan/) (ULAN). 
The purpose of creating our own app came from the need to to searches on a bulk amount of data, and the desire to be nice the Getty and not hammer their
services with our requests.

To that end, you'll need to do a few things to get this service up and running:

 * Download [Blazegraph](https://www.blazegraph.com) and initialize the graph database
 * Create and activate a Node environment
 * Clone repo and install node packages
 * Fetch ULAN data and trim it down to just the data what we need
 * Load data into Blazegraph
 * Run the app

Following are more details:

### Download Blazegraph and initialize

Download and follow the instructions here: https://www.blazegraph.com/download/

### Create and activate a Node environment

Install a node environment and activate:

```bash
nodeenv vsenv
cd vsenv/
. bin/activate
```

### Clone repo and install node packages

```bash
git clone https://github.com/kefo/demo-vocab-services.git
cd demo-vocab-services/
npm install
```

### Fetch ULAN data and trim it down to just the data what we need

Fetch source data:

```bash
mkdir source-data
cd source-data/
curl http://vocab.getty.edu/dataset/ulan/full.zip > ulan.zip
```

Unzip the files into a `ulan` subfolder. On a MAC I had to unpack it with the Archive Utility. But you can try:

```bash
mkdir ulan
unzip ulan.zip -d ulan/
```

### Load data into Blazegraph

Run the script to prune the data, then load it all into Blazegraph:

```bash
cd ..
cd initialize
./extract-ulan-triples.sh
./load-bg.sh
cd ..
```

### Run the app

```bash
node app.js
```

There are a few entry points in the interface:

* / - The home page will show a demo form you can use to tinker with the service endpoints
* /suggestions - An autosuggest endpoint. You can pass any part of a name along with optional birth and death dates to get a list of matches back.
* /didyoumean - Searches for exact matches among preferred names and alternate names. You can pass a full name along with optional birth and death dates to get a list of matches back.
* /youmightalsolike - 
