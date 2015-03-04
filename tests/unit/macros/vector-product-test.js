import Ember from 'ember';
import { test, module } from 'qunit';
import vectorProduct from 'ember-vec-computed/macros/vector-product';

var MyType = Ember.Object.extend({
    a: [1,2,3,4],
    b: 1,
    c: [2,2,2],
    d: [1,1,1,1,1,1],
    e: null,
    aa: Ember.computed.alias('a'),

    vectorProductSameArray5Times: vectorProduct('d','d','d','d','d'),
    vectorProductArrayValueArray: vectorProduct('a',2,'a'),
    vectorProductArrayComputedArray: vectorProduct('a',Ember.computed.alias('b'),'a'),
    vectorProductArrayNullArray: vectorProduct('a',null,'a'),
    vectorProductSingleArray: vectorProduct('a'),
    vectorProductSingleValue: vectorProduct('b'),
    vectorProductArrayWithItself: vectorProduct('c','c'),
    vectorProductArrayWithLarger: vectorProduct('a','d'),
    vectorProductArrayWithSmaller: vectorProduct('a','c'),
    vectorProductArrayWithLargerThenSmaller: vectorProduct('a','d','c'),
    vectorProductArrayWithItselfAliased: vectorProduct('aa','aa'),
    vectorProductArrayWithItselfPassedIn: vectorProduct(Ember.computed.alias('aa'),'aa'),
    vectorProductArrayWithNullValue: vectorProduct('e')
});

var myObj;

module('vector-product', {
  beforeEach: function () {
    myObj = MyType.create();
  }
});

test('returns an array multiplied 5 times', function (assert) {
    assert.deepEqual(myObj.get('vectorProductSameArray5Times'), [1,1,1,1,1,1]);
});

test('returns an array multiplied with a null value then another array', function(assert) {
    assert.deepEqual(myObj.get('vectorProductArrayNullArray'), [0,0,0,0]);
});

test('returns an array multiplied with a computed value then another array', function(assert) {
    assert.deepEqual(myObj.get('vectorProductArrayComputedArray'), [1,4,9,16]);
});

test('returns an array with a single value then another array', function(assert) {
    assert.deepEqual(myObj.get('vectorProductArrayValueArray'), [2,8,18,32]);
});

test('returns from a single null value', function(assert) {
    assert.deepEqual(myObj.get('vectorProductArrayWithNullValue'), []);
});

test('returns an array multiplied with itself (passed in)', function(assert) {
    assert.deepEqual(myObj.get('vectorProductArrayWithItselfPassedIn'), [1,4,9,16]);
});

test('returns an array multiplied with itself (computed)', function(assert) {
    assert.deepEqual(myObj.get('vectorProductArrayWithItselfAliased'), [1,4,9,16]);
});

test('returns an array multiplied with a smaller array then larger array', function(assert) {
    assert.deepEqual(myObj.get('vectorProductArrayWithLargerThenSmaller'), [2,4,6,0,0,0]);
});

test('returns an array multiplied with a smaller array', function(assert) {
    assert.deepEqual(myObj.get('vectorProductArrayWithSmaller'), [2,4,6,0]);
});

test('returns an array multiplied with a larger array', function(assert) {
    assert.deepEqual(myObj.get('vectorProductArrayWithLarger'), [1,2,3,4,0,0]);
});

test('returns a single array value', function(assert) {
    assert.deepEqual(myObj.get('vectorProductSingleArray'), [1,2,3,4]);
});

test('returns a single value as an array', function(assert) {
    assert.deepEqual(myObj.get('vectorProductSingleValue'), [1]);
});

test('returns an array multiplied with itself', function(assert) {
    assert.deepEqual(myObj.get('vectorProductArrayWithItself'), [4,4,4]);
});


