import snakeCase from "lodash/snakeCase";

import { createResponseTransformer } from "./createResponseTransformer";

export const transformResponseToSnakeCase = createResponseTransformer(snakeCase);
