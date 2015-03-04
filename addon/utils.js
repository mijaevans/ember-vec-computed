/*
Copyright 2013 James A. Rosen and other contributors

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
  EmberCPM Utils

  @module utils
  @requires ember
*/

import Ember from "ember";

/**
 Retain items in an array based on type

 Example:

 ```js
 var x = ['a', 'b', 123, {hello: 'world'}];

 retainByType(x, 'string'); // ['a', 'b']
 retainByType(x, 'number'); // [123]
 retainByType(x, 'object'); // [{hello: 'world'}]
 ```

 @method retainByType
 @for utils
 @param {Array}  arr  array to iterate over
 @param {String} type string representation of type

 */
export function retainByType(arr, type) {
  return arr.reject(
    function (item) {
      return Ember.typeOf(item) !== type;
    }
  );
}

export function getDependentPropertyKeys(argumentArr) {
  return argumentArr.reduce(
    function (prev, item) {
      switch (Ember.typeOf(item)) {
        case 'string':
          var containsSpaces = item.indexOf(' ') !== -1;

          if(!containsSpaces) {
            prev.push(item);
          }
          break;
        case 'boolean':
        case 'number':
          break;
        default:
          if (item && item.constructor === Ember.Descriptor && item._dependentKeys) {
            prev.pushObjects(item._dependentKeys);
          }
          break;
      }
      return prev;
    },
    Ember.A()
  );
}

/**
 Evaluate a value, which could either be a property key or a literal
 if the value is a string, the object that the computed property is installed
 on will be checked for a property of the same name. If one is found, it will
 be evaluated, and the result will be returned. Otherwise the string value its
 self will be returned

 All non-string values pass straight through, and are returned unaltered

 @method getVal
 @param val value to evaluate
 */
export function getVal(val) {
  if (Ember.typeOf(val) === 'string') {
    var propVal = Ember.get(this, val);
    return  'undefined' === typeof propVal ? val : propVal;
  } else if (Ember.typeOf(val) === 'object' && Ember.Descriptor === val.constructor) {
    return val.altKey ? this.get(val.altKey) : val.func.apply(this);
  } else {
    return val;
  }
}


/**
 Generate a "parse-like" computed property macro

 Example:
 ```js
 parseComputedPropertyMacro(function (raw) {return parseFloat(raw);});
 ```

 @method parseComputedPropertyMacro
 @param {function} parseFunction single-argument function that transforms a raw value into a "parsed" value
 */
export function parseComputedPropertyMacro (parseFunction) {
  return function parseMacro(dependantKey) {
    var args = [];
    if ('undefined' === typeof dependantKey) {
      throw new TypeError('No argument');
    }
    if (dependantKey === null) {
      throw new TypeError('Null argument');
    }
    args.push(dependantKey);
    args.push(function (propKey, val) {
      if (arguments.length === 1) {
        //getter
        var rawValue = this.get(dependantKey);

        // Check for null/undefined values
        if (Ember.A(['undefined', 'null']).indexOf(Ember.typeOf(rawValue)) !== -1) {
          return NaN;
        }
        else {
          // Handle some unexpected behavior for empty-string property keys
          // related:
          //  https://github.com/emberjs/ember.js/commit/b7e82f43c3475ee7b166a2570b061f08c6c6c0f3#diff-22c6caff03531b3e718e9a8d82180833R31
          if ('string' === typeof rawValue && rawValue.length === 0) {
            return NaN;
          }
          else {
            return parseFunction(rawValue);
          }
        }
      }
      else {
        //setter
        //respect the type of the dependent property
        switch (Ember.typeOf(this.get(dependantKey))) {
          case 'number':
            this.set(dependantKey, parseFloat(val));
            break;
          case 'boolean':
            switch(Ember.typeOf(val)) {
              case 'string':
                this.set(dependantKey, val.toLowerCase() === 'true');
                break;
              case 'number':
                this.set(dependantKey, val !== 0);
                break;
              default:
                var msg = Ember.String.fmt('Can\'t transform value of type %@ into a boolean', Ember.typeOf(val));
                throw new TypeError(msg);
            }
            break;
          default:
            this.set(dependantKey, val.toString());
            break;
        }
        return val;
      }
    });
    return Ember.computed.apply(this, args);
  };
}

/**
 Return a computed property macro

 @method reduceComputedPropertyMacro
 @param {Function} reducingFunction
 @param {Object} options
 */
export function reduceComputedPropertyMacro(reducingFunction, options) {
  var opts = options || {};
  var singleItemCallback = opts.singleItemCallback || function (item) {return getVal.call(this,item);};

  return function () {
    var mainArguments = Array.prototype.slice.call(arguments); // all arguments
    Ember.assert('Error: At least one argument is required', mainArguments.length > 0);

    var propertyArguments = getDependentPropertyKeys(mainArguments);

    propertyArguments.push(function () {
      var self = this;
      switch (mainArguments.length) {
        // case 0:   // We already handle the zero-argument case above
        case 1:   // Handle one-argument case
          return singleItemCallback.call(this, mainArguments[0]);

        default:  // Handle multi-argument case
          return mainArguments.reduce(
            function (prev, item, idx, enumerable) {
              // Evaluate "prev" value if this is the first time the reduce callback is called
              var prevValue = idx === 1 ? getVal.call(self, prev) : prev,

                // Evaluate the "item" value
                itemValue = getVal.call(self, item);

              // Call the reducing function, replacing "prev" and "item" arguments with
              // their respective evaluated values
              return reducingFunction.apply(self, [prevValue, itemValue, idx, enumerable]);

            }
          );
      }
    });
    return Ember.computed.apply(this, propertyArguments);
  };
}



/**
 Return a computed property macro for vector calculations

 @method vectorReduceComputedPropertyMacro
 @param {Function} vectorFunction
 */

export function  vectorReduceComputedPropertyMacro(vectorFunction) {

    return reduceComputedPropertyMacro(
        function (prev, current,idx,enumerable) {
            // Make a copy of the first argument as an array to accummulate into.
            var accummulated = prev;
            if (idx === 1) {
                // Find the largest array in the arguments list
                var maxLength = 0;
                enumerable.forEach(function(item) { 
                    var val = getVal.call(this,item);
                    maxLength = (Ember.isArray(val) && maxLength < val.length ? val.length : maxLength);
                },this);

                // Default the accummulated array to the prev value (i.e. first argument)
                var isFirstArgArray = Ember.isArray(prev);
                accummulated = Ember.copy(Ember.makeArray(prev),true);

                // Set the end of accummulated array to zeros or a scalar argument
                for(var i=accummulated.length; i < maxLength; i++) {
                    accummulated[i] = isFirstArgArray ? 0.0 : prev;
                }
            } 

            // If combining with an array then combine each item in the array with the accummulated
            var isCurrentArray = Ember.isArray(current);
            accummulated.forEach(function(val,index) { 
                accummulated[index] = vectorFunction.call(this,val,isCurrentArray ? current[index] : current);
            });
            return accummulated;
        },
        {
            // Return the argument as a new array
            singleItemCallback: function (item) {
                return Ember.copy(Ember.makeArray(getVal.call(this, item)),true);
            }
        }
      );
}
