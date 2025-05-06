import camelCase from "lodash/camelCase";

import {createRequestTransformer} from "./createRequestTransformer";

export const transformRequestToCamelCase = createRequestTransformer(camelCase);
