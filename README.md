# Ember-vec-computed

This is an ember-cli addon. It implements the following Ember computed properties:

	sum(arg1, arg2, [arg3...])
	product(arg1, arg2, [arg3...])

These properties perform vector calculations between its arguments.Each argument can be an array, name of a property or another computed property e.g.

	EmVec.vector.sum('numCakes',4,EmVec.vector.product('icing',3))

The computed result is an array where each element is calculated from the corresponding elements in the arguments (e.g. arg0[0]+arg1[0]+arg2[0]). 

If an argument is a single value (e.g. 10.3) instead of an array then the value is applied to all elements. If an array does not have an value at the needed element (i.e. the dependent array has fewer elements) then zero is used as a default.

In ember-cli, the computed properties are imported from 'ember-vec-computed' module and are accessed from EmVec.vector. They can be also  installed into the Ember.computed namespace using the EmVec.install function.

Currently, this is a learning project. The computed properties should use the arrayComputed and reduceComputed methods. More computed properties will be added soon.

Many thanks to the ember-cpm project [https://github.com/cibernox/ember-cpm]. It was a great example on how to do this properly.

