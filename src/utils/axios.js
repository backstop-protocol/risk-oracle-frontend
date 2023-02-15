import Axios from "axios"

const TTL = 1000 * 60 * 5 // cache entry will live for 5 minute

class LocalStorageWrapper {

  constructor (){
    const itemsToRemove = localStorage.getItem('items-to-remove')
    debugger
    if(!itemsToRemove){
      localStorage.setItem('items-to-remove', '{}')
    } else {
      this.clearItemsToRemove()
    }
    setInterval(this.clearItemsToRemove, TTL)
  }

  addToItemsToRemove (key) {
    const expiration = Date.now() + TTL
    const itemsToRemove = JSON.parse(localStorage.getItem('items-to-remove'))
    itemsToRemove[key] = {expiration}
    localStorage.setItem('items-to-remove', JSON.stringify(itemsToRemove))
  }

  clearItemsToRemove () {
    const itemsToRemove = JSON.parse(localStorage.getItem('items-to-remove'))
    if(!itemsToRemove){
      return
    }
    Object.entries(itemsToRemove).forEach(([key, {expiration}]) => {
      debugger
      if(Date.now() > expiration) {
        localStorage.removeItem(key)
        delete itemsToRemove[key]
      }
    })
    localStorage.setItem('items-to-remove', JSON.stringify(itemsToRemove))
  }


  getItem (key) {
    return localStorage.getItem(key)
  }

  setItem (key, value) {
    this.addToItemsToRemove(key)
    return localStorage.setItem(key, value)
  }
}

const localStorageWrapper = new LocalStorageWrapper()

const cacheInterceptor = (config) => {
  const url = config.url;
  const cachedResponse = localStorageWrapper.getItem(url);
  if (cachedResponse) {
    const parsedCachedResponse = JSON.parse(cachedResponse);
    if (Date.now() - parsedCachedResponse.timestamp < parsedCachedResponse.ttl) {
      config.adapter = function (config) {
        return new Promise((resolve, reject) => {
          const res = parsedCachedResponse
          return resolve(res);
        })
      }
    }
  }
  return config;
};

const responseInterceptor = (response) => {
  const url = response.config.url;
  response.timestamp = Date.now()
  response.ttl = TTL
  localStorageWrapper.setItem(
    url,
    JSON.stringify(response)
  );
  return response;
};

const axiosInstance = Axios.create();

axiosInstance.interceptors.request.use(cacheInterceptor);
axiosInstance.interceptors.response.use(responseInterceptor);

export default axiosInstance;