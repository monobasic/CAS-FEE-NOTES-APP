class EventDispatcher {

  constructor(sender) {
    this._sender = sender;
    this._listeners = [];
  }

  attach(listener) {
    this._listeners.push(listener);
  }

  notify(args) {
    for (let i = 0; i < this._listeners.length; i += 1) {
      this._listeners[i](this._sender, args);
    }
  }
}
