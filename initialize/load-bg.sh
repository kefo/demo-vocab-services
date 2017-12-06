#!/bin/bash

# This file adapted from https://wiki.blazegraph.com/wiki/index.php/Bulk_Data_Load

FILE_OR_DIR=$1

if [ -f "/etc/default/blazegraph" ] ; then
    . "/etc/default/blazegraph" 
else
    JETTY_PORT=9999
fi


DIR=`pwd`

LOAD_PROP_FILE=/tmp/$$.properties

export NSS_DATALOAD_PROPERTIES=$DIR/RWStore.properties

#Probably some unused properties below, but copied all to be safe.
cat <<EOT >> $LOAD_PROP_FILE
quiet=false
verbose=1
closure=false
durableQueues=false
#Needed for quads
#defaultGraph=
com.bigdata.rdf.store.DataLoader.flush=false
com.bigdata.rdf.store.DataLoader.bufferCapacity=100000
com.bigdata.rdf.store.DataLoader.queueCapacity=10
#Namespace to load
namespace=ulan
#Files to load
fileOrDirs=$DIR/../source-data/ulan/ULAN_AltLabels.nt,$DIR/../source-data/ulan/ULAN_BioPreferred.nt,$DIR/../source-data/ulan/ULAN_BirthDate.nt,$DIR/../source-data/ulan/ULAN_DeathDate.nt,$DIR/../source-data/ulan/ULAN_Focus.nt,$DIR/../source-data/ulan/ULAN_PrefLabels.nt,$DIR/../source-data/ulan/ULAN_Related.nt
#Property file (if creating a new namespace)
propertyFile=$NSS_DATALOAD_PROPERTIES
EOT

echo 
echo "Loading with properties..."

cat $LOAD_PROP_FILE

echo 
echo "Loading with REST call..."
echo "curl -X POST --data-binary @${LOAD_PROP_FILE} --header 'Content-Type:text/plain' http://localhost:${JETTY_PORT}/blazegraph/dataloader"

curl -X POST --data-binary @${LOAD_PROP_FILE} --header 'Content-Type:text/plain' http://localhost:${JETTY_PORT}/blazegraph/dataloader

echo 
echo 

#Let the output go to STDOUT/ERR to allow script redirection
rm -f $LOAD_PROP_FILE



