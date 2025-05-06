import isPlainObject from "lodash/isPlainObject";
import isObject from "lodash/isObject";

import { KeyModifier } from "../types/KeyModifier";
import { uuidValidate } from "./uuidValidate";

/**
 * Recursively transforms the keys of an object using a modifier function.
 */
export const mapKeysDeep = <T extends object>(obj: T, fn: KeyModifier): T => {
	if (Array.isArray(obj)) {
		return obj.map((item) => mapKeysDeep(item, fn)) as T;
	}

	if (isPlainObject(obj)) {
		return Object.keys(obj).reduce((acc, key) => {
			const value = (obj as Record<string, any>)[key];
			const newKey = uuidValidate(key) ? key : fn(key);
			(acc as Record<string, any>)[newKey] = isObject(value)
				? mapKeysDeep(value, fn)
				: value;
			return acc;
		}, {} as T);
	}

	return obj;
};
