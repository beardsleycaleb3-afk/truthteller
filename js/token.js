// function.js — pure transforms over token arrays. No DOM, no I/O.

/**
 * Summarizes the updated token payload, preserving standard tracking metrics 
 * while creating an integrated cross-comparison structural matrix for the view layer.
 */
export function summarize(tokens) {
  const structuralMatrix = {};

  tokens.forEach(t => {
    // Group linguistic properties by source word for display layout components
    if (!structuralMatrix[t.raw]) {
      structuralMatrix[t.raw] = {
        definition: t.externalDefinition || "pending sync",
        phonetic: t.externalPhonetic || "",
        sound: typeof t.soundProfile === 'object' ? JSON.stringify(t.soundProfile) : t.soundProfile,
        prefixRole: t.prefixStructuralRole || "none",
        suffixRole: t.suffixStructuralRole || "none"
      };
    }
  });

  return {
    total: tokens.length,
    vowels: tokens.filter(t => t.isVowel).length,
    consonants: tokens.filter(t => !t.isVowel).length,
    finals: tokens.filter(t => t.isFinalForm).length,
    sequence: tokens.map(t => t.letter).join(' \u2192 '),
    matrix: structuralMatrix
  };
}

/**
 * Stitches each letter's clause into one combined narrative sentence,
 * preserving pristine structural output formatting via the token's detail property.
 */
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

/**
 * Builds the unified result matrix payload, perfectly chaining calculations 
 * downstream from your updated token generation matrices.
 */
export function buildResult(input, tokens) {
  return {
    input,
    generatedAt: new Date().toISOString(),
    tokens,
    summary: summarize(tokens),
    combined: buildCombined(tokens)
  };
}
