import Ember from 'ember';
import { test, module } from 'qunit';
import vectorSum from 'ember-vec-computed/macros/vector-sum';

var MyType = Ember.Object.extend({
    a: [1,2,3,4],
    b: 1,
    c: [2,2,2],
    d: [1,1,1,1,1,1],
    e: null,
    aa: Ember.computed.alias('a'),

    vectorSumSameArray5Times: vectorSum('d','d','d','d','d'),
    vectorSumArrayValueArray: vectorSum('c',2,'a'),
    vectorSumValueArray: vectorSum(2,'a'),
    vectorSumArrayComputedArray: vectorSum('a',Ember.computed.alias('b'),'a'),
    vectorSumArrayNullArray: vectorSum('a',null,'a'),
    vectorSumSingleArray: vectorSum('a'),
    vectorSumSingleValue: vectorSum('b'),
    vectorSumArrayWithItself: vectorSum('a','a'),
    vectorSumArrayWithLarger: vectorSum('a','d'),
    vectorSumArrayWithSmaller: vectorSum('a','c'),
    vectorSumArrayWithLargerThenSmaller: vectorSum('a','d','c'),
    vectorSumArrayWithItselfAliased: vectorSum('aa','aa'),
    vectorSumArrayWithItselfPassedIn: vectorSum(Ember.computed.alias('aa'),'aa'),
    vectorSumArrayWithNullValue: vectorSum('e')
});

var myObj;

module('vector-sum', {
  beforeEach: function () {
      myObj = MyType.create({
      });
  }
});

test('returns an array summed 5 times', function (assert) {
    assert.deepEqual(myObj.get('vectorSumSameArray5Times'), [5,5,5,5,5,5]);
});

test('returns a single value with an array', function (assert) {
    assert.deepEqual(myObj.get('vectorSumValueArray'), [3,4,5,6]);
});

test('returns an array with a null value then another array', function (assert) {
    assert.deepEqual(myObj.get('vectorSumArrayNullArray'), [2,4,6,8]);
});

test('returns an array with a computed value then another array', function (assert) {
    assert.deepEqual(myObj.get('vectorSumArrayComputedArray'), [3,5,7,9]);
});

test('returns an array with a single value then another array', function (assert) {
    assert.deepEqual(myObj.get('vectorSumArrayValueArray'), [5,6,7,6]);
});

test('returns an array with a single null value', function (assert) {
    assert.deepEqual(myObj.get('vectorSumArrayWithNullValue'), []);
});

test('returns an array added to itself (passed in)', function (assert) {
    assert.deepEqual(myObj.get('vectorSumArrayWithItselfPassedIn'), [2,4,6,8]);
});

test('returns an array added to itself (computed)', function (assert) {
    assert.deepEqual(myObj.get('vectorSumArrayWithItselfAliased'), [2,4,6,8]);
});

test('returns an array to a smaller array then larger array', function (assert) {
    assert.deepEqual(myObj.get('vectorSumArrayWithLargerThenSmaller'), [4,5,6,5,1,1]);
});

test('returns an array to a smaller array', function (assert) {
    assert.deepEqual(myObj.get('vectorSumArrayWithSmaller'), [3,4,5,4]);
});

test('returns an array to a larger array', function (assert) {
    assert.deepEqual(myObj.get('vectorSumArrayWithLarger'), [2,3,4,5,1,1]);
});

test('returns a single array value', function (assert) {
    assert.deepEqual(myObj.get('vectorSumSingleArray'), [1,2,3,4]);
});

test('returns a single value as an array', function (assert) {
    assert.deepEqual(myObj.get('vectorSumSingleValue'), [1]);
});

test('returns an array added to itself', function (assert) {
    assert.deepEqual(myObj.get('vectorSumArrayWithItself'), [2,4,6,8]);
});

