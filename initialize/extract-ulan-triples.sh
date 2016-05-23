#!/bin/bash

DIR=`pwd`

grep http://www.w3.org/2004/02/skos/core#prefLabel ../source-data/ulan/ULANOut_Full.nt > ../source-data/ulan/ULAN_PrefLabels.nt
grep http://www.w3.org/2004/02/skos/core#altLabel ../source-data/ulan/ULANOut_Full.nt > ../source-data/ulan/ULAN_AltLabels.nt
grep http://www.w3.org/2004/02/skos/core#related ../source-data/ulan/ULANOut_Full.nt > ../source-data/ulan/ULAN_Related.nt

