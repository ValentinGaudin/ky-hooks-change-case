import snakeCase from "lodash/snakeCase";

import { createRequestTransformer } from "./createRequestTransformer";

export const transformRequestToSnakeCase = createRequestTransformer(snakeCase);
