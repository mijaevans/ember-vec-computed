
import {vectorReduceComputedPropertyMacro} from '../utils';


/**
  Returns an array that is the vector sum of its arguments. The arguments can be
  arrays or scalars.

  The array arguments do not have to be arrays of the same length. The result will
  be array of the argument with the largest array.

  If a scalar value is passed as an argument then it is added to each item 
  in the calculated array. 

  Example

  ```javascript
  var obj = Ember.Object.extend({
    a: [2,5],
    b: 7,
    c: [1,2,3],
    d: [1, 2, 3, 4],
    e: vectorSum('a', 'b'),         // [9,12] i.e. [2+7, 5+7]
    f: vectorSum('a', 'b', 'c', 2)  // [12,16,5] i.e. [2+7+1+2, 5+7+2+2, 3+2]
    g: vectorSum('d')               // [1, 2, 3, 4] 
  });
  ```

  @method vector-sum
  @for macros
  @param *arguments It can be numbers, arrays, property keys containing numbers, arrays or other computed properties.
  @return {Number} An array with the vector sum of all its arguments.
*/
 
var vectorSum = vectorReduceComputedPropertyMacro(function(prev, item) { 
    return (typeof prev === "undefined" ? item : (typeof item === "undefined" ? prev : prev + item));
});
    
export default vectorSum;
