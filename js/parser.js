// parser.js — top-level parse orchestration. Depends on token.js + function.js.

import { tokenize } from './token.js';
import { buildResult } from './function.js';

export function parse(input) {
  if (!input || !String(input).trim()) return null;
  const tokens = tokenize(input);
  return buildResult(input, tokens);
}

export function toJSON(result) {
  return JSON.stringify(result, null, 2);
}
