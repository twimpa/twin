

// From https://blog.betomorrow.com/replacing-redux-with-observables-and-react-hooks-acdbbaf5ba80

export class Observable {

  constructor(_val) {
    this._val = _val;
    this._listeners = [];
  }

  get() {
    return this._val;
  }

  set(val) {
    if (this._val !== val) {
      this._val = val;
      this._listeners.forEach(l => l(val));
    }
  }

  /**
   * @param {Listener} listener 
   * @returns Unsubscriber
   */
  subscribe(listener) {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter(l => l !== listener);
    };
  }
} // End of class Observable


