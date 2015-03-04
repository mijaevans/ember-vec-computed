import Ember from 'ember';
import vecSum from './macros/vector-sum';
import vecProduct from './macros/vector-product';

var VERSION = "0.1";
var vector = {
	sum: vecSum,
	product: vecProduct
};

var install = function() {
	for (var fncKey in vector) {
		var propKey = Ember.String.camelize("vector-" & fncKey);
		if (vector.hasOwnProperty(fncKey) && !Ember.computed.hasOwnProperty(propKey)) {
			Ember.conputed[propKey] = vector[fncKey];
		}
	}
};

export {
	VERSION,
	install,
	vector
};

export default {
	VERSION: VERSION,
	install: install,
	vector: vector
};
