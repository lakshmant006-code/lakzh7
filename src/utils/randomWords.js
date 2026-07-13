const WORDS = [
  "amber",
  "azure",
  "breeze",
  "coral",
  "dawn",
  "ember",
  "fern",
  "glow",
  "haze",
  "ivory",
  "jade",
  "kite",
  "lumen",
  "meadow",
  "nova",
  "orchid",
  "petal",
  "quartz",
  "river",
  "sage",
  "terra",
  "umber",
  "velvet",
  "willow",
  "zenith",
  "bloom",
  "clover",
  "dusk",
  "flora",
  "garden",
  "honey",
  "iris",
  "juniper",
  "lilac",
  "moss",
  "nectar",
  "olive",
  "pebble",
  "rain",
  "sprout",
  "thistle",
  "violet",
  "wren",
  "yarrow",
  "zinnia",
  "cloud",
  "dew",
  "frost",
  "glimmer",
  "harbor",
  "indigo",
  "lotus",
  "marigold",
  "pearl",
  "rose",
  "starlight",
  "tide",
  "wildflower",
];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function generateRandomName() {
  let first = pickRandom(WORDS);
  let second = pickRandom(WORDS);
  while (second === first) {
    second = pickRandom(WORDS);
  }
  return `${first} ${second}`;
}
