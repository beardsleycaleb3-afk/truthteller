// token.js — glyph data tables + raw string tokenization.

export const VOWELS = new Set(['A', 'E', 'I', 'O', 'U', 'Y']);

export const REGULAR = {
  A: ["Aleph's Ox-Lowing Breath", 'initiates with a primal stroke of leadership, birthing the beginning'],
  B: ["Bet's House of Dwelling", 'establishes a balanced enclosure where structural stability houses the self'],
  C: ["Gimel's Wandering Grace", 'acts as a creative bridge, weaving potential growth across transitions'],
  D: ["Dalet's Threshold", 'fixes a firm entry point of stability, anchoring the structural foundation'],
  E: ["Heh's Window of Wonder", 'pours enthusiastic energy through the lattice of the soul, revealing revelation'],
  F: ["Vav's Hook of Family", 'binds the sequence together with nurturing stability, locking components'],
  G: ["Zayin's Cutting Edge", 'introduces the spiritual blade of discernment, cleaving structural illusions'],
  H: ["Chet's Enclosed Wall", 'fences in abundance, establishing a protective boundary that separates assets'],
  I: ["Tet's Wheel of Completion", 'circles back with humanitarian integration, sealing the phrase with goodness'],
  J: ["Yod's Hand of Action", 'grasps structural justice through targeted effort, shaping raw fate'],
  K: ["Kaf's Open Illumination", 'awakens internal understanding, serving as an open vessel catching light'],
  L: ["Lamed's Loyal Goad", 'guides the sequence via purposeful direction, urging the path forward'],
  M: ["Mem's Practical Depths", 'flows through practical, material systems, reflecting environmental patterns'],
  N: ["Nun's River of Life", 'links components through a quiet current of connectivity, swimming streams'],
  O: ["Samekh's Firm Support", 'props up options and opportunities under a watchful eye, creating a stable pillar'],
  P: ["Pe's Open Mouth", 'projects explicit perspective, pouring silent calculations out into clear expression'],
  Q: ["Qof's Hidden Turn", 'questions the trajectory, initiating an analytical leap into unknown parameters'],
  R: ["Resh's Beginning Gaze", 'renews the trajectory through deep reflection, turning prior cycles into fresh promises'],
  S: ["Shin's Spiritual Fire", 'devours illusion with sharp intensity, clearing away systematic noise'],
  T: ["Tav's Final Seal", 'transforms mortality into permanent structure, placing a cross of completion'],
  U: ["Vav's Universal Hook", 'unites varied data points into cosmic wholeness, anchoring connectivity'],
  V: ["Phi's Golden Force", 'uncoils vital living energy, driving dynamic execution like a living flame'],
  W: ['Double Hook of Wisdom', 'weaves dual connection channels together, fusing fragments into absolute integration'],
  X: ["Chi's Unknown Crossroads", 'introduces structural mystery, navigating the variable turning points'],
  Y: ["Yod's Action Reborn", 'applies youthful vital energy to raw materials, actively working and shaping clay'],
  Z: ["Zayin's Final Zenith", 'closes the dynamic loop at the absolute peak, bringing all operational cycles to peace']
};

export const FINAL = {
  S: ['Final Shin (Terminal Soul)', 'seals the entire consciousness, locking the purified spiritual fire into permanent casing'],
  P: ['Final Peh (Absolute Manifestation)', 'finalizes the spoken word into solid, undeniable reality, sealing perception permanently'],
  N: ['Final Nun (Extended Gateway)', 'descends deep beneath the standard framework, projecting the stream into the absolute infinite'],
  M: ['Final Mem (Closed Matrix)', 'closes the practical waters completely, locking down material systems into a hidden vault'],
  K: ['Final Kaf (Illuminated Terminal)', 'extends the palm downward, grounding all gathered spiritual light directly into execution']
};

export function splitTokens(raw) {
  return String(raw || '')
    .split(/[\n,;/|]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

// Explodes every word into its individual letters (not just one letter per
// comma/line-separated chunk), so e.g. "MOON" becomes 4 tokens: M, O, O, N.
// The very last letter of the very last word is checked against FINAL forms.
export function tokenize(raw) {
  const words = splitTokens(raw);
  const letters = [];
  words.forEach((word, wordIndex) => {
    const chars = word.toUpperCase().match(/[A-Z]/g) || [];
    chars.forEach((letter, charIndex) => {
      letters.push({ word, wordIndex, letter, charIndex });
    });
  });

  const total = letters.length;
  return letters.map((item, i) => {
    const isLast = i === total - 1;
    const finalEntry = isLast ? FINAL[item.letter] : undefined;
    const entry = finalEntry || REGULAR[item.letter];
    return {
      raw: item.word,
      wordIndex: item.wordIndex,
      letter: item.letter,
      isLast,
      isFinalForm: isLast && !!finalEntry,
      isVowel: VOWELS.has(item.letter),
      title: entry ? entry[0] : `Unknown Glyph (${item.letter})`,
      detail: entry ? entry[1] : 'unmapped token'
    };
  });
}
