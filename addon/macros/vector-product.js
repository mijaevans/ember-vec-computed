
import {vectorReduceComputedPropertyMacro} from '../utils';


/**
  Returns an array that is the vector product of its arguments. The arguments can be
  arrays or scalars.

  The array arguments do not have to be arrays of the same length. The result will
  be array of the argument with the largest array.

  If a scalar value is passed as an argument then it is multiplied with each item 
  in the calculated array. 

  Example

  ```javascript
  var obj = Ember.Object.extend({
    a: [2,5],
    b: 7,
    c: [1,2,3],
    d: [1, 2, 3, 4],
    e: vectorProduct('a', 'b'),         // [14,35] i.e. [2*7, 5*7]
    f: vectorProduct('a', 'b', 'c', 2)  // [28, 140, 0] i.e. [2*7*1*2, 5*7*2*2, 0*7*3*2]
    g: vectorProduct('d')               // [1, 2, 3, 4] 
  });
  ```

  @method vector-product
  @for macros
  @param *arguments It can be numbers, arrays, property keys containing numbers, arrays or other computed properties.
  @return {Number} An array with the vector product of all its arguments.
*/
 
var vectorProduct = vectorReduceComputedPropertyMacro(function(prev, item) { 
    return (typeof prev === "undefined" || typeof item === "undefined" ? 0.0 : prev * item);
});
    
export default vectorProduct;

