const isDev = import.meta.env.DEV;

/**
 * Makes sure that only errors are logged in production 
*/
const logger = {
    log: (...args) => isDev && console.log(...args),
    warn: (...args) => isDev && console.warn(...args),
    error: (...args) => console.error(...args) 
}

export default logger;