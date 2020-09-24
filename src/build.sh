#!/bin/bash

cat ./gui/node.js \
./gui/nodeFactory.js \
./gui/edge.js  \
./gui/graph.js  \
./gui/events.js \
./gui/common.js > ../javascripts/twin.js

sed -E 's/console.log\((.*)\);?//g' ../javascripts/twin.js > ../javascripts/twin.min.js

