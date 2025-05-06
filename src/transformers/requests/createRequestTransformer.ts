import { KeyModifier } from "../../types/KeyModifier";
import { mapKeysDeep } from "../../core/mapKeysDeep";
import { RequestBody } from "../../interfaces/Request";

export const createRequestTransformer = (modifier: KeyModifier) => {
	return async (request: Request, options: RequestInit): Promise<Request | void> => {
		if (options.body && !(options.body instanceof FormData)) {
			const body: RequestBody = JSON.parse(options.body as string);
			const convertedBody = mapKeysDeep(body, modifier);
			return new Request(request, {
				...options,
				body: JSON.stringify(convertedBody),
				headers: request.headers,
			});
		}
	};
};
