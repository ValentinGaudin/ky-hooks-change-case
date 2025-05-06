import camelCase from "lodash/camelCase";

import { createResponseTransformer } from "./createResponseTransformer";

export const transformResponseToCamelCase = createResponseTransformer(camelCase);
