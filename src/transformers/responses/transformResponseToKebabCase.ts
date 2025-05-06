import kebabCase from "lodash/kebabCase";

import { createResponseTransformer } from "./createResponseTransformer";

export const transformResponseToKebabCase = createResponseTransformer(kebabCase);
