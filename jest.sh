#!/bin/sh
H=$PWD;
ACS=$H/../acs-client

cd $ACS
npm run dist

rm -rf $H/node_modules/acs-client/dist/*
cp -r $ACS/dist/* $H/node_modules/acs-client/dist

cd $H
npm run dist
./node_modules/.bin/jest dist/test/*.test.js
