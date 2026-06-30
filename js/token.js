// token.js — glyph tables + contextual LUT processors + live dictionary integration.

export const VOWELS = new Set(['A', 'E', 'I', 'O', 'U', 'Y']);

// 1. Linguistic Look-Up Tables (LUT)
export const LINGUISTIC_LUT = {
  prefixes: {
    "UN": "reversal, negation, or uncovering of an established state",
    "DE": "downward motion, removal, or systematic reduction",
    "RE": "repetition, backward iteration, or restoration of a state"
  },
  suffixes: {
    "ING": "continuous operational execution, active state initialization",
    "ED": "historical baseline, grounded or finalized sequence state",
    "LY": "characteristic execution layer, defining behavioral manner"
  },
  vowelSounds: {
    "A_LONG": "open air-stroke, clear declaration of initialization",
    "E_SILENT": "latent anchor, wordless potential holding structural space",
    "O_DOUBLE": "harmonic resonance cavity, deepening structural frequency"
  }
};

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

export const CONTEXTUAL_OVERRIDES = {
  SILENT_ALEPH: ["Silent Aleph", "breathes a wordless presence, suspending sound to allow space for spiritual observation"],
  SAMEKH_OVERRIDE: ["Samekh's Firm Support", "props up options and opportunities under a watchful eye, creating a stable pillar"]
};

// 2. Dynamic AI-Helper: Real-time public API lookups
export async function fetchExternalDefinition(word) {
  const cleanWord = String(word || '').trim().toLowerCase().replace(/[^a-z]/g, '');
  if (!cleanWord) return { definition: "invalid sequence", phonetic: "" };

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`);
    if (!response.ok) throw new Error("Not found");
    const data = await response.json();
    
    const meaning = data[0]?.meanings[0]?.definitions[0]?.definition || "no definition found";
    const phonetic = data[0]?.phonetic || data[0]?.phonetics?.find(p => p.text)?.text || "";
    return { definition: meaning, phonetic };
  } catch (err) {
    return { definition: "custom raw or proprietary term", phonetic: "" };
  }
}

export function splitTokens(raw) {
  return String(raw || '')
    .split(/[\n,;/|]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

/**
 * Tokenizes arrays with embedded LUT context mapping.
 * Note: pass externalDictionaryMap down from your asynchronous view controller loop.
 */
export function tokenize(raw, externalDictionaryMap = {}) {
  const words = splitTokens(raw);
  const letters = [];

  words.forEach((word, wordIndex) => {
    const upperWord = word.toUpperCase();
    const dictionaryData = externalDictionaryMap[upperWord] || { definition: "pending external sync", phonetic: "" };

    // Detect structural prefix and suffix matches from our LUT
    let activePrefix = Object.keys(LINGUISTIC_LUT.prefixes).find(p => upperWord.startsWith(p)) || null;
    let activeSuffix = Object.keys(LINGUISTIC_LUT.suffixes).find(s => upperWord.endsWith(s)) || null;

    const chars = upperWord.match(/[A-Z]/g) || [];
    
    chars.forEach((letter, charIndex) => {
      let overrideEntry = null;
      let soundProfile = "standard";

      const nextLetter = chars[charIndex + 1];
      const prevLetter = chars[charIndex - 1];
      const isWordEnd = charIndex === chars.length - 1;

      // Rule: Identify "EL E" style or terminal silent layouts
      if (letter === 'E' && isWordEnd && chars.length > 1) {
        overrideEntry = CONTEXTUAL_OVERRIDES.SILENT_ALEPH;
        soundProfile = LINGUISTIC_LUT.vowelSounds.E_SILENT;
      }

      // Rule: Double vowel tracking (e.g. OO in TOO or TWO rules)
      if (letter === 'O' && (nextLetter === 'O' || prevLetter === 'O')) {
        soundProfile = LINGUISTIC_LUT.vowelSounds.O_DOUBLE;
      }

      // Rule: Homophone context matching (Force S to Samekh on 'TO' / 'TOO' configurations)
      if (letter === 'S' && (upperWord === 'TO' || upperWord === 'TOO')) {
        overrideEntry = CONTEXTUAL_OVERRIDES.SAMEKH_OVERRIDE;
      }

      letters.push({
        word,
        upperWord,
        wordIndex,
        letter,
        charIndex,
        overrideEntry,
        soundProfile,
        prefixNotes: activePrefix ? LINGUISTIC_LUT.prefixes[activePrefix] : null,
        suffixNotes: activeSuffix ? LINGUISTIC_LUT.suffixes[activeSuffix] : null,
        dictionaryData
      });
    });
  });

  const total = letters.length;
  return letters.map((item, i) => {
    const isLast = i === total - 1;
    const finalEntry = isLast ? FINAL[item.letter] : undefined;
    const entry = item.overrideEntry || finalEntry || REGULAR[item.letter];

    return {
      raw: item.word,
      wordIndex: item.wordIndex,
      letter: item.letter,
      isLast,
      isFinalForm: isLast && !!finalEntry && !item.overrideEntry,
      isVowel: VOWELS.has(item.letter),
      title: entry ? entry[0] : `Unknown Glyph (${item.letter})`,
      detail: entry ? entry[1] : 'unmapped token',
      
      // Expanded Linguistic properties mapped from structural LUTs
      soundProfile: item.soundProfile,
      prefixStructuralRole: item.prefixNotes,
      suffixStructuralRole: item.suffixNotes,
      externalDefinition: item.dictionaryData.definition,
      externalPhonetic: item.dictionaryData.phonetic
    };
  });
}
