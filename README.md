# Demo Vocab Services

Rough, Basic Installation

General idea
    * Download Blazegraph and initialize
    * Create Node environment
    * Clone repo
    * Install node packages
    * Fetch and prep source data
    * Load data
    * Run
    
Install environment and activate
```bash
nodeenv vsenv
cd vsenv/
. bin/activate
```

Clone repo and install packages
```bash
git clone https://github.com/kefo/demo-vocab-services.git
cd demo-vocab-services/
npm install
```

Fetch source data, prep, and load
```bash
mkdir source-data
cd source-data/
curl http://vocab.getty.edu/dataset/ulan/full.zip > ulan.zip
```

You can try
```bash
unzip ulan.zip
```
but on a MAC I had to unpack it with the Archive Utility.

```bash
cd ..
cd initialize
./extract-ulan-triples.sh
./load-gb.sh
cd ..
```

Run
```bash
node app.js
```
