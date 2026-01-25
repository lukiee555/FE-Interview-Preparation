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

export class EventEmitter {
  constructor() {
    // We will use Object.create(null) to avoid prototype pollution
    this.events = Object.create(null);
  }
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }
  off(event, listener) {
    if (!this.events[event]) return this;
    this.events[event] = this.events[event].filter((l) => l !== listener);
    return this;
  }
  emit(event, ...args) {
    if (!this.events[event]) return false;
    this.events[event].forEach((listener) => {
      listener.apply(this, args);
    });
    return true;
  }
}

export class EventEmitter2 {
  constructor() {
    this.events = Object.create(null);
    this.key = 0;
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = {};
    }
    const id = this.key;
    this.events[event][id] = listener;
    this.key += 1;
    return {
      off: () => {
        delete this.events[event][id];
      },
    };
  }
  emit(event, ...args) {
    if (!this.events[event]) return false;
    Object.values(this.events[event]).forEach((listener) => {
      listener.apply(this, args);
    });
    return true;
  }
}

export function findIndex(array, predicate, fromIndex = 0) {
  const length = array.length;
  const startIndex =
    fromIndex >= 0 ? fromIndex : Math.max(length + fromIndex, 0);
  for (let index = startIndex; index < length; index++) {
    if (predicate(array[index], index, array)) return index;
  }
  return -1;
}

export default function findLastIndex(
  array,
  predicate,
  fromIndex = array.length - 1,
) {
  let startIndex =
    fromIndex < 0
      ? Math.max(array.length + fromIndex, 0)
      : Math.min(fromIndex, array.length - 1);

  let index = startIndex;
  // Iterate from the right.
  while (index >= 0) {
    if (predicate(array[index], index, array)) {
      return index;
    }
    index--;
  }

  return -1;
}
export function flatter(array) {
  const result = [];

  array.forEach((item) => {
    if (Array.isArray(item)) {
      const flatItem = flatter(item);
      result.push(...flatItem);
    } else {
      result.push(item);
    }
  });

  return result;
}

export function chunk(array, size) {
  if (size <= 0) throw new Error("Chunk size must be greater than 0");
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    result.push(chunk);
  }
  return result;
}

Function.prototype.myApply = function (thisArg, argArray = []) {
  return this.bind(thisArg)(...argArray);
};
Function.prototype.myApply = function (thisArg, argArray = []) {
  return this.bind(thisArg, ...argArray)();
};
Function.prototype.myApply = function (thisArg, argArray = []) {
  return this.call(thisArg, ...argArray);
};
