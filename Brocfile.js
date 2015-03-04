/* jshint node: true */
/* global require, module */

var emberVecComputed;

if (process.argv[2] === 'build') {
	var dist = require('broccoli-dist-es6-module');
	var funnel = require('broccoli-funnel');

	var transpiled = dist('addon', {
		global: 'emberVecComputed',
		packageName: 'ember-vec-computed',
		main: 'index',
		shim: {'ember': 'Ember' }
	});

	emberVecComputed = new funnel(transpiled, {
		getDestinationPath: function(relPath) {
			if (/main.js/.test(relPath)) {
				return relPath.replace('main.js','ember-vec-computed.js');
			}
			return relPath;
		}
	});

	if (process.env.EMBER_ENV === 'production') {
		var mergeTrees = require('broccoli-merge-trees');
		var uglify = require('broccoli-uglify-js');
		var defeatureify = require('broccoli-defeatureify');
	    var defeatureifyOpts = {
	      enableStripDebug: true,
	      debugStatements: [
	        "Ember.warn",
	        "emberWarn",
	        "Ember.assert",
	        "emberAssert",
	        "Ember.deprecate",
	        "emberDeprecate",
	        "Ember.debug",
	        "emberDebug",
	        "Ember.Logger.info",
	        "Ember.runInDebug",
	        "runInDebug"
	      ]
	    };

		var devBuild = defeatureify(emberVecComputed,defeatureifyOpts);
		var minBuild = uglify(defeatureify(emberVecComputed,defeatureifyOpts));
		minBuild = new funnel(minBuild, {
			getDestinationPath: function(relPath) {
				if (/(globals|named-amd)/.test(relPath)) {
					return relPath.replace('ember-vec-computed.js', 'ember-vec-computed.min.js');
				}
				return relPath;
			}
		});

		emberVecComputed = mergeTrees([devBuild,minBuild], {overwrite: true});
	}
} else {
	var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

	var app = new EmberAddon();

	emberVecComputed = app.toTree();
}

module.exports = emberVecComputed;
