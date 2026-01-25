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

Function.prototype.myBind = function (thisArg, ...args) {
  const fn = this;
  return function (...innerArgs) {
    return fn.apply(thisArg, [...args, ...innerArgs]);
  };
};

Function.prototype.myCall = function (thisArg, ...args) {
  const fn = this;
  return fn.apply(thisArg, args);
};

export function getElementsByClassName(element, classNames) {
  const result = [];
  const classListSet = new Set(classNames.trim().split(/\s+/));
  function traverse(el) {
    if (el == null) return;
    if (Array.from(classListSet).every((cls) => el.classList.contains(cls))) {
      result.push(el);
    }
    for (const child of el.children) {
      traverse(child);
    }
  }
  for (const child of element.children) {
    traverse(child);
  }
  return result;
}

export function getElementsByTagName(element, tagName) {
  const result = [];
  const targetTagName = tagName.toUpperCase();
  function traverse(el) {
    if (el == null) return;
    if (el.tagName.toUpperCase() === targetTagName) {
      result.push(el);
    }
    for (const child of el.children) {
      traverse(child);
    }
  }
  for (const child of element.children) {
    traverse(child);
  }
  return result;
}
/**
 * Algorithm: Hierarchical Tag Search

Convert input tag string into uppercase tag array

Initialize empty result list

Define recursive function traverse(node, index)

If node is null → return

If node tag matches tagArray[index]:

If index is last tag → add node to result

Else increment index

For each child of node → call traverse(child, updatedIndex)

Start traversal from document.body with index = 0

Return result list
 */

export function getElementsByTagNameHierarchy(document, tagNames) {
  const results = [];
  const tagArray = tagNames.toUpperCase().trim().split(/\s+/);
  if (tagArray.length === 0) return results;
  const lastIndex = tagArray.length - 1;
  function dfs(element, index) {
    if (element === null) return;

    const currentTag = tagArray[index];
    const elementMatches = element.tagName === currentTag;
    const isLastTag = index === lastIndex;

    if (elementMatches && isLastTag) {
      results.push(element);
    }

    const nextIndex = elementMatches ? Math.min(index + 1, lastIndex) : index;
    for (const child of element.children) {
      dfs(child, nextIndex);
    }
  }
  dfs(document.body, 0);
  return results;
}

export function jsonStringify(value) {
  if (value === null) return "null";
  if (typeof value === "number" || typeof value === "boolean") {
    return value.toString();
  }
  if (typeof value === "string") {
    return `"${value.replace(/"/g, '\\"')}"`;
  }
  if (Array.isArray(value)) {
    const elements = value.map((el) => jsonStringify(el) || "null");
    return `[${elements.join(",")}]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value)
      .map(([key, val]) => {
        const stringifiedVal = jsonStringify(val);
        if (stringifiedVal === undefined) return undefined;
        return `"${key.replace(/"/g, '\\"')}":${stringifiedVal}`;
      })
      .filter((entry) => entry !== undefined);
    return `{${entries.join(",")}}`;
  }
  return undefined; // Functions and undefined are not serialized
}
