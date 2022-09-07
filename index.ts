class MemoPromise {
  cache: {};
  getPromise: () => any;

  constructor(getPromise: any) {
    this.cache = {};
    this.getPromise = getPromise;
    this.request = this.request.bind(this);
  }

  /** Creates a Promise and associates an uniqueId to it, stored in a temporary
   *  cache. Preventing two equal promises to be requested, while the uniqueId
   *  is valid. */
  request(uniqueKey: string) {
    if (!uniqueKey) {
      throw new Error('Unique key is not passed');
    }

    if (window.localStorage.getItem(uniqueKey) === 'used') {
      return this.cache[uniqueKey];
    }

    if (this.cache[uniqueKey]) {
      return this.cache[uniqueKey];
    }

    window.localStorage.setItem(uniqueKey, 'used');
    const promise = this.getPromise;
    this.cache[uniqueKey] = promise;

    return this.cache[uniqueKey];
  }

  deleteCache(key: string) {
    localStorage.removeItem(key);
    delete this.cache[key];
  }

  requestId = (url: string, load: any) => {
    const timestamp = Date.now()
      .toString()
      .substr(0, 8);
    const loadString = JSON.stringify(load);
    return `${url}-${loadString}-${timestamp}`;
  };  
}

export default MemoPromise;
