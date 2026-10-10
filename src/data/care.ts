import type { CareGuide, ProblemTopic } from './types';

export const CARE_GUIDES: CareGuide[] = [
  {
    id: 'new-pet-checklist',
    title: 'The First 30 Days With a New Pet',
    category: 'all',
    readTime: '6 min',
    excerpt:
      'A practical roadmap for settling any new pet — from safe transport to building trust and routine.',
    sections: [
      {
        heading: 'Prepare before arrival',
        body: 'Set up the enclosure, food, water source, and hides before the pet arrives. A calm, ready space reduces first-day stress and prevents rushed decisions.',
      },
      {
        heading: 'Give space, not attention',
        body: 'Resist the urge to handle constantly. Most pets need 24-72 hours of quiet observation to acclimate to new smells, sounds, and light before meaningful interaction.',
      },
      {
        heading: 'Establish a routine',
        body: 'Feed, clean, and interact at consistent times. Predictability lowers stress hormones and accelerates bonding and training.',
      },
      {
        heading: 'Book a vet visit',
        body: 'Schedule a wellness check within the first week, even if the pet appears healthy. Baselines and parasite screening matter.',
      },
    ],
  },
  {
    id: 'nutrition-fundamentals',
    title: 'Nutrition Fundamentals Across Species',
    category: 'all',
    readTime: '8 min',
    excerpt:
      'Why "one food fits all" fails — the core principles of species-appropriate diets and common pitfalls.',
    sections: [
      {
        heading: 'Match the wild diet',
        body: 'Carnivores need animal protein; herbivores need fiber-rich forage; omnivores need balance. Mimicking the natural diet prevents metabolic disease.',
      },
      {
        heading: 'Avoid human food traps',
        body: 'Chocolate, avocado, onion, garlic, grapes, and xylitol are toxic across many species. When in doubt, do not share.',
      },
      {
        heading: 'Portion to the species',
        body: 'Free-feeding suits some grazers (rabbits, guinea pigs) but causes obesity in dogs, cats, and hamsters. Measure meals and monitor body condition.',
      },
      {
        heading: 'Supplement with purpose',
        body: 'Guinea pigs need vitamin C; reptiles need calcium/D3; fish need variety. Random supplementation can cause toxicity — follow species guidelines.',
      },
    ],
  },
  {
    id: 'dog-training-basics',
    title: 'Positive Reinforcement Dog Training',
    category: 'dogs',
    readTime: '7 min',
    excerpt:
      'The science-backed foundation for raising a confident, well-mannered dog without force.',
    sections: [
      {
        heading: 'Reward what you want',
        body: 'Behaviors that are reinforced increase. Mark the desired behavior instantly with a word or clicker, then reward within 1-2 seconds.',
      },
      {
        heading: 'Short, frequent sessions',
        body: 'Three 5-minute sessions beat one 30-minute block. Dogs learn best before fatigue and distraction set in.',
      },
      {
        heading: 'Socialize early',
        body: 'The 3-14 week window is critical. Expose puppies to varied people, surfaces, sounds, and dogs in a controlled, positive way.',
      },
      {
        heading: 'Manage, do not punish',
        body: 'Prevent unwanted behavior through environment and supervision. Punishment erodes trust and creates anxiety without teaching.',
      },
    ],
  },
  {
    id: 'cat-enrichment',
    title: 'Enrichment for Indoor Cats',
    category: 'cats',
    readTime: '5 min',
    excerpt:
      'Boredom is the hidden cause of most cat behavior issues. Here is how to build a stimulating indoor life.',
    sections: [
      {
        heading: 'Vertical territory',
        body: 'Cats read the world in 3D. Tall cat trees, shelves, and window perches expand usable territory and reduce conflict in multi-cat homes.',
      },
      {
        heading: 'Hunt-style feeding',
        body: 'Use puzzle feeders and food balls to mimic hunting. This slows eating, prevents obesity, and satisfies predatory instincts.',
      },
      {
        heading: 'Rotate toys',
        body: 'Put toys on rotation weekly. Novelty triggers play; permanent access desensitizes. Keep a hidden stash.',
      },
      {
        heading: 'Daily interactive play',
        body: '10-15 minutes of wand-toy play mimics the full hunt cycle — stalk, chase, catch, kill, eat. End with a small treat.',
      },
    ],
  },
  {
    id: 'aquarium-water',
    title: 'Aquarium Water Quality Basics',
    category: 'fish',
    readTime: '6 min',
    excerpt:
      'Stable water is the foundation of fishkeeping. Understand the nitrogen cycle and avoid new-tank deaths.',
    sections: [
      {
        heading: 'Cycle before fish',
        body: 'A tank must build beneficial bacteria that convert ammonia to nitrite to nitrate. This takes 4-6 weeks. Adding fish before cycling causes "new tank syndrome."',
      },
      {
        heading: 'Test, do not guess',
        body: 'Weekly tests for ammonia, nitrite, nitrate, and pH catch problems before fish show symptoms. Liquid kits beat strips for accuracy.',
      },
      {
        heading: 'Change water consistently',
        body: '20-30% weekly removes nitrate buildup and replenishes minerals. Match temperature and dechlorinate every change.',
      },
      {
        heading: 'Stock slowly',
        body: 'Add fish gradually over weeks, not all at once. Each addition increases bioload; the bacterial colony must catch up.',
      },
    ],
  },
  {
    id: 'snake-husbandry',
    title: 'Snake Husbandry Fundamentals',
    category: 'snakes',
    readTime: '5 min',
    excerpt:
      'Snakes are low-maintenance compared to lizards, but thermal gradients, hides, and humidity still matter.',
    sections: [
      {
        heading: 'Thermal gradient',
        body: 'Provide a warm side (29-31 C) and a cool side (24-26 C) so the snake can thermoregulate by moving. A thermostat is non-negotiable.',
      },
      {
        heading: 'Two hides minimum',
        body: 'Place one hide on the warm end and one on the cool end. Snakes need security at both temperatures to avoid stress.',
      },
      {
        heading: 'Frozen-thawed prey',
        body: 'Feed pre-killed frozen-thawed rodents, never live. Live prey can bite and injure the snake. Match prey size to the snake\'s widest point.',
      },
      {
        heading: 'Humidity for shedding',
        body: 'Maintain species-appropriate humidity and provide a humid hide. Incomplete sheds signal low humidity or dehydration.',
      },
    ],
  },
  {
    id: 'gerbil-care',
    title: 'Gerbil Care Essentials',
    category: 'gerbils',
    readTime: '4 min',
    excerpt:
      'Gerbils are low-odor, diurnal, and social — but they need deep bedding to burrow and a same-sex pair to thrive.',
    sections: [
      {
        heading: 'Keep them in pairs',
        body: 'Gerbils are highly social and live in family groups in the wild. House same-sex pairs (littermates are ideal). Solitary gerbils become depressed and live shorter lives.',
      },
      {
        heading: 'Deep bedding for burrowing',
        body: 'Provide 30+ cm of compacted paper or sand-clay mix. Gerbils dig extensive tunnel systems — shallow bedding causes stress and stereotypic behavior.',
      },
      {
        heading: 'No water baths',
        body: 'Gerbils are desert animals and never need water baths. Provide a sand bath for grooming; water damages their coat and causes chilling.',
      },
      {
        heading: 'Chew for dental health',
        body: 'Gerbil teeth grow continuously. Provide safe wood chews, cardboard, and foraging mixes to wear teeth down and prevent overgrowth.',
      },
    ],
  },
  {
    id: 'axolotl-care',
    title: 'Axolotl Care: The Cool-Water Salamander',
    category: 'exotic-pets',
    readTime: '5 min',
    excerpt:
      'Axolotls are easier than fish in some ways, but temperature is the make-or-break factor for their health.',
    sections: [
      {
        heading: 'Keep it cool',
        body: 'Axolotls need 16-18 C water. Above 20 C causes heat stress, immune failure, and death. A chiller or cool room is essential in warm climates.',
      },
      {
        heading: 'Bare or fine-sand bottom',
        body: 'Axolotls swallow anything that fits their mouth. Gravel causes fatal impaction. Use bare bottom or fine sand only — no pebbles, no chunks.',
      },
      {
        heading: 'No tank mates',
        body: 'Fish nip at axolotl gills and axolotls eat small fish. Keep axolotls alone or with other axolotls of similar size only.',
      },
      {
        heading: 'Earthworms are the gold standard',
        body: 'Nightcrawlers and bloodworms provide complete nutrition. Avoid pellets as a staple. Feed 2-3x per week for adults.',
      },
    ],
  },
  {
    id: 'reptile-uvb',
    title: 'UVB & Heat for Reptiles',
    category: 'lizards',
    readTime: '6 min',
    excerpt:
      'Metabolic bone disease is preventable. Get the UVB and gradient right and most reptiles thrive.',
    sections: [
      {
        heading: 'Why UVB matters',
        body: 'UVB enables vitamin D3 synthesis, which drives calcium absorption. Without it, bones deform and the nervous system fails.',
      },
      {
        heading: 'Create a gradient',
        body: 'Reptiles thermoregulate by moving. Provide a warm basking spot (32-40 C depending on species) and a cool end (24-28 C).',
      },
      {
        heading: 'Replace bulbs annually',
        body: 'UVB output decays before the bulb dies. Replace every 10-12 months even if it still glows.',
      },
      {
        heading: 'Measure, do not estimate',
        body: 'Use a solarmeter or UV index card. Distance and mesh covers dramatically reduce effective UVB.',
      },
    ],
  },
  {
    id: 'small-mammal-housing',
    title: 'Housing Small Mammals Right',
    category: 'rabbits',
    readTime: '5 min',
    excerpt:
      'Most commercial cages are too small. Learn the floor space, bedding, and enrichment each species actually needs.',
    sections: [
      {
        heading: 'Bigger is always better',
        body: 'Rabbits need 4+ sq m; guinea pigs 0.7+ sq m per pair; hamsters 100+ cm of floor. "Minimum" is the floor, not the target.',
      },
      {
        heading: 'Deep bedding for burrowers',
        body: 'Hamsters and gerbils need 20-30 cm of paper or aspen bedding to express natural tunneling. Shallow bedding causes stress.',
      },
      {
        heading: 'Solid floors over wire',
        body: 'Wire floors cause bumblefoot and injury. Provide solid surfaces and soft bedding throughout.',
      },
      {
        heading: 'Hides on both ends',
        body: 'Prey animals need multiple escape routes. Place hides in warm and cool zones so they can rest without thermal compromise.',
      },
    ],
  },
  {
    id: 'plant-watering-guide',
    title: 'Plant Watering Fundamentals',
    category: 'all',
    readTime: '5 min',
    excerpt:
      'Overwatering kills more plants than underwatering. Learn the core principles of watering houseplants correctly.',
    sections: [
      {
        heading: 'Check before you water',
        body: 'Stick your finger 1-2 inches into the soil. If it feels dry, water thoroughly until it drains from the bottom. If it feels moist, wait. Most plants prefer to dry slightly between waterings.',
      },
      {
        heading: 'Drainage is non-negotiable',
        body: 'Every pot needs a drainage hole. Water that sits in the bottom causes root rot — the #1 killer of houseplants. Never let plants sit in a saucer of standing water.',
      },
      {
        heading: 'Water deeply, not frequently',
        body: 'A thorough soak that reaches all roots is better than frequent shallow watering. Water until it runs from the drainage hole, then empty the saucer.',
      },
      {
        heading: 'Adjust with seasons',
        body: 'Plants need less water in winter when growth slows and light decreases. Reduce watering frequency by about half during dormant months.',
      },
    ],
  },
  {
    id: 'plant-light-guide',
    title: 'Understanding Plant Light Needs',
    category: 'all',
    readTime: '4 min',
    excerpt:
      'Light is plant food. Matching your plant to the right light condition is the single most important care decision.',
    sections: [
      {
        heading: 'Low light means "survives", not "thrives"',
        body: 'Low-light plants like ZZ and snake plants tolerate dim corners but grow faster and look better with brighter indirect light. No plant truly thrives in a dark corner.',
      },
      {
        heading: 'Bright indirect is the sweet spot',
        body: 'Most houseplants prefer bright indirect light — near a window but not in direct sunbeams. An east or west window is ideal for most species.',
      },
      {
        heading: 'Direct sun burns leaves',
        body: 'Most tropical houseplants evolved as understory plants. Direct midday sun through a window scorches their leaves with brown, crispy patches.',
      },
      {
        heading: 'Watch for stretch signs',
        body: 'If stems grow long with large gaps between leaves, the plant is reaching for light (etiolation). Move it to a brighter spot.',
      },
    ],
  },
  {
    id: 'exercise-dogs',
    title: 'Exercise Needs by Dog Size',
    category: 'dogs',
    readTime: '5 min',
    excerpt:
      'A tired dog is a good dog. Understanding how much exercise your dog actually needs prevents behavior problems.',
    sections: [
      {
        heading: 'Small breeds: 30-45 min',
        body: 'Toy and small breeds (under 20 lbs) need 30-45 minutes of daily activity. Short walks, indoor play, and training sessions suffice.',
      },
      {
        heading: 'Medium breeds: 45-60 min',
        body: 'Medium dogs (20-50 lbs) need 45-60 minutes daily. Mix walks with off-leash play and mental stimulation.',
      },
      {
        heading: 'Large and active breeds: 60-90 min',
        body: 'Herding, sporting, and large working breeds need 60-90+ minutes. Without enough exercise, these dogs develop destructive and anxious behaviors.',
      },
      {
        heading: 'Mental exercise counts too',
        body: 'Snuffle mats, puzzle feeders, training sessions, and scent games tire the brain. 15 minutes of mental work equals a 30-minute walk for many dogs.',
      },
    ],
  },
  {
    id: 'grooming-basics',
    title: 'Grooming Basics for All Pets',
    category: 'all',
    readTime: '6 min',
    excerpt:
      'Grooming is not just about looks — it is a health check. Regular grooming catches problems early and strengthens your bond.',
    sections: [
      {
        heading: 'Brush regularly',
        body: 'Brushing removes dead hair, distributes natural oils, and prevents matting. Long-haired pets need daily brushing; short-haired pets benefit from weekly sessions.',
      },
      {
        heading: 'Check ears, eyes, and teeth',
        body: 'During grooming, check ears for redness or odor, eyes for discharge, and teeth for tartar. Early detection of problems saves money and suffering.',
      },
      {
        heading: 'Nail trimming',
        body: 'Overgrown nails cause pain, posture problems, and can curl into the paw pad. Trim every 2-4 weeks. If unsure, have a vet or groomer demonstrate proper technique.',
      },
      {
        heading: 'Bathe only as needed',
        body: 'Over-bathing strips natural oils and causes dry skin. Dogs need baths every 1-3 months unless they get dirty. Cats rarely need baths. Never use human shampoo — use species-specific products.',
      },
    ],
  },
  {
    id: 'general-maintenance',
    title: 'General Pet Maintenance Schedule',
    category: 'all',
    readTime: '4 min',
    excerpt:
      'A simple checklist of recurring care tasks every pet owner should keep on their calendar.',
    sections: [
      {
        heading: 'Daily',
        body: 'Fresh food and water, litter or cage spot-cleaning, observation for behavior or appetite changes, and some form of interaction or enrichment.',
      },
      {
        heading: 'Weekly',
        body: 'Full habitat cleaning, water changes for aquariums, brush long-haired pets, check nails, weigh your pet to track trends.',
      },
      {
        heading: 'Monthly',
        body: 'Bath if needed, thorough ear check, dental inspection, review diet portions, clean or replace filters and substrates.',
      },
      {
        heading: 'Annually',
        body: 'Veterinary wellness exam, vaccinations as needed, dental cleaning, parasite screening, and diet review for life-stage changes.',
      },
    ],
  },
  {
    id: 'beginner-plant-care',
    title: 'Beginner Plant Care: Start Here',
    category: 'all',
    readTime: '5 min',
    excerpt:
      'New to plants? These five rules will keep your first plants alive and build your confidence.',
    sections: [
      {
        heading: 'Start with easy plants',
        body: 'Snake plants, ZZ plants, pothos, and peace lilies tolerate neglect, low light, and infrequent watering. Build success with these before trying demanding species.',
      },
      {
        heading: 'When in doubt, do not water',
        body: 'Overwatering kills more plants than anything else. If you are unsure whether to water, wait two more days. Plants recover from thirst faster than from root rot.',
      },
      {
        heading: 'Drainage holes save lives',
        body: 'Never plant in a pot without a drainage hole. Decorative outer pots are fine — just keep the plant in a plastic nursery pot inside them.',
      },
      {
        heading: 'Observe your plants weekly',
        body: 'Take 5 minutes each week to look at your plants. Yellowing, drooping, brown tips, and pests are easier to fix when caught early.',
      },
    ],
  },
  {
    id: 'beginner-pet-care',
    title: 'Beginner Pet Care: First Steps',
    category: 'all',
    readTime: '6 min',
    excerpt:
      'Getting your first pet? Here is what every new owner needs to know before bringing an animal home.',
    sections: [
      {
        heading: 'Research before you choose',
        body: 'Every species has specific space, diet, temperature, and time requirements. Understand the full commitment — including lifespan, costs, and veterinary needs — before choosing.',
      },
      {
        heading: 'Set up before bringing home',
        body: 'Have the enclosure, food, water source, hides, and supplies ready before the pet arrives. A prepared environment reduces stress and lets you focus on bonding.',
      },
      {
        heading: 'Find a vet before you need one',
        body: 'Locate a species-appropriate veterinarian before emergencies. Not all vets treat all species — exotic pets need specialized vets. Schedule a wellness check within the first week.',
      },
      {
        heading: 'Patience over expectations',
        body: 'Every pet takes time to adjust. Do not expect immediate bonding or perfect behavior. Consistent, patient care builds trust over weeks and months, not days.',
      },
    ],
  },
];

export const PROBLEM_TOPICS: ProblemTopic[] = [
  {
    id: 'dog-barking-excess',
    title: 'Excessive Barking in Dogs',
    category: 'dogs',
    severity: 'Low',
    symptoms:
      'Barking at visitors, alone, or at noises for extended periods; difficulty redirecting.',
    guidance: [
      'Identify the trigger: alert, alarm, boredom, anxiety, or demand. Each has a different fix.',
      'Increase physical and mental exercise — a tired dog barks less.',
      'Reward calm quiet behavior; do not shout — shouting sounds like joining the bark.',
      'For separation-related barking, desensitize departures gradually and provide enrichment toys.',
      'If sudden onset, rule out pain or cognitive decline with a vet visit.',
    ],
  },
  {
    id: 'cat-litter-issues',
    title: 'Cat Avoiding the Litter Box',
    category: 'cats',
    severity: 'Medium',
    symptoms:
      'Urinating or defecating outside the box; vocalizing near box; straining.',
    guidance: [
      'Rule out a UTI or blockage with a vet — especially in male cats. This is a medical emergency if straining.',
      'Use one box per cat plus one extra, in quiet accessible locations.',
      'Scoop daily; replace litter fully every 2-4 weeks.',
      'Avoid covered boxes and scented litters — many cats reject both.',
      'Clean soiled areas with enzymatic cleaner to remove scent cues.',
    ],
  },
  {
    id: 'fish-ich',
    title: 'White Spots on Fish (Ich)',
    category: 'fish',
    severity: 'High',
    symptoms:
      'Pinhead white spots on body and fins; flashing against objects; rapid breathing.',
    guidance: [
      'Ich is parasitic and fatal if untreated. Raise temperature gradually to 28-30 C to speed the lifecycle.',
      'Treat with malachite green/formalin or copper per label directions; remove invertebrates first.',
      'Increase aeration — warmer water holds less oxygen.',
      'Treat the full lifecycle (10-14 days) even if spots disappear early.',
      'Quarantine new fish for 4 weeks to prevent recurrence.',
    ],
  },
  {
    id: 'rabbit-stasis',
    title: 'Rabbit Not Eating (GI Stasis)',
    category: 'rabbits',
    severity: 'High',
    symptoms:
      'Rabbit stops eating or producing feces; hunched posture; grinding teeth.',
    guidance: [
      'GI stasis is a veterinary emergency. Rabbits cannot go 12 hours without food.',
      'Call an exotic vet immediately — do not wait overnight.',
      'While en route, offer favorite herbs and gently syringe-feed critical care formula.',
      'Keep the rabbit warm and quiet; minimize handling.',
      'Common causes: stress, hairblock, dental pain, insufficient hay.',
    ],
  },
  {
    id: 'reptile-shed-issues',
    title: 'Incomplete Shed in Reptiles',
    category: 'lizards',
    severity: 'Medium',
    symptoms:
      'Patches of old skin stuck on toes, tail, or eyes; dull appearance.',
    guidance: [
      'Raise humidity in the enclosure with a moist hide and misting.',
      'Provide a shallow soak in lukewarm water for 15-20 minutes.',
      'Never pull stuck skin — it can tear the new layer underneath.',
      'Check toes and tail tip — retained shed can constrict and amputate.',
      'Persistent stuck shed signals low humidity or underlying dehydration.',
    ],
  },
  {
    id: 'bird-feather-plucking',
    title: 'Feather Plucking in Parrots',
    category: 'birds',
    severity: 'Medium',
    symptoms:
      'Bird removes or damages its own feathers; bare patches; chewed feathers.',
    guidance: [
      'First step: rule out medical causes with an avian vet — skin infection, parasites, pain.',
      'Increase foraging opportunities: hide food in paper, wood, and puzzles.',
      'Ensure 10-12 hours of dark, quiet sleep nightly.',
      'Reduce stressors: smoke, loud noise, sudden changes, isolation.',
      'Never punish plucking — it reinforces anxiety and the cycle.',
    ],
  },
  {
    id: 'hamster-bar-chewing',
    title: 'Hamster Chewing Cage Bars',
    category: 'hamsters',
    severity: 'Low',
    symptoms:
      'Hamster gnaws wire bars continuously, especially at night.',
    guidance: [
      'The enclosure is likely too small — upgrade to 100+ cm of floor space.',
      'Add deeper bedding (30 cm) to allow burrowing.',
      'Provide a larger solid-surface wheel (25+ cm for Syrians).',
      'Offer chew-safe wood and foraging mixes to redirect gnawing.',
      'Bar chewing can break teeth — address husbandry, not the symptom.',
    ],
  },
  {
    id: 'dog-itchy-skin',
    title: 'Dog Scratching Constantly',
    category: 'dogs',
    severity: 'Medium',
    symptoms:
      'Persistent scratching, licking paws, red skin, hair loss, ear infections.',
    guidance: [
      'Common causes: fleas, environmental allergies, food allergy, infection.',
      'Check for fleas with a flea comb; treat all household pets and environment.',
      'Wipe paws after walks to reduce pollen contact.',
      'Discuss a limited-ingredient diet trial with your vet for food allergy.',
      'Persistent itching warrants vet care — chronic inflammation damages skin barrier.',
    ],
  },
];
