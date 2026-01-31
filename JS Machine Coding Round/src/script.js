// Observer Pattern
function createSubject() {
  let Observer = [];

  const subscribe = (fn) => {
    Observer.push(fn);
  };
  const unsubscribe = (fn) => {
    Observer = Observer.filter((o) => o != fn);
  };
  const notify = (data) => {
    Observer.forEach((fn) => fn(data));
  };

  return { subscribe, unsubscribe, notify };
}

const subject = createSubject();
const ObserverA = (data) => console.log("A :", data);
const ObserverB = (data) => console.log("B :", data);

subject.subscribe(ObserverA);
subject.subscribe(ObserverB);

subject.notify("Hello");

// Pub-Sub Pattern
class EventBus {
  constructor() {
    this.events = new Map();
  }

  subscribe(eventName, handler) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set());
    }

    const handlers = this.events.get(eventName);
    handlers.add(handler);

    // 🔥 Return unsubscribe function (very important)
    return () => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.events.delete(eventName);
      }
    };
  }

  publish(eventName, payload) {
    const handlers = this.events.get(eventName);
    if (!handlers) return;

    // Defensive copy to avoid mutation during iteration
    [...handlers].forEach((handler) => {
      try {
        handler(payload);
      } catch (err) {
        console.error(`Error in "${eventName}" handler`, err);
      }
    });
  }

  clear(eventName) {
    if (eventName) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }
  }
}

const bus = new EventBus();

const unsubscribeAnalytics = bus.subscribe("USER_LOGIN", (user) => {
  console.log("Analytics:", user.id);
});

const unsubscribeUI = bus.subscribe("USER_LOGIN", (user) => {
  console.log("UI Update:", user.name);
});

bus.publish("USER_LOGIN", { id: 1, name: "Alex" });

// Later…
unsubscribeAnalytics();

bus.publish("USER_LOGIN", { id: 2, name: "Sam" });

// Create Once

function createOnce(fn) {
  let called = false;
  let result;

  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}
