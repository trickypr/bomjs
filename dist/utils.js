"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectFilter = (object, filter) => {
    const result = {};
    for (const key in object)
        if (object.hasOwnProperty(key) && !filter(object[key]))
            result[key] = object[key];
    return result;
};
