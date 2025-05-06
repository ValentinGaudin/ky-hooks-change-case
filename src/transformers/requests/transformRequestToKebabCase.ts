import kebabCase from "lodash/kebabCase";

import { createRequestTransformer } from "./createRequestTransformer";

export const transformRequestToKebabCase = createRequestTransformer(kebabCase);
