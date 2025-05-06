import { KeyModifier } from "../../types/KeyModifier";
import { ResponseBody } from "../../interfaces/Response";
import { mapKeysDeep } from "../../core/mapKeysDeep";

/**
 * Hook to modify response body keys using a casing function.
 */
export const createResponseTransformer = (modifier: KeyModifier) => {
	return async (
		input: Request,
		options: RequestInit,
		response: Response
	): Promise<Response | void> => {
		try {
			const body: ResponseBody = await response.clone().json();
			const convertedBody = mapKeysDeep(body, modifier);
			return new Response(JSON.stringify(convertedBody), {
				status: response.status,
				statusText: response.statusText,
				headers: response.headers,
			});
		} catch {
			return;
		}
	};
};
