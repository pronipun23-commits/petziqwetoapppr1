import type { FoodGuideItem } from './types';

export const FOOD_GUIDES: FoodGuideItem[] = [
  {
    id: 'dog-dry-kibble',
    name: 'Dry Kibble (Dogs)',
    petType: 'Dog',
    category: 'staple',
    generalInfo:
      'Complete and balanced dry dog food is the most common staple diet. Look for AAFCO-compliant formulations appropriate to your dog\u2019s life stage (puppy, adult, senior). Protein source should be the first ingredient.',
    safetyNotes:
      'Transition foods gradually over 7-10 days to avoid digestive upset. Store in a cool, dry place and use within 6 weeks of opening. Always provide fresh water alongside dry food.',
    suitable: ['All dog breeds', 'Puppies (puppy-specific formula)', 'Senior dogs (senior formula)'],
    unsuitable: ['Dogs with specific grain allergies (choose grain-free)', 'Dogs with dental issues (soften with water)'],
  },
  {
    id: 'dog-wet-food',
    name: 'Wet/Canned Food (Dogs)',
    petType: 'Dog',
    category: 'staple',
    generalInfo:
      'Canned dog food has higher moisture content (70-80%) and is more palatable than kibble. Useful for picky eaters, senior dogs, or dogs needing extra hydration. Can be fed alone or mixed with kibble.',
    safetyNotes:
      'Refrigerate opened cans and use within 3-5 days. Wet food alone may not provide enough dental abrasion \u2014 combine with dry food or dental chews.',
    suitable: ['Picky eaters', 'Senior dogs with reduced appetite', 'Dogs needing extra hydration'],
    unsuitable: ['Dogs prone to dental tartar (without dental care)'],
  },
  {
    id: 'dog-raw-diet',
    name: 'Raw Food Diet (Dogs)',
    petType: 'Dog',
    category: 'supplement',
    generalInfo:
      'Raw diets include raw meat, bones, organs, and sometimes vegetables. Controversial \u2014 proponents cite dental and coat benefits, while veterinary associations warn about bacterial risks and nutritional imbalance.',
    safetyNotes:
      'Consult a veterinary nutritionist before starting. Raw diets carry salmonella and E. coli risk for both dog and household. Immunocompromised individuals should avoid handling raw pet food. Homemade raw diets frequently lack proper calcium and nutrient balance.',
    suitable: ['Healthy adult dogs under veterinary guidance'],
    unsuitable: ['Puppies (nutritional imbalance risk)', 'Immunocompromised households', 'Dogs with digestive or immune issues'],
  },
  {
    id: 'dog-chocolate',
    name: 'Chocolate (Dogs)',
    petType: 'Dog',
    category: 'avoid',
    generalInfo:
      'Chocolate contains theobromine, which dogs cannot metabolize efficiently. Even small amounts can cause vomiting, diarrhea, and hyperactivity; larger amounts cause seizures, cardiac arrhythmia, and death.',
    safetyNotes:
      'Dark chocolate and baking chocolate are far more toxic than milk chocolate. If your dog eats chocolate, contact a veterinarian or poison control immediately \u2014 do not wait for symptoms.',
    suitable: [],
    unsuitable: ['All dogs \u2014 no amount is safe'],
  },
  {
    id: 'cat-dry-food',
    name: 'Dry Cat Food',
    petType: 'Cat',
    category: 'staple',
    generalInfo:
      'Dry cat food is convenient and helps reduce tartar, but cats are obligate carnivores with low thirst drives. Cats fed primarily dry food are at higher risk of urinary tract issues and kidney disease due to chronic mild dehydration.',
    safetyNotes:
      'Always provide fresh water. Consider a cat water fountain to encourage drinking. Mix with wet food for better hydration, especially in cats prone to urinary crystals.',
    suitable: ['Healthy adult cats', 'Cats that drink well'],
    unsuitable: ['Cats with urinary tract issues', 'Cats with kidney disease', 'Cats that do not drink enough water'],
  },
  {
    id: 'cat-wet-food',
    name: 'Wet Cat Food',
    petType: 'Cat',
    category: 'staple',
    generalInfo:
      'Wet cat food provides essential moisture (70-80% water) that cats need but rarely drink. Veterinarians increasingly recommend wet food as a primary diet for cats due to urinary and kidney health benefits.',
    safetyNotes:
      'Refrigerate opened food and use within 24-48 hours. Serve at room temperature for best palatability. Do not leave wet food out for more than 2 hours.',
    suitable: ['All cats, especially those with urinary issues', 'Senior cats', 'Cats that do not drink enough water'],
    unsuitable: ['Cats on strict dental diets (consult vet)'],
  },
  {
    id: 'cat-onion-garlic',
    name: 'Onion and Garlic (Cats)',
    petType: 'Cat',
    category: 'avoid',
    generalInfo:
      'All forms of onion, garlic, leeks, and chives damage cat red blood cells, causing hemolytic anemia. This includes powdered forms found in baby food and soups.',
    safetyNotes:
      'Even small amounts can be toxic. Symptoms may not appear for several days. If you suspect ingestion, contact a veterinarian immediately.',
    suitable: [],
    unsuitable: ['All cats \u2014 no amount is safe'],
  },
  {
    id: 'rabbit-hay',
    name: 'Timothy Hay (Rabbits)',
    petType: 'Rabbit',
    category: 'staple',
    generalInfo:
      'Grass hay (timothy, orchard, brome) should make up 80% of a rabbit\u2019s diet. It provides essential fiber for digestion and abrasion for continuously growing teeth. Unlimited access should be available at all times.',
    safetyNotes:
      'Alfalfa hay is too high in calcium and protein for adult rabbits \u2014 reserve for young rabbits under 6 months. Avoid moldy or dusty hay, which causes respiratory issues.',
    suitable: ['All adult rabbits', 'Guinea pigs', 'Chinchillas'],
    unsuitable: ['Animals that do not eat hay'],
  },
  {
    id: 'rabbit-pellets',
    name: 'Rabbit Pellets',
    petType: 'Rabbit',
    category: 'supplement',
    generalInfo:
      'Plain timothy-based pellets provide balanced nutrition as a supplement to hay. Feed in limited quantities \u2014 about 1/4 cup per 6 lbs of body weight daily. Avoid mixes with seeds, nuts, or colorful pieces.',
    safetyNotes:
      'Overfeeding pellets causes obesity and reduces hay consumption, leading to dental and digestive problems. Choose plain pellets with no added treats or seeds.',
    suitable: ['Adult rabbits (limited quantity)', 'Young rabbits (unlimited alfalfa pellets)'],
    unsuitable: ['Overweight rabbits (reduce further)', 'Rabbits with bladder sludge (low-calcium pellets)'],
  },
  {
    id: 'rabbit-fruit',
    name: 'Fruits as Treats (Rabbits)',
    petType: 'Rabbit',
    category: 'treat',
    generalInfo:
      'Fruits like apple (no seeds), banana, strawberry, and blueberry can be given as occasional treats. High in natural sugar \u2014 limit to 1-2 tablespoons per day maximum.',
    safetyNotes:
      'Avoid apple seeds (contain cyanide), cherry pits, and stone fruit pits. Introduce new fruits slowly to avoid digestive upset. Fruit should never replace hay or vegetables.',
    suitable: ['Adult rabbits in small amounts'],
    unsuitable: ['Baby rabbits under 3 months', 'Overweight rabbits (limit further)'],
  },
  {
    id: 'fish-flakes',
    name: 'Fish Flakes',
    petType: 'Fish',
    category: 'staple',
    generalInfo:
      'Flake food is the most common staple for tropical and community fish. Choose species-appropriate flakes \u2014 tropical, goldfish, cichlid, or marine varieties differ significantly in formulation.',
    safetyNotes:
      'Feed only what fish consume in 2-3 minutes, 1-2 times daily. Overfeeding is the most common cause of poor water quality and fish disease. Flakes lose nutritional value within 6 months of opening.',
    suitable: ['Community tropical fish', 'Goldfish (goldfish-specific flakes)'],
    unsuitable: ['Bottom-dwelling fish (use sinking pellets)', 'Large predatory fish (need frozen/live food)'],
  },
  {
    id: 'fish-frozen',
    name: 'Frozen Foods (Fish)',
    petType: 'Fish',
    category: 'supplement',
    generalInfo:
      'Frozen brine shrimp, bloodworms, daphnia, and mysis shrimp provide excellent nutrition and variety for fish. Especially valuable for picky eaters, conditioning breeders, and predatory species.',
    safetyNotes:
      'Thaw frozen food in aquarium water before feeding \u2014 never add frozen blocks directly. Do not refreeze thawed food. Rinse before feeding to reduce phosphate contamination.',
    suitable: ['Carnivorous and omnivorous fish', 'Finicky eaters', 'Breeding condition fish'],
    unsuitable: ['Herbivorous fish', 'Fish with specific dietary restrictions'],
  },
  {
    id: 'bird-pellets',
    name: 'Pelleted Diet (Birds)',
    petType: 'Bird',
    category: 'staple',
    generalInfo:
      'Formulated pellets provide balanced nutrition for parrots and are strongly recommended by avian veterinarians over seed-only diets. Pellets should make up 60-70% of the diet, with vegetables, fruits, and seeds making up the rest.',
    safetyNotes:
      'Transition from seeds to pellets gradually over 2-4 weeks \u2014 some birds refuse pellets initially. Consult an avian vet for species-specific pellet recommendations.',
    suitable: ['Parrots and parakeets', 'Cockatiels and conures', 'Large parrots'],
    unsuitable: ['Finches and canaries (seed-based diets are more appropriate)'],
  },
  {
    id: 'bird-seeds',
    name: 'Seed Mix (Birds)',
    petType: 'Bird',
    category: 'supplement',
    generalInfo:
      'Seed mixes are palatable but nutritionally incomplete as a sole diet. Seeds are high in fat and low in vitamins and calcium. Use as part of a varied diet alongside pellets and fresh vegetables.',
    safetyNotes:
      'Seed-only diets cause fatty liver disease, vitamin A deficiency, and calcium deficiency. Remove hulls daily. Avoid seed mixes with artificial coloring.',
    suitable: ['Finches and canaries (higher seed proportion ok)', 'As treat/supplement for parrots'],
    unsuitable: ['As sole diet for any parrot species'],
  },
  {
    id: 'hamster-food',
    name: 'Hamster Food Mix',
    petType: 'Hamster',
    category: 'staple',
    generalInfo:
      'A commercial hamster food mix with pellets and seeds provides balanced nutrition. Syrians need protein-rich formulations; dwarf hamsters need lower-sugar diets. Supplement with small amounts of fresh vegetables and occasional protein (mealworms, boiled egg).',
    safetyNotes:
      'Remove uneaten fresh food within 12 hours to prevent mold. Avoid sugary treats \u2014 hamsters are prone to diabetes, especially Campbell\u2019s dwarf hamsters.',
    suitable: ['All hamster species (species-appropriate mix)'],
    unsuitable: ['Hamsters with diabetes (sugar-free formulas only)'],
  },
  {
    id: 'reptile-live-prey',
    name: 'Live Prey (Reptiles)',
    petType: 'Reptile',
    category: 'avoid',
    generalInfo:
      'Live prey (mice, rats, insects) can bite and injure reptiles, causing infections and stress. Frozen-thawed prey is safer, more humane, and equally nutritious.',
    safetyNotes:
      'If live feeding is absolutely necessary, never leave the prey unattended with the reptile. A live rodent can fatally injure a snake that does not strike immediately. Frozen-thawed is strongly recommended by reptile veterinarians.',
    suitable: [],
    unsuitable: ['All reptiles \u2014 frozen-thawed is the safe alternative'],
  },
  {
    id: 'guinea-pig-vitamin-c',
    name: 'Vitamin C (Guinea Pigs)',
    petType: 'Guinea Pig',
    category: 'supplement',
    generalInfo:
      'Like humans, guinea pigs cannot synthesize vitamin C and must get it from their diet. A deficiency causes scurvy \u2014 weakness, rough coat, joint pain, and bleeding. Provide vitamin C-rich vegetables daily (bell peppers, parsley, kale) or a supplement.',
    safetyNotes:
      'Do not add vitamin C to the water \u2014 it degrades quickly and changes the taste, reducing water intake. Use fresh vegetables or a direct oral supplement instead.',
    suitable: ['All guinea pigs \u2014 daily requirement is 30-50 mg'],
    unsuitable: [],
  },
  {
    id: 'general-grapes',
    name: 'Grapes and Raisins',
    petType: 'Dog',
    category: 'avoid',
    generalInfo:
      'Grapes and raisins can cause acute kidney failure in dogs. The toxic principle is unknown, and sensitivity varies \u2014 some dogs are affected by very small amounts while others tolerate more. There is no safe dose.',
    safetyNotes:
      'If your dog eats grapes or raisins, contact a veterinarian immediately. Do not wait for symptoms \u2014 kidney damage can be irreversible if treatment is delayed.',
    suitable: [],
    unsuitable: ['All dogs \u2014 no amount is safe'],
  },
  {
    id: 'general-xylitol',
    name: 'Xylitol (Sugar-Free Foods)',
    petType: 'Dog',
    category: 'avoid',
    generalInfo:
      'Xylitol is an artificial sweetener found in sugar-free gum, candy, peanut butter, and some baked goods. It causes a rapid, life-threatening drop in blood sugar and liver failure in dogs.',
    safetyNotes:
      'Always check ingredient labels before sharing any human food with your dog. Xylitol is increasingly common in products. If ingestion occurs, seek emergency veterinary care immediately.',
    suitable: [],
    unsuitable: ['All dogs \u2014 extremely toxic even in tiny amounts'],
  },
];
