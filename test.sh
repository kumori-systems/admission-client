#!/bin/sh
H=$PWD;
ACS=$H/../acs-client

cd $ACS
for p in ./src;do
  rm $p/*js
  rm $p/*map
done
$ACS/node_modules/.bin/tsc -p $ACS/tsconfig.json
rm -rf $H/node_modules/acs-client/src/*
cp -r $ACS/src/* $H/node_modules/acs-client/src

cd $H
for p in ./src ./tests;do
  rm $p/*js
  rm $p/*map
done
$H/node_modules/.bin/tsc -p $H/tsconfig.json
node test/test.js

