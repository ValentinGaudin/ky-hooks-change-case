import snakeCase from 'lodash/snakeCase';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import isPlainObject from 'lodash/isPlainObject';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
/**
 * Check if a string is a valid UUID (including nil UUID).
 */
const uuidValidate = (value) => {
    const regex = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    return regex.test(value);
};
/**
 * Recursively transforms the keys of an object using a modifier function.
 */
const mapKeysDeep = (obj, fn) => {
    if (isArray(obj)) {
        return obj.map((item) => mapKeysDeep(item, fn));
    }
    if (isPlainObject(obj)) {
        return Object.keys(obj).reduce((acc, key) => {
            const value = obj[key];
            const newKey = uuidValidate(key) ? key : fn(key);
            acc[newKey] = isObject(value) ? mapKeysDeep(value, fn) : value;
            return acc;
        }, {});
    }
    return obj;
};
/**
 * Hook to modify request body keys using a casing function.
 */
const createRequestModify = (modifier) => {
    return async (request, options) => {
        if (options.body && !(options.body instanceof FormData)) {
            const body = JSON.parse(options.body);
            const convertedBody = mapKeysDeep(body, modifier);
            return new Request(request, {
                ...options,
                body: JSON.stringify(convertedBody),
                headers: request.headers,
            });
        }
    };
};
/**
 * Hook to modify response body keys using a casing function.
 */
const createResponseModify = (modifier) => {
    return async (input, options, response) => {
        try {
            const body = await response.clone().json();
            const convertedBody = mapKeysDeep(body, modifier);
            return new Response(JSON.stringify(convertedBody), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            });
        }
        catch {
            // return undefined to let ky use the original response
            return;
        }
    };
};
export const requestToSnakeCase = createRequestModify(snakeCase);
export const requestToCamelCase = createRequestModify(camelCase);
export const requestToKebabCase = createRequestModify(kebabCase);
export const responseToSnakeCase = createResponseModify(snakeCase);
export const responseToCamelCase = createResponseModify(camelCase);
export const responseToKebabCase = createResponseModify(kebabCase);
//# sourceMappingURL=index.js.map