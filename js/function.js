// function.js — pure transforms over token arrays. No DOM, no I/O.

export function summarize(tokens) {
  return {
    total: tokens.length,
    vowels: tokens.filter(t => t.isVowel).length,
    consonants: tokens.filter(t => !t.isVowel).length,
    finals: tokens.filter(t => t.isFinalForm).length,
    sequence: tokens.map(t => t.letter).join(' \u2192 ')
  };
}

export function buildResult(input, tokens) {
  return {
    input,
    generatedAt: new Date().toISOString(),
    tokens,
    summary: summarize(tokens)
  };
}
