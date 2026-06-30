// function.js — pure transforms over token arrays. No DOM, no I/O.

export function summarize(tokens) {
  const customWordMap = {};
  tokens.forEach(t => {
    if (!customWordMap[t.raw]) {
      customWordMap[t.raw] = {
        dictionaryMeaning: t.externalDefinition,
        phoneticSpelling: t.externalPhonetic,
        hasStructuralPrefix: !!t.prefixStructuralRole,
        hasStructuralSuffix: !!t.suffixStructuralRole
      };
    }
  });

  return {
    total: tokens.length,
    vowels: tokens.filter(t => t.isVowel).length,
    consonants: tokens.filter(t => !t.isVowel).length,
    finals: tokens.filter(t => t.isFinalForm).length,
    sequence: tokens.map(t => t.letter).join(' \u2192 '),
    structuralComparisonMatrix: customWordMap
  };
}

export function buildCombined(tokens) {
  if (!tokens.length) return '';
  const last = tokens.length - 1;
  const phrase = tokens.map((t, i) => {
    if (i === 0) return `It ${t.detail}`;
    if (i === last && t.isFinalForm) return `, finally it ${t.detail}`;
    return `, then it ${t.detail}`;
  }).join('');
  return phrase + '.';
}

export function buildResult(input, tokens) {
  return {
    input,
    generatedAt: new Date().toISOString(),
    tokens,
    summary: summarize(tokens),
    combined: buildCombined(tokens)
  };
}
