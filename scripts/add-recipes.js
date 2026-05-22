#!/usr/bin/env node
/**
 * NutriWorld Recipe Updater
 * Picks 2 recipes from the pool that aren't already in recipes.json and adds them.
 * Run via GitHub Actions on a schedule, or manually: node scripts/add-recipes.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const recipesPath = join(__dirname, '../src/data/recipes.json');

const existing = JSON.parse(readFileSync(recipesPath, 'utf8'));
const existingIds = new Set(existing.map(r => r.id));

// Pool of new recipes from around the world not yet in the file
const pool = [
  {
    id: 'vietnamese-pho',
    name: 'Vietnamese Beef Pho',
    cuisine: 'Vietnamese 🇻🇳',
    cuisineFlag: '🇻🇳',
    emoji: '🍜',
    category: 'soup',
    dietTags: ['balanced-omnivore', 'anti-inflammatory'],
    difficulty: 'Medium',
    time: '60 min',
    servings: 4,
    description: 'Vietnam\'s iconic clear broth soup — slow-simmered with charred ginger, star anise, cinnamon, and cloves, served with rice noodles, tender beef slices, and an aromatic herb plate.',
    keyBenefits: ['Collagen-rich bone broth', 'Anti-inflammatory spices', 'Complete protein', 'Gut-healing gelatin'],
    ingredients: [
      '1kg beef bones (knuckle/marrow)', '300g beef sirloin, thinly sliced',
      '200g flat rice noodles (banh pho)', '1 large onion, halved',
      '1 large piece ginger (8cm)', '3 star anise', '1 cinnamon stick',
      '4 cloves', '1 tsp black peppercorns', '2 tbsp fish sauce',
      '1 tsp rock sugar', 'Bean sprouts, Thai basil, lime, chili to serve',
      'Spring onions and coriander to garnish'
    ],
    steps: [
      'Char onion and ginger halves directly over gas flame or under broiler until blackened. This is essential for the authentic smoky-sweet flavor.',
      'Blanch beef bones in boiling water 5 min, drain, and rinse well to remove impurities.',
      'Toast star anise, cinnamon, and cloves in dry pan 1 min until fragrant.',
      'Simmer bones in 3L water with charred onion, ginger, and toasted spices for 45 min. Skim frequently.',
      'Season broth with fish sauce and rock sugar. Strain through fine sieve.',
      'Cook noodles per package instructions. Divide into bowls.',
      'Layer raw beef slices over noodles — hot broth will cook them. Pour boiling broth over.',
      'Serve with bean sprouts, Thai basil, lime wedges, and chili slices on the side.'
    ],
    macros: { calories: 420, protein: '35g', carbs: '42g', fat: '12g', fiber: '2g' },
    keyMicronutrients: [
      { name: 'Collagen & Gelatin (bone broth)', amount: 'Gut-healing proteins', emoji: '🦴', highlight: true },
      { name: 'Zinc', amount: '6mg (55% RDA)', emoji: '🦪', highlight: true },
      { name: 'Iron (heme)', amount: '4mg (22% RDA)', emoji: '🔴', highlight: true },
      { name: 'B12', amount: '2.8mcg (117% RDA)', emoji: '⚡' },
      { name: 'Selenium', amount: '28mcg (51% RDA)', emoji: '🌰' },
      { name: 'Star anise (anethole)', amount: 'Anti-inflammatory, antimicrobial', emoji: '⭐' },
      { name: 'Potassium', amount: '680mg (19% RDA)', emoji: '🫀' },
      { name: 'Phosphorus', amount: '280mg (40% RDA)', emoji: '🔋' }
    ],
    tip: 'The charring step is non-negotiable — it creates Maillard reaction compounds that give pho its distinctive deep, complex flavor and adds anti-inflammatory phenols.',
    funFact: 'Pho originated in northern Vietnam in the early 20th century. Bone broth simmered for 6-12 hours produces high levels of glycine and proline — amino acids that repair the intestinal lining.'
  },
  {
    id: 'turkish-red-lentil-soup',
    name: 'Turkish Red Lentil Soup (Mercimek Çorbası)',
    cuisine: 'Turkish 🇹🇷',
    cuisineFlag: '🇹🇷',
    emoji: '🍲',
    category: 'soup',
    dietTags: ['plant-based', 'mediterranean', 'longevity'],
    difficulty: 'Easy',
    time: '35 min',
    servings: 4,
    description: 'Turkey\'s most beloved soup — silky red lentils blended smooth with onion, carrot, and cumin, finished with a sizzling paprika-butter drizzle and fresh lemon. Eaten across the country at every meal.',
    keyBenefits: ['Exceptional folate source', 'Paprika is rich in Vitamin A & C', 'Plant-based complete meal', 'Easy to digest'],
    ingredients: [
      '1.5 cups red lentils, rinsed', '1 large onion, diced', '2 carrots, diced',
      '3 garlic cloves, minced', '2 tsp cumin', '1 tsp turmeric',
      '1 tsp sweet paprika', '1.5L vegetable broth', '2 tbsp olive oil',
      '1 tbsp butter', '1 tsp hot paprika (for drizzle)', 'Lemon wedges, dried mint to serve'
    ],
    steps: [
      'Sauté onion in olive oil 5 min. Add garlic, cumin, and turmeric, stir 1 min.',
      'Add carrots and lentils, cover with broth. Bring to boil then simmer 20 min.',
      'Blend completely smooth with immersion blender. Adjust consistency with water.',
      'Season with salt. Prepare paprika drizzle: melt butter, add hot paprika, stir 30 sec.',
      'Serve soup in bowls, drizzle paprika butter on top, finish with dried mint and lemon.'
    ],
    macros: { calories: 340, protein: '18g', carbs: '52g', fat: '7g', fiber: '14g' },
    keyMicronutrients: [
      { name: 'Folate', amount: '360mcg (90% RDA)', emoji: '🧬', highlight: true },
      { name: 'Iron', amount: '7mg (39% RDA)', emoji: '🔴', highlight: true },
      { name: 'Vitamin A (paprika)', amount: '680mcg (76% RDA)', emoji: '👁️', highlight: true },
      { name: 'Potassium', amount: '820mg (23% RDA)', emoji: '🫀' },
      { name: 'B1 Thiamine', amount: '0.45mg (38% RDA)', emoji: '⚡' },
      { name: 'Fiber', amount: '14g (50% RDA)', emoji: '🌿' },
      { name: 'Magnesium', amount: '72mg (17% RDA)', emoji: '😴' },
      { name: 'Curcumin (turmeric)', amount: 'Anti-inflammatory', emoji: '🟡' }
    ],
    tip: 'Red lentils cook down completely without soaking — the fastest legume to prepare. The paprika butter drizzle isn\'t just decorative; it adds fat-soluble carotenoids that increase absorption.',
    funFact: 'Mercimek çorbası is served at breakfast, lunch, and dinner across Turkey. Red lentils have been cultivated in Anatolia for over 8,000 years — among the oldest cultivated foods in human history.'
  },
  {
    id: 'nigerian-egusi-soup',
    name: 'Nigerian Egusi Soup with Spinach',
    cuisine: 'Nigerian 🇳🇬',
    cuisineFlag: '🇳🇬',
    emoji: '🥘',
    category: 'stew',
    dietTags: ['balanced-omnivore', 'anti-inflammatory'],
    difficulty: 'Medium',
    time: '60 min',
    servings: 4,
    description: 'West Africa\'s signature soup made with ground melon seeds (egusi), rich in protein and fat, slow-cooked with palm oil, leafy greens, and aromatic spices. Served with pounded yam or fufu.',
    keyBenefits: ['Egusi seeds: exceptional zinc & magnesium', 'Palm oil rich in Vitamin E & carotenoids', 'Complete protein combo', 'Iron from spinach + palm oil vitamin A'],
    ingredients: [
      '200g ground egusi (melon seeds)', '300g beef or fish (or both)',
      '200g fresh spinach or bitter leaf', '3 tbsp red palm oil',
      '1 large onion, blended', '2 scotch bonnet peppers, blended',
      '1 can (400g) crushed tomatoes', '2 stock cubes', '1 tsp ground crayfish',
      'Salt and seasoning to taste', 'Pounded yam or eba to serve'
    ],
    steps: [
      'Season and cook beef/fish until tender. Reserve the stock.',
      'Heat palm oil in pot. Fry blended onion and pepper 10 min until oil floats.',
      'Add crushed tomatoes, cook 10 more min until thick.',
      'Mix egusi with a little water to form a paste. Add in lumps to the pot.',
      'Stir and cook egusi 15 min until fully cooked and incorporated into sauce.',
      'Add meat/fish, stock, crayfish, and stock cubes. Simmer 10 min.',
      'Add spinach, stir gently, cook 3 min. Adjust seasoning. Serve with pounded yam.'
    ],
    macros: { calories: 520, protein: '32g', carbs: '22g', fat: '34g', fiber: '6g' },
    keyMicronutrients: [
      { name: 'Zinc (egusi seeds)', amount: '7mg (64% RDA)', emoji: '🦪', highlight: true },
      { name: 'Magnesium (egusi)', amount: '130mg (31% RDA)', emoji: '😴', highlight: true },
      { name: 'Vitamin E (palm oil)', amount: '8mg (53% RDA)', emoji: '🛡️', highlight: true },
      { name: 'Iron', amount: '6.5mg (36% RDA)', emoji: '🔴' },
      { name: 'Vitamin A (palm carotenoids)', amount: '950mcg (106% RDA)', emoji: '👁️', highlight: true },
      { name: 'Phosphorus', amount: '380mg (54% RDA)', emoji: '🔋' },
      { name: 'B1 Thiamine', amount: '0.4mg (33% RDA)', emoji: '⚡' },
      { name: 'Folate', amount: '180mcg (45% RDA)', emoji: '🧬' }
    ],
    tip: 'Red palm oil (unrefined) is one of nature\'s richest sources of tocotrienols — a superior form of Vitamin E — and carotenoids. Never substitute with refined palm oil, which has stripped nutrients.',
    funFact: 'Egusi seeds are from the white-seeded melon (Citrullus lanatus), cultivated across West and Central Africa for 4,000+ years. A 100g serving of egusi provides more protein than most cuts of beef.'
  },
  {
    id: 'lebanese-fattoush',
    name: 'Lebanese Fattoush with Labneh',
    cuisine: 'Lebanese 🇱🇧',
    cuisineFlag: '🇱🇧',
    emoji: '🥗',
    category: 'salad',
    dietTags: ['mediterranean', 'balanced-omnivore', 'anti-inflammatory'],
    difficulty: 'Easy',
    time: '20 min',
    servings: 2,
    description: 'Lebanon\'s vibrant bread salad — crispy toasted pita with romaine, tomatoes, cucumber, radishes, and fresh herbs in a sumac-lemon dressing, topped with creamy labneh (strained yogurt). A probiotic-rich Mediterranean masterpiece.',
    keyBenefits: ['Sumac is rich in anti-inflammatory anthocyanins', 'Labneh provides probiotics + calcium', 'Diverse phytonutrients in one bowl', 'Vitamin C at 100%+ RDA'],
    ingredients: [
      '2 whole wheat pita breads, torn into pieces', '1 head romaine lettuce, chopped',
      '2 ripe tomatoes, diced', '1 cucumber, half-moon slices',
      '6 radishes, thinly sliced', '4 spring onions, sliced',
      '1 cup fresh mint + flat-leaf parsley', '200g labneh (strained yogurt)',
      '3 tbsp extra-virgin olive oil', '2 tbsp lemon juice', '1 tsp sumac',
      '½ tsp dried mint', 'Salt and pepper', 'Olive oil for crisping pita'
    ],
    steps: [
      'Toast pita pieces in oven at 180°C with a drizzle of olive oil until golden and crisp, 8-10 min.',
      'Make sumac dressing: whisk EVOO, lemon juice, sumac, dried mint, salt, and pepper.',
      'Combine romaine, tomatoes, cucumber, radishes, and spring onions.',
      'Add fresh mint and parsley — Lebanese fattoush is herb-forward, be generous.',
      'Toss with dressing. Add crispy pita pieces just before serving (keeps them crunchy).',
      'Top with dollops of labneh and a drizzle of EVOO. Finish with extra sumac.'
    ],
    macros: { calories: 360, protein: '14g', carbs: '38g', fat: '18g', fiber: '7g' },
    keyMicronutrients: [
      { name: 'Vitamin C', amount: '92mg (102% RDA)', emoji: '🍊', highlight: true },
      { name: 'Sumac anthocyanins', amount: 'Anti-inflammatory polyphenols', emoji: '🍇', highlight: true },
      { name: 'Calcium (labneh)', amount: '320mg (32% RDA)', emoji: '🦷', highlight: true },
      { name: 'Probiotics (labneh)', amount: 'Live cultures', emoji: '🦠', highlight: true },
      { name: 'Vitamin K1', amount: '160mcg (133% RDA)', emoji: '🩸' },
      { name: 'Folate', amount: '210mcg (53% RDA)', emoji: '🧬' },
      { name: 'Vitamin A', amount: '450mcg (50% RDA)', emoji: '👁️' },
      { name: 'Polyphenols (EVOO)', amount: 'Heart-protective', emoji: '🫒' }
    ],
    tip: 'Add pita only at the moment of serving — soggy pita destroys the texture contrast that makes fattoush special. Prepare everything else in advance and add pita at the table.',
    funFact: 'Fattoush was born from frugality — Lebanese cooks used stale leftover bread rather than wasting it. Sumac, the key spice, has been used medicinally in the Middle East for 2,000 years for its astringent, antioxidant properties.'
  },
  {
    id: 'egyptian-koshari',
    name: 'Egyptian Koshari',
    cuisine: 'Egyptian 🇪🇬',
    cuisineFlag: '🇪🇬',
    emoji: '🍚',
    category: 'bowl',
    dietTags: ['plant-based', 'longevity', 'balanced-omnivore'],
    difficulty: 'Medium',
    time: '55 min',
    servings: 4,
    description: 'Egypt\'s beloved national dish — a remarkable layering of rice, lentils, macaroni, and chickpeas topped with crispy fried onions, spiced tomato sauce, and garlic vinegar. Pure comfort food that happens to be a nutritional powerhouse.',
    keyBenefits: ['4 different plant proteins in one bowl', 'Exceptional fiber (20g!)', 'Complete amino acid profile from grain+legume combo', 'Filling and economical'],
    ingredients: [
      '1 cup brown lentils', '1 cup short-grain rice', '1 cup macaroni',
      '1 can (400g) chickpeas', '3 large onions, thinly sliced',
      '1 can (400g) crushed tomatoes', '4 garlic cloves', '1 tsp cumin',
      '1 tsp coriander', '½ tsp cinnamon', '¼ tsp cayenne', '3 tbsp olive oil',
      '2 tbsp red wine vinegar', 'Oil for frying onions', 'Salt and pepper'
    ],
    steps: [
      'Cook lentils 20 min until tender. Cook rice separately. Cook macaroni al dente. Warm chickpeas.',
      'Make crispy onions: fry sliced onions in oil over medium-high heat, stirring often, 20-25 min until deep golden and crispy. Drain on paper towel.',
      'Make tomato sauce: sauté 2 garlic cloves in olive oil, add tomatoes, cumin, coriander, cinnamon, cayenne. Simmer 15 min.',
      'Make garlic vinegar: crush remaining garlic into red wine vinegar with pinch of salt.',
      'Assemble in layers: rice, then lentils, then macaroni, then chickpeas.',
      'Top with crispy onions. Serve with tomato sauce and garlic vinegar on the side.'
    ],
    macros: { calories: 510, protein: '22g', carbs: '88g', fat: '8g', fiber: '20g' },
    keyMicronutrients: [
      { name: 'Fiber', amount: '20g (71% RDA)', emoji: '🌿', highlight: true },
      { name: 'Iron', amount: '8.5mg (47% RDA)', emoji: '🔴', highlight: true },
      { name: 'Folate', amount: '420mcg (105% RDA)', emoji: '🧬', highlight: true },
      { name: 'Zinc', amount: '4.2mg (38% RDA)', emoji: '🦪' },
      { name: 'Magnesium', amount: '110mg (26% RDA)', emoji: '😴' },
      { name: 'B1 Thiamine', amount: '0.55mg (46% RDA)', emoji: '⚡' },
      { name: 'Potassium', amount: '1100mg (31% RDA)', emoji: '🫀' },
      { name: 'Complete protein (grain+legume)', amount: 'All essential amino acids', emoji: '🏆' }
    ],
    tip: 'The grain-legume combination (rice + lentils + chickpeas) creates a complete protein profile equivalent to meat — this is the foundation of healthy eating across the developing world for thousands of years.',
    funFact: 'Koshari is sold on almost every street corner in Cairo. It\'s a dish born from the 19th-century fusion of Indian, Italian, and Egyptian culinary traditions. At ~50 cents per serving, it\'s both the cheapest and most nutritious meal in Egypt.'
  },
  {
    id: 'swedish-gravlax',
    name: 'Swedish Gravlax with Dill Mustard Sauce',
    cuisine: 'Swedish 🇸🇪',
    cuisineFlag: '🇸🇪',
    emoji: '🐟',
    category: 'salad',
    dietTags: ['mediterranean', 'anti-inflammatory', 'balanced-omnivore'],
    difficulty: 'Easy',
    time: '15 min (+ 48h cure)',
    servings: 4,
    description: 'Scandinavian cured salmon — raw salmon dry-cured in salt, sugar, and dill for 48 hours. Served thinly sliced with hovmästarsås (sweet mustard-dill sauce) and rye crispbread. One of the world\'s most omega-3-rich dishes.',
    keyBenefits: ['Highest Omega-3 per serving of any recipe', 'Zero cooking preserves heat-sensitive B vitamins', 'Vitamin D near 100% RDA', 'Astaxanthin from raw salmon'],
    ingredients: [
      '600g center-cut salmon fillet, skin on', '3 tbsp coarse sea salt',
      '2 tbsp sugar', '1 tbsp white peppercorns, crushed',
      'Large bunch fresh dill', 'For sauce: 3 tbsp Swedish mustard (or Dijon)',
      '1 tbsp honey', '2 tbsp white wine vinegar', '4 tbsp neutral oil',
      'Fresh dill, salt, white pepper', 'Rye crispbread and lemon to serve'
    ],
    steps: [
      'Mix salt, sugar, and crushed peppercorns.',
      'Place salmon skin-down. Coat flesh with salt mixture. Cover completely with dill.',
      'Wrap tightly in cling film, place in dish, weight down with a heavy pan.',
      'Refrigerate 48 hours, flipping every 12 hours and pouring off liquid.',
      'Unwrap, scrape off dill and seasoning. Pat dry.',
      'Make sauce: whisk mustard, honey, vinegar. Slowly drizzle in oil while whisking. Fold in fresh dill.',
      'Slice salmon very thin at an angle. Serve with sauce, rye crispbread, and lemon.'
    ],
    macros: { calories: 320, protein: '38g', carbs: '8g', fat: '14g', fiber: '1g' },
    keyMicronutrients: [
      { name: 'Omega-3 (DHA+EPA)', amount: '3200mg (640% AI)', emoji: '🐟', highlight: true },
      { name: 'Vitamin D', amount: '16mcg (107% RDA)', emoji: '☀️', highlight: true },
      { name: 'B12', amount: '4.1mcg (171% RDA)', emoji: '⚡', highlight: true },
      { name: 'Astaxanthin (raw)', amount: 'Most bioavailable form', emoji: '🦐', highlight: true },
      { name: 'Selenium', amount: '52mcg (95% RDA)', emoji: '🌰' },
      { name: 'Vitamin B6', amount: '0.9mg (55% RDA)', emoji: '🧠' },
      { name: 'Potassium', amount: '920mg (26% RDA)', emoji: '🫀' },
      { name: 'Choline', amount: '180mg (33% RDA)', emoji: '🧠' }
    ],
    tip: 'Curing is not cooking — the salt draws moisture out and denatures proteins via osmosis. The result is firmer, silkier salmon with fully intact omega-3s and B vitamins that heat would diminish.',
    funFact: 'Gravlax comes from "grav" (grave/buried) + "lax" (salmon) — medieval Scandinavian fishermen literally buried salted salmon underground for fermentation. The Greenlandic Inuit, who eat similar raw-cured fish, have remarkably low rates of heart disease.'
  },
  {
    id: 'jamaican-callaloo',
    name: 'Jamaican Callaloo & Saltfish',
    cuisine: 'Jamaican 🇯🇲',
    cuisineFlag: '🇯🇲',
    emoji: '🥬',
    category: 'stew',
    dietTags: ['balanced-omnivore', 'anti-inflammatory'],
    difficulty: 'Easy',
    time: '30 min',
    servings: 3,
    description: 'Jamaica\'s iconic national dish — callaloo (a leafy green similar to spinach, rich in iron) sautéed with desalted saltfish (cod), scotch bonnet, thyme, and tomatoes. The Caribbean\'s most nutrient-dense everyday meal.',
    keyBenefits: ['Callaloo: more iron than spinach', 'Saltfish: exceptional iodine & B12 source', 'Scotch bonnet: highest capsaicin = metabolism boost', 'Complete protein from fish+greens'],
    ingredients: [
      '400g callaloo (or spinach/amaranth leaves)', '200g saltfish (salted cod), desalted',
      '1 onion, diced', '3 garlic cloves, minced', '2 tomatoes, diced',
      '1 scotch bonnet pepper, seeded and minced', '4 spring onions',
      '3 sprigs fresh thyme', '2 tbsp coconut oil',
      'Black pepper to taste', 'Fried dumplings or hard dough bread to serve'
    ],
    steps: [
      'Desalt fish: soak in cold water 4-6 hours changing water twice (or boil 10 min, drain). Flake into pieces, removing bones.',
      'Sauté onion, garlic, and spring onions in coconut oil 3 min.',
      'Add scotch bonnet and thyme, stir 1 min.',
      'Add tomatoes and cook 3 min until soft.',
      'Add callaloo and saltfish, fold together gently.',
      'Cover and cook on medium-low 10-12 min until callaloo is wilted and tender.',
      'Adjust seasoning. Serve with fried dumplings or hard dough bread.'
    ],
    macros: { calories: 310, protein: '34g', carbs: '18g', fat: '10g', fiber: '6g' },
    keyMicronutrients: [
      { name: 'Iron (callaloo)', amount: '8mg (44% RDA)', emoji: '🔴', highlight: true },
      { name: 'Iodine (saltfish)', amount: '180mcg (120% RDA)', emoji: '🦋', highlight: true },
      { name: 'B12 (saltfish)', amount: '2.9mcg (121% RDA)', emoji: '⚡', highlight: true },
      { name: 'Vitamin A', amount: '760mcg (84% RDA)', emoji: '👁️', highlight: true },
      { name: 'Vitamin C (scotch bonnet)', amount: '140mg (156% RDA)', emoji: '🍊' },
      { name: 'Capsaicin (scotch bonnet)', amount: 'Metabolism & anti-inflammatory', emoji: '🌶️' },
      { name: 'Calcium', amount: '210mg (21% RDA)', emoji: '🦷' },
      { name: 'Folate', amount: '195mcg (49% RDA)', emoji: '🧬' }
    ],
    tip: 'Callaloo is the Caribbean name for several leafy greens (amaranth, taro leaves, or water spinach). All are exceptionally high in iron — when served with scotch bonnet (which is extremely high in Vitamin C), iron absorption is dramatically boosted.',
    funFact: 'Jamaica\'s National Dish Act lists callaloo and saltfish as the official national breakfast. Scotch bonnet peppers rank among the hottest in the world and contain 10x more Vitamin C than an orange per gram.'
  },
  {
    id: 'pakistani-saag',
    name: 'Pakistani Saag (Spiced Mustard Greens)',
    cuisine: 'Pakistani 🇵🇰',
    cuisineFlag: '🇵🇰',
    emoji: '🥬',
    category: 'stew',
    dietTags: ['plant-based', 'anti-inflammatory', 'longevity'],
    difficulty: 'Medium',
    time: '90 min',
    servings: 4,
    description: 'Punjab\'s slow-cooked mustard and spinach purée with ginger, garlic, and ghee tadka — one of the most mineral-rich dishes in South Asian cuisine. Traditionally eaten with makki di roti (cornbread) in winter.',
    keyBenefits: ['Mustard greens: most Vitamin K1 per gram', 'Ghee aids fat-soluble vitamin absorption', 'Sulforaphane from mustard greens', 'Exceptional iron for plant-based'],
    ingredients: [
      '500g mustard greens (sarson), roughly chopped', '300g spinach',
      '100g bathua (lamb\'s quarters) or extra spinach', '1 large onion, diced',
      '6 garlic cloves', '2 inch ginger', '2 green chilies',
      '1 tbsp ghee (for tadka)', '1 tsp cumin seeds', '1 dry red chili',
      '1 tbsp makki flour (cornmeal) to thicken', 'Salt to taste',
      'Makki di roti or whole wheat flatbread, fresh butter to serve'
    ],
    steps: [
      'Wash and roughly chop all greens. Boil in minimal water with ginger, garlic, and green chilies for 45-60 min until very soft.',
      'Mash thoroughly with a wooden churner (mathani) or blend coarsely — keep some texture.',
      'Add makki flour, stir in and cook 10 more min until thickened.',
      'Season with salt.',
      'Make tadka: heat ghee until smoking, add cumin seeds and dry red chili. Sizzle 30 sec.',
      'Pour tadka over saag. Serve with roti and a small cube of white butter.'
    ],
    macros: { calories: 220, protein: '12g', carbs: '22g', fat: '9g', fiber: '10g' },
    keyMicronutrients: [
      { name: 'Vitamin K1 (mustard greens)', amount: '720mcg (600% RDA)', emoji: '🩸', highlight: true },
      { name: 'Vitamin A', amount: '890mcg (99% RDA)', emoji: '👁️', highlight: true },
      { name: 'Iron', amount: '7.5mg (42% RDA)', emoji: '🔴', highlight: true },
      { name: 'Sulforaphane (mustard)', amount: 'Cancer-protective isothiocyanate', emoji: '🥦', highlight: true },
      { name: 'Calcium', amount: '380mg (38% RDA)', emoji: '🦷' },
      { name: 'Folate', amount: '310mcg (78% RDA)', emoji: '🧬' },
      { name: 'Vitamin C', amount: '78mg (87% RDA)', emoji: '🍊' },
      { name: 'Magnesium', amount: '88mg (21% RDA)', emoji: '😴' }
    ],
    tip: 'The ghee tadka isn\'t just for flavor — fat dramatically increases absorption of Vitamins A and K1 from the greens. This is why traditional cooking instinctively combined leafy greens with fat.',
    funFact: 'Mustard greens (sarson) have the highest Vitamin K1 content of any vegetable — exceeding even kale. Punjab has one of the lowest osteoporosis rates in South Asia, and saag consumption is considered a contributing factor.'
  },
  {
    id: 'spanish-gazpacho',
    name: 'Andalusian Gazpacho',
    cuisine: 'Spanish 🇪🇸',
    cuisineFlag: '🇪🇸',
    emoji: '🍅',
    category: 'soup',
    dietTags: ['mediterranean', 'plant-based', 'anti-inflammatory'],
    difficulty: 'Easy',
    time: '15 min (+ 2h chill)',
    servings: 4,
    description: 'Andalusia\'s legendary cold tomato soup — raw blended tomatoes, cucumber, bell pepper, garlic, and sherry vinegar with best-quality EVOO. Completely uncooked, maximizing heat-sensitive nutrients.',
    keyBenefits: ['Zero cooking preserves all Vitamin C', 'Lycopene bioavailable via EVOO', 'Rich in polyphenols', 'Natural hydration with electrolytes'],
    ingredients: [
      '1kg ripe vine tomatoes', '1 green bell pepper', '1 small cucumber',
      '1 small red onion', '2 garlic cloves', '4 tbsp extra-virgin olive oil',
      '2 tbsp sherry vinegar (or red wine vinegar)', '1 tsp salt',
      '100ml cold water', 'Toasted bread, diced cucumber, tomato for garnish'
    ],
    steps: [
      'Roughly chop all vegetables.',
      'Blend tomatoes, pepper, cucumber, onion, and garlic until very smooth.',
      'With blender running, slowly stream in olive oil (creates an emulsion).',
      'Add vinegar, salt, and water. Blend again.',
      'Pass through fine sieve for silky texture (optional but traditional).',
      'Refrigerate minimum 2 hours until very cold.',
      'Serve in chilled bowls with diced garnishes and an EVOO drizzle.'
    ],
    macros: { calories: 180, protein: '3g', carbs: '18g', fat: '11g', fiber: '4g' },
    keyMicronutrients: [
      { name: 'Lycopene', amount: '18mg (300% optimal)', emoji: '🍅', highlight: true },
      { name: 'Vitamin C', amount: '85mg (94% RDA)', emoji: '🍊', highlight: true },
      { name: 'EVOO polyphenols', amount: 'Oleocanthal (anti-inflammatory)', emoji: '🫒', highlight: true },
      { name: 'Vitamin A', amount: '480mcg (53% RDA)', emoji: '👁️' },
      { name: 'Potassium', amount: '850mg (24% RDA)', emoji: '🫀' },
      { name: 'Quercetin (tomato skin)', amount: 'Flavonoid antioxidant', emoji: '🧅' },
      { name: 'Vitamin K1', amount: '40mcg (33% RDA)', emoji: '🩸' },
      { name: 'Folate', amount: '75mcg (19% RDA)', emoji: '🧬' }
    ],
    tip: 'Use the ripest, most flavorful tomatoes you can find — this recipe has no heat to mask imperfections. Heirloom tomatoes contain 50% more lycopene than standard varieties.',
    funFact: 'Gazpacho originated among Andalusian farm workers who needed a cold, hydrating, calorie-dense meal in the summer heat. Modern research shows it significantly lowers blood pressure — attributed to its nitrates, potassium, and polyphenols working together.'
  },
  {
    id: 'chinese-congee',
    name: 'Ginger & Century Egg Congee',
    cuisine: 'Chinese 🇨🇳',
    cuisineFlag: '🇨🇳',
    emoji: '🥣',
    category: 'breakfast',
    dietTags: ['balanced-omnivore', 'longevity', 'anti-inflammatory'],
    difficulty: 'Easy',
    time: '60 min',
    servings: 4,
    description: 'China\'s ancient healing porridge — rice slow-cooked in broth until silky and creamy, topped with century egg, fresh ginger, sesame oil, and crispy shallots. A restorative dish eaten across East and Southeast Asia for recovery and gut health.',
    keyBenefits: ['Easily digestible — ideal for recovery', 'Fresh ginger: powerful anti-nausea & anti-inflammatory', 'Collagen from broth heals gut lining', 'High choline from century egg'],
    ingredients: [
      '1 cup jasmine rice', '1.5L chicken or bone broth',
      '2 century eggs (pidan), peeled and quartered', '2 inch fresh ginger, julienned',
      '2 tbsp sesame oil', '2 tbsp soy sauce',
      '3 spring onions, sliced', '2 tbsp crispy fried shallots',
      'White pepper to taste', 'Fresh coriander to garnish'
    ],
    steps: [
      'Rinse rice. Bring broth to boil in large pot.',
      'Add rice, reduce to lowest simmer, cover partially.',
      'Cook 45-60 min, stirring occasionally, until rice breaks down into creamy porridge.',
      'The consistency should be like thin oatmeal — add broth or water if too thick.',
      'Season with soy sauce and white pepper.',
      'Ladle into bowls. Top with century egg pieces, julienned ginger, spring onion.',
      'Finish with sesame oil, crispy shallots, and fresh coriander.'
    ],
    macros: { calories: 290, protein: '14g', carbs: '42g', fat: '8g', fiber: '1g' },
    keyMicronutrients: [
      { name: 'Choline (century egg)', amount: '280mg (51% RDA)', emoji: '🧠', highlight: true },
      { name: 'Collagen (bone broth)', amount: 'Gut-healing protein', emoji: '🦴', highlight: true },
      { name: 'Gingerols & Shogaols', amount: 'Anti-nausea, anti-inflammatory', emoji: '🟡', highlight: true },
      { name: 'B12', amount: '1.4mcg (58% RDA)', emoji: '⚡' },
      { name: 'Selenium', amount: '22mcg (40% RDA)', emoji: '🌰' },
      { name: 'Zinc', amount: '2.1mg (19% RDA)', emoji: '🦪' },
      { name: 'Iron', amount: '2.8mg (16% RDA)', emoji: '🔴' },
      { name: 'Potassium (broth)', amount: '580mg (17% RDA)', emoji: '🫀' }
    ],
    tip: 'The longer you cook the rice (up to 90 min), the more gelatinous and healing the congee becomes. The starch molecules fully dissolve, releasing resistant starch that feeds beneficial gut bacteria.',
    funFact: 'Congee has been eaten in China for at least 2,500 years. Traditional Chinese medicine prescribes it as a restorative food for illness recovery — modern gastroenterology confirms its benefits for inflamed intestinal lining.'
  },
  {
    id: 'cambodian-fish-amok',
    name: 'Cambodian Fish Amok',
    cuisine: 'Cambodian 🇰🇭',
    cuisineFlag: '🇰🇭',
    emoji: '🥥',
    category: 'stew',
    dietTags: ['anti-inflammatory', 'balanced-omnivore'],
    difficulty: 'Medium',
    time: '40 min',
    servings: 3,
    description: 'Cambodia\'s national dish — fresh fish steamed in a rich kroeung (lemongrass curry paste) with coconut cream and kaffir lime leaves, traditionally served in a banana leaf cup. Fragrant, silky, and extraordinarily nutritious.',
    keyBenefits: ['Complete protein', 'MCT fats from coconut cream', 'Lemongrass: antimicrobial and digestive', 'Turmeric in kroeung: anti-inflammatory'],
    ingredients: [
      '500g firm white fish fillets (catfish or snapper), cubed',
      '400ml coconut cream', '2 tbsp fish sauce', '1 egg',
      '4 kaffir lime leaves, chiffonade', '1 tbsp palm sugar',
      'For kroeung paste: 3 lemongrass stalks, 4 kaffir lime leaves,',
      '4 garlic cloves, 3 shallots, 2 inch galangal, 1 tsp turmeric,',
      '2 dried red chilies, 1 tsp shrimp paste',
      'Banana leaves or ramekins', 'Jasmine rice and fresh Thai basil to serve'
    ],
    steps: [
      'Make kroeung: blend all paste ingredients with a splash of coconut cream until very smooth.',
      'Fry kroeung paste in a dry wok 3-4 min until fragrant and darkened.',
      'Add coconut cream, fish sauce, and palm sugar. Stir until well combined.',
      'Remove from heat. Beat in the egg. Add fish pieces and kaffir lime leaves, stir gently.',
      'Pour into banana leaf cups or ramekins.',
      'Steam on high heat 15-20 min until set (like a savory custard).',
      'Garnish with fresh Thai basil and extra kaffir lime. Serve with jasmine rice.'
    ],
    macros: { calories: 450, protein: '36g', carbs: '22g', fat: '24g', fiber: '2g' },
    keyMicronutrients: [
      { name: 'Iodine (fish)', amount: '160mcg (107% RDA)', emoji: '🦋', highlight: true },
      { name: 'B12', amount: '3.5mcg (146% RDA)', emoji: '⚡', highlight: true },
      { name: 'MCT (coconut cream)', amount: 'Fast-metabolizing fats', emoji: '🥥', highlight: true },
      { name: 'Selenium', amount: '48mcg (87% RDA)', emoji: '🌰' },
      { name: 'Curcumin (turmeric in kroeung)', amount: 'Anti-inflammatory', emoji: '🟡' },
      { name: 'Lemongrass citral', amount: 'Antimicrobial, digestive support', emoji: '🌿' },
      { name: 'Omega-3 (DHA)', amount: '980mg', emoji: '🐟' },
      { name: 'Potassium', amount: '870mg (25% RDA)', emoji: '🫀' }
    ],
    tip: 'The secret to silky amok is the egg — it acts as a binder and creates the custard-like set. Don\'t rush the steaming; gentle heat gives a smooth result while high heat creates bubbles.',
    funFact: 'Fish amok is one of the few Khmer dishes to use coconut cream as a base, reflecting Cambodian cuisine\'s ancient Indian influence. Galangal (similar to ginger) contains ACA — a compound studied for anti-cancer properties.'
  },
  {
    id: 'uzbek-plov',
    name: 'Uzbek Lamb Plov',
    cuisine: 'Uzbek 🇺🇿',
    cuisineFlag: '🇺🇿',
    emoji: '🍚',
    category: 'bowl',
    dietTags: ['balanced-omnivore', 'longevity'],
    difficulty: 'Hard',
    time: '90 min',
    servings: 6,
    description: 'Central Asia\'s greatest dish — aromatic basmati rice slow-cooked in lamb fat with whole garlic, cumin, barberries, and golden carrots in a heavy cast-iron kazan. A UNESCO-listed cultural heritage dish.',
    keyBenefits: ['Barberries: highest berberine content (blood sugar regulation)', 'Lamb: exceptional zinc & B12', 'Whole garlic cloves: allicin bioavailability', 'Complex carb + protein balance'],
    ingredients: [
      '500g lamb shoulder, cubed', '400g basmati rice, rinsed', '3 large carrots, julienned',
      '2 whole heads garlic', '2 large onions, sliced', '2 tbsp cumin seeds',
      '½ cup barberries (zereshk) or dried cranberries', '1 tsp turmeric',
      '100ml neutral oil or lamb fat', '700ml water or broth',
      '1 tsp black pepper', 'Fresh dill and spring onion to serve'
    ],
    steps: [
      'Heat oil until smoking in large heavy pot (kazan or Dutch oven). Fry lamb in batches until browned on all sides.',
      'Add onions, cook until deep golden 15 min. Add carrots, cook 10 min.',
      'Add cumin, turmeric, pepper, and half the barberries. Stir 2 min.',
      'Add water or broth, bring to boil, simmer 20 min.',
      'Push whole unpeeled garlic heads into the meat mixture.',
      'Add rinsed rice in an even layer. Do NOT stir.',
      'Cook uncovered until water is absorbed to rice level. Reduce to lowest heat, cover, steam 20 min.',
      'Fluff from edges in. Top with remaining barberries, fresh dill. Serve directly from the pot.'
    ],
    macros: { calories: 620, protein: '34g', carbs: '72g', fat: '20g', fiber: '5g' },
    keyMicronutrients: [
      { name: 'Zinc (lamb)', amount: '8mg (73% RDA)', emoji: '🦪', highlight: true },
      { name: 'B12 (lamb)', amount: '3.8mcg (158% RDA)', emoji: '⚡', highlight: true },
      { name: 'Berberine (barberries)', amount: 'Blood sugar regulation', emoji: '🔴', highlight: true },
      { name: 'Allicin (whole garlic)', amount: 'Antimicrobial, cardiovascular', emoji: '🧄', highlight: true },
      { name: 'Iron (heme)', amount: '5.5mg (31% RDA)', emoji: '🔴' },
      { name: 'Selenium', amount: '38mcg (69% RDA)', emoji: '🌰' },
      { name: 'Niacin (B3)', amount: '9mg (56% RDA)', emoji: '🧬' },
      { name: 'Magnesium', amount: '68mg (16% RDA)', emoji: '😴' }
    ],
    tip: 'The whole garlic heads, cooked gently in the steam, become sweet and mild — squeeze them out onto the rice. Slow-roasted garlic has dramatically reduced pungency but retains allicin precursors.',
    funFact: 'Plov is to Uzbekistan what pizza is to Italy — a national obsession and cultural ritual. UNESCO inscribed "plov culture" in Uzbekistan on its Intangible Cultural Heritage list in 2016. A master plov cook (oshpaz) is a respected profession.'
  },
  {
    id: 'polish-borscht',
    name: 'Polish Beet Borscht (Barszcz)',
    cuisine: 'Polish 🇵🇱',
    cuisineFlag: '🇵🇱',
    emoji: '🍵',
    category: 'soup',
    dietTags: ['plant-based', 'anti-inflammatory', 'balanced-omnivore'],
    difficulty: 'Easy',
    time: '50 min',
    servings: 4,
    description: 'Eastern Europe\'s iconic deep-crimson beet soup — sweet-sour roasted beets with vegetable broth, apple, and a touch of red wine vinegar, garnished with fresh dill and sour cream. High in betalains — one of the most potent antioxidants known.',
    keyBenefits: ['Betalains from beets: unique antioxidants not found elsewhere', 'Nitrates lower blood pressure naturally', 'High folate for cell repair', 'Liver-protective compounds'],
    ingredients: [
      '600g raw beetroot, peeled and diced', '2 medium carrots, diced',
      '2 celery stalks, diced', '1 onion, diced', '1 apple, peeled and diced',
      '4 garlic cloves', '1.5L vegetable or beef broth',
      '3 tbsp red wine vinegar', '1 tsp sugar', '1 bay leaf',
      '4 allspice berries', 'Fresh dill, sour cream to serve', 'Salt and black pepper'
    ],
    steps: [
      'Roast diced beets at 200°C for 25 min with drizzle of oil until slightly caramelized.',
      'Sauté onion, carrot, and celery in pot 8 min. Add garlic, cook 1 min.',
      'Add broth, roasted beets, apple, bay leaf, and allspice. Bring to boil.',
      'Simmer 20 min until all vegetables are completely tender.',
      'Blend smooth (or strain for clear borscht). Add vinegar and sugar.',
      'Season generously with salt and pepper.',
      'Serve with fresh dill, a dollop of sour cream, and rye bread.'
    ],
    macros: { calories: 180, protein: '5g', carbs: '32g', fat: '4g', fiber: '7g' },
    keyMicronutrients: [
      { name: 'Betalains (beets)', amount: 'Unique class of antioxidants', emoji: '💜', highlight: true },
      { name: 'Nitrates → NO', amount: 'Lowers blood pressure by 4-8 mmHg', emoji: '❤️', highlight: true },
      { name: 'Folate', amount: '290mcg (73% RDA)', emoji: '🧬', highlight: true },
      { name: 'Potassium', amount: '820mg (23% RDA)', emoji: '🫀' },
      { name: 'Manganese', amount: '1.6mg (70% RDA)', emoji: '🌾' },
      { name: 'Vitamin C', amount: '22mg (24% RDA)', emoji: '🍊' },
      { name: 'Iron', amount: '3.2mg (18% RDA)', emoji: '🔴' },
      { name: 'Betaine', amount: 'Liver-protective methyl donor', emoji: '🫀' }
    ],
    tip: 'Roasting beets before adding to soup dramatically concentrates their flavor and caramelizes natural sugars. The deep crimson color indicates high betalain concentration — don\'t boil away the color.',
    funFact: 'Beet betalains are pH-sensitive indicators — they turn yellow in acid and deep red in alkaline conditions. Studies show dietary nitrates from beets can improve athletic performance by 2-3% — used by professional athletes worldwide.'
  },
  {
    id: 'filipino-sinigang',
    name: 'Filipino Sinigang na Baboy',
    cuisine: 'Filipino 🇵🇭',
    cuisineFlag: '🇵🇭',
    emoji: '🥣',
    category: 'soup',
    dietTags: ['balanced-omnivore', 'anti-inflammatory'],
    difficulty: 'Easy',
    time: '60 min',
    servings: 4,
    description: 'The Philippines\' beloved sour tamarind soup — pork ribs slow-simmered with an abundance of vegetables in a naturally sour tamarind broth. The sourness comes from whole fruits — tamarind, green tomatoes, or guava — making it exceptionally high in Vitamin C.',
    keyBenefits: ['Tamarind: exceptional tartaric acid, minerals', 'High diverse vegetables = phytonutrient density', 'Collagen from slow-cooked pork', 'Vitamin C from souring agents boosts iron absorption'],
    ingredients: [
      '800g pork ribs or pork belly', '1 packet (40g) tamarind soup base (or 200g fresh tamarind)',
      '200g kangkong (water spinach) or spinach', '1 large eggplant, chunked',
      '200g green beans', '2 medium tomatoes, quartered', '1 onion, quartered',
      '2 taro roots, peeled and cubed (optional)', '2L water',
      '2 tbsp fish sauce', 'Green chili, fresh kangkong to serve'
    ],
    steps: [
      'Boil pork ribs in water with onion and tomatoes. Skim foam diligently. Simmer 40 min.',
      'Add taro (if using) and eggplant. Cook 10 min.',
      'Dissolve tamarind base in a cup of broth, add to pot.',
      'Add green beans, cook 5 min.',
      'Add kangkong last, cook 2 min until just wilted.',
      'Season generously with fish sauce. The broth should be distinctly sour.',
      'Serve in deep bowls with white rice and fish sauce with chili on the side.'
    ],
    macros: { calories: 480, protein: '38g', carbs: '28g', fat: '22g', fiber: '8g' },
    keyMicronutrients: [
      { name: 'Vitamin C (tamarind + veggies)', amount: '110mg (122% RDA)', emoji: '🍊', highlight: true },
      { name: 'Collagen (slow pork)', amount: 'Joint and skin proteins', emoji: '🦴', highlight: true },
      { name: 'Iron', amount: '6.2mg (34% RDA)', emoji: '🔴', highlight: true },
      { name: 'B12', amount: '1.8mcg (75% RDA)', emoji: '⚡' },
      { name: 'Potassium', amount: '1150mg (33% RDA)', emoji: '🫀' },
      { name: 'Thiamine B1 (pork)', amount: '0.7mg (58% RDA)', emoji: '⚡' },
      { name: 'Zinc', amount: '4.5mg (41% RDA)', emoji: '🦪' },
      { name: 'Magnesium', amount: '82mg (20% RDA)', emoji: '😴' }
    ],
    tip: 'Sinigang is intentionally very sour — don\'t hold back on the tamarind. The high acidity has a practical function: it helps break down tough collagen in the pork and increases mineral solubility in the broth.',
    funFact: 'Sinigang was voted the World\'s Best Soup by TasteAtlas in 2021. The Philippines\' cuisine is one of the most diverse in Asia, and sinigang\'s acidic base can be made with tamarind, guava, green mango, bilimbi, or calamansi — each adding its own micronutrients.'
  }
];

// Filter pool to only recipes not already in the file
const newRecipes = pool.filter(r => !existingIds.has(r.id));

if (newRecipes.length === 0) {
  console.log('All pool recipes are already in recipes.json. Nothing to add.');
  process.exit(0);
}

// Pick 2 new recipes (deterministic: based on current week number)
const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
const pick1 = newRecipes[week % newRecipes.length];
const pick2 = newRecipes[(week + 1) % newRecipes.length];
const toAdd = pick1.id === pick2.id ? [pick1] : [pick1, pick2];

const updated = [...existing, ...toAdd];
writeFileSync(recipesPath, JSON.stringify(updated, null, 2));

console.log(`✅ Added ${toAdd.length} new recipe(s):`);
toAdd.forEach(r => console.log(`   - ${r.name} (${r.cuisine})`));
console.log(`📦 Total recipes: ${updated.length}`);
