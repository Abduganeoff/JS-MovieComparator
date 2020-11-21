const debouncer = (func, delay) => {
    let timeOut;
    return (...args) => {
        if (timeOut) {
            clearTimeout(timeOut);
        }
        timeOut = setTimeout(() => {
            func.apply(null, args)
        }, delay);
    }
}
