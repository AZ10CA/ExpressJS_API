// extracts the given keys from a given object
const extract = (obj, keys) => {
    const extracted = {};
    keys.forEach(key => {
        if (obj.hasOwnProperty(key)) {
            extracted[key] = obj[key];
        } else {
            extracted[key] = null
        }
    });
    return extracted;
}


// strips leading and trailing spaces from the object on the fields provided ((in place))
const strip = (obj, fields) => {
    for(let field of fields) {
        if(obj.hasOwnProperty(field)){
            obj[field] = obj[field]?.replace(/(^\s+|\s+$)/g, '')
        }
    }
}

const lower = (obj, fields) => {
    for (const key of fields) {
        if (obj.hasOwnProperty(key)){
            if(typeof obj[key] ===  "string") {
                obj[key] = obj[key].toLowerCase()
            }
        }
    }
}


module.exports = {extract, strip, lower}