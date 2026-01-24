import "./styles.css";

document.getElementById("app").innerHTML = `
<h1>Hello Javascript!</h1>
`;

Array.prototype.myAt = function (index) {
  const thisArray = this;
  const idx = index >= 0 ? index : thisArray.length + index;
  return thisArray[idx];
};

Array.prototype.myConcat = function (...items) {
  const A = Array.from(this);
  let n = A.length;

  items.forEach((e) => {
    // The actual spec checks for the `Symbol.isConcatSpreadable` property.
    if (Array.isArray(e)) {
      const len = e.length;
      let k = 0;
      while (k < len) {
        // Ignore index if value is not defined for index (e.g. in sparse arrays).
        const exists = Object.hasOwn(e, k);
        if (exists) {
          const subElement = e[k];
          A[n] = subElement;
        }
        n += 1;
        k += 1;
      }
    } else {
      A[n] = e;
      n += 1;
    }
  });

  return A;
};
Array.prototype.myFilter = function (callbackFn, thisArg) {
  if (typeof callbackFn !== "function") {
    throw new TypeError(`${callbackFn} is not a function`);
  }
  const thisArray = this;
  const resultArray = [];
  const len = thisArray.length;

  for (let i = 0; i < len; i++) {
    if (i in thisArray) {
      const element = thisArray[i];
      if (callbackFn.call(thisArg, element, i, thisArray)) {
        resultArray.push(element);
      }
    }
  }
  return resultArray;
};

Array.prototype.myMap = function (callbackFn, thisArg) {
  if (
    typeof callbackFn !== "function" ||
    !callbackFn.call ||
    !callbackFn.apply
  ) {
    throw new TypeError(`${callbackFn} is not a function`);
  }
  const thisArray = this;
  const len = thisArray.length;
  const resultArray = new Array(len);

  for (let i = 0; i < len; i++) {
    if (i in thisArray) {
      const element = thisArray[i];
      resultArray[i] = callbackFn.call(thisArg, element, i, thisArray);
    }
  }
  return resultArray;
};

Array.prototype.myReduce = function (callbackFn, initialValue) {
  if (
    typeof callbackFn !== "function" ||
    !callbackFn.call ||
    !callbackFn.apply
  ) {
    throw new TypeError(`${callbackFn} is not a function`);
  }
  const thisArray = this;
  const noInitialValue = initialValue === undefined;
  const len = thisArray.length;
  let accumulator = noInitialValue ? thisArray[0] : initialValue;
  let startIndex = noInitialValue ? 1 : 0;
  if (noInitialValue && len === 0) {
    throw new TypeError("Reduce of empty array with no initial value");
  }
  for (let i = startIndex; i < len; i++) {
    if (i in thisArray) {
      const element = thisArray[i];
      accumulator = callbackFn(accumulator, element, i, thisArray);
    }
  }
  return accumulator;
};
