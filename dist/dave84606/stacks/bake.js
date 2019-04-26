#!/usr/bin/env node
var path = require('path');
var fs   = require('fs');
const args = require('yargs').argv;
const m = require("moment");
const bakery = require('bakery');
const c = require('./constants')('uat','TransferTravelUAT','transfertravel');


bakery.bake('ami-049fa56b43e1089d8');



