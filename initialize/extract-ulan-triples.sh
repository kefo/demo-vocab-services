#!/bin/bash

DIR=`pwd`

grep '\(http://www.w3.org/2004/02/skos/core#exactMatch\|http://www.w3.org/2004/02/skos/core#closeMatch\).*loc.gov' ../source-data/ulan/ULANOut_Full.nt > ../source-data/ulan/ULAN_LOCIDs.nt
grep http://www.w3.org/2004/02/skos/core#prefLabel ../source-data/ulan/ULANOut_Full.nt > ../source-data/ulan/ULAN_PrefLabels.nt
grep http://www.w3.org/2004/02/skos/core#altLabel ../source-data/ulan/ULANOut_Full.nt > ../source-data/ulan/ULAN_AltLabels.nt
grep http://www.w3.org/2004/02/skos/core#related ../source-data/ulan/ULANOut_Full.nt > ../source-data/ulan/ULAN_Related.nt

# Import all the triple relationships needed to get to the birth date
grep http://xmlns.com/foaf/0.1/focus ../source-data/ulan/ULANOut_Full.nt > ../source-data/ulan/ULAN_Focus.nt
grep http://vocab.getty.edu/ontology#biographyPreferred ../source-data/ulan/ULANOut_Full.nt > ../source-data/ulan/ULAN_BioPreferred.nt
grep http://vocab.getty.edu/ontology#estStart ../source-data/ulan/ULANOut_Full.nt > ../source-data/ulan/ULAN_BirthDate.nt
grep http://vocab.getty.edu/ontology#estEnd ../source-data/ulan/ULANOut_Full.nt > ../source-data/ulan/ULAN_DeathDate.nt

