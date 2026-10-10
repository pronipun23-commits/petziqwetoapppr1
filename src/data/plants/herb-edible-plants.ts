import type { Plant } from './types';

export const herbEdiblePlants: Plant[] = [
  {
    id: 'mint',
    name: 'Mint',
    scientificName: 'Mentha spicata',
    category: ['herb', 'indoor', 'outdoor', 'easy-care', 'edible'],
    environment: 'Both',
    sunlight: 'Bright',
    watering: 'Frequent',
    soil: 'Rich, moisture-retentive potting mix',
    temperature: '55-70°F (13-21°C)',
    difficulty: 'Beginner',
    tagline: 'The vigorous refreshing spreader',
    summary:
      'A fast-growing perennial herb with cool, aromatic leaves. So vigorous it is best grown in containers to contain its spread.',
    care: {
      watering:
        'Keep soil consistently moist. Mint loves water — do not let it dry out.',
      sunlight:
        'Prefers bright light but tolerates partial shade. In hot climates, afternoon shade helps.',
      soil:
        'Any rich, moisture-retentive potting mix. Mint is not fussy about soil.',
      temperature:
        'Hardy in 55-70°F. Most varieties survive winter and regrow in spring.',
      humidity:
        'Average humidity is fine. Good airflow prevents mildew.',
      fertilizing:
        'Feed monthly with a diluted balanced fertilizer during active growth.',
    },
    growth: {
      matureSize: '1-2 ft tall, spreads indefinitely if not contained',
      growthRate: 'Very fast',
      lifespan: '5+ years (perennial)',
      bloomTime: 'Summer — small purple or white flower spikes',
    },
    commonProblems: [
      { problem: 'Rust spots on leaves', cause: 'Fungal infection (mint rust)', solution: 'Remove affected leaves and improve airflow. Replace plants if severe.' },
      { problem: 'Taking over the garden', cause: 'Aggressive spreading via underground runners', solution: 'Always grow in containers or use root barriers in the ground.' },
      { problem: 'Powdery mildew', cause: 'High humidity and poor airflow', solution: 'Space plants and ensure good ventilation.' },
    ],
    goodFor: ['Container gardens', 'Beginners', 'Tea', 'Cooking'],
    tips: [
      'Always grow mint in a pot — it spreads aggressively via runners and can take over gardens.',
      'Pinch off flower buds to extend the leaf harvest.',
      'Mint root cuttings grow easily — share extras with friends.',
    ],
    image:
      'https://images.pexels.com/photos/8498924/pexels-photo-8498924.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'There are over 25 species of mint including peppermint, spearmint, chocolate mint, and apple mint.',
  },
  {
    id: 'basil',
    name: 'Basil',
    scientificName: 'Ocimum basilicum',
    category: ['herb', 'indoor', 'outdoor', 'easy-care', 'edible'],
    environment: 'Both',
    sunlight: 'Bright',
    watering: 'Frequent',
    soil: 'Rich, moisture-retentive potting mix',
    temperature: '65-85°F (18-29°C)',
    difficulty: 'Beginner',
    tagline: 'The kitchen-garden essential',
    summary:
      'A fast-growing annual herb with aromatic leaves. Perfect for windowsills and patios — snip fresh for pasta, pesto, and salads.',
    care: {
      watering:
        'Keep soil consistently moist but not waterlogged. Water when the surface feels dry — basil is thirsty.',
      sunlight:
        'Needs 6+ hours of bright light. A south-facing window or full sun outdoors is ideal.',
      soil:
        'Use rich, well-draining potting mix. Basil likes fertile soil.',
      temperature:
        'Warm-loving — 65-85°F. Basil drops leaves and slows growth below 55°F and dies at frost.',
      humidity:
        'Average humidity is fine. Good airflow prevents fungal issues.',
      fertilizing:
        'Feed every 2 weeks with a diluted liquid fertilizer during active growth.',
    },
    growth: {
      matureSize: '12-24 in tall',
      growthRate: 'Very fast — ready to harvest in 4-6 weeks',
      lifespan: 'One growing season (annual)',
      bloomTime: 'Late summer — white flower spikes (pinch off to extend harvest)',
    },
    commonProblems: [
      { problem: 'Bolting (flowering)', cause: 'Heat stress or long days', solution: 'Pinch off flower buds immediately to keep leaves productive.' },
      { problem: 'Downy mildew', cause: 'Fungal infection in humid conditions', solution: 'Improve airflow, water at the base, and space plants properly.' },
      { problem: 'Aphids', cause: 'Pest infestation on tender new growth', solution: 'Spray with water or insecticidal soap.' },
    ],
    goodFor: ['Kitchen windowsills', 'Beginners', 'Container gardens', 'Cooking'],
    tips: [
      'Pinch off flower buds as soon as they appear to keep leaves flavorful.',
      'Harvest from the top down, cutting just above a pair of leaves to encourage bushiness.',
      'Basil and tomatoes are companion plants — they grow well together.',
    ],
    image:
      'https://images.pexels.com/photos/9662049/pexels-photo-9662049.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Basil means "king" in Greek — the ancient Greeks and Romans believed only the reigning monarch should be allowed to cut it.',
  },
  {
    id: 'coriander',
    name: 'Coriander',
    scientificName: 'Coriandrum sativum',
    category: ['herb', 'indoor', 'outdoor', 'easy-care', 'edible'],
    environment: 'Both',
    sunlight: 'Bright',
    watering: 'Frequent',
    soil: 'Rich, well-draining soil',
    temperature: '50-75°F (10-24°C)',
    difficulty: 'Beginner',
    tagline: 'Fresh cilantro leaves and coriander seeds',
    summary:
      'A versatile annual herb — the fresh leaves are called cilantro, and the dried seeds are coriander. Both are used extensively in cooking worldwide.',
    care: {
      watering:
        'Keep soil consistently moist. Water when the top inch feels dry. Do not let it dry out — cilantro wilts quickly.',
      sunlight:
        'Prefers bright light but dislikes intense heat. In hot climates, grow in partial shade to slow bolting.',
      soil:
        'Use rich, well-draining soil. Add compost for best results.',
      temperature:
        'Prefers cool conditions, 50-75°F. Heat causes rapid bolting. Best in spring and fall.',
      humidity:
        'Average humidity is fine.',
      fertilizing:
        'Feed monthly with a balanced fertilizer. Over-fertilizing reduces flavor.',
    },
    growth: {
      matureSize: '12-18 in tall',
      growthRate: 'Fast — ready to harvest in 3-4 weeks',
      lifespan: 'One growing season (annual)',
      bloomTime: 'Late spring to summer — white flowers (then seeds form)',
    },
    commonProblems: [
      { problem: 'Bolting (rapid flowering)', cause: 'Heat stress or long days', solution: 'Grow in partial shade, sow in spring and fall, and choose slow-bolt varieties.' },
      { problem: 'Wilting', cause: 'Underwatering or heat stress', solution: 'Keep soil consistently moist and grow during cooler months.' },
      { problem: 'Leaf spots', cause: 'Fungal infection (bacterial leaf spot)', solution: 'Improve airflow and avoid overhead watering.' },
    ],
    goodFor: ['Kitchen gardens', 'Beginners', 'Containers', 'Cooking'],
    tips: [
      'Successive sowings every 2-3 weeks ensure a continuous supply of fresh leaves.',
      'Let some plants flower and set seed to harvest coriander spice.',
      'Cilantro prefers cool weather — grow in spring and fall, not peak summer.',
    ],
    image:
      'https://images.pexels.com/photos/10329642/pexels-photo-10329642.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Coriander is one of the oldest known herbs — seeds have been found in ancient Egyptian tombs dating back to 1000 BC.',
  },
  {
    id: 'curry-leaf',
    name: 'Curry Leaf Plant',
    scientificName: 'Murraya koenigii',
    category: ['tree', 'outdoor', 'indoor', 'herb', 'edible'],
    environment: 'Both',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Well-draining, slightly acidic soil',
    temperature: '65-85°F (18-29°C)',
    difficulty: 'Intermediate',
    tagline: 'The aromatic backbone of South Indian cooking',
    summary:
      'A small tropical tree whose aromatic leaves are essential in South Indian cuisine. The fresh leaves add a distinctive citrusy, nutty flavor to curries and dals.',
    care: {
      watering:
        'Water when the top inch of soil is dry. Do not overwater — curry leaf plants dislike soggy soil. Reduce watering in winter when growth slows.',
      sunlight:
        'Needs full sun — at least 6-8 hours of direct light. Indoor plants need a very bright window or grow lights.',
      soil:
        'Use well-draining, slightly acidic soil. A mix of potting soil, sand, and compost works well.',
      temperature:
        'Prefers 65-85°F. Sensitive to cold — protect below 50°F and bring indoors before frost.',
      humidity:
        'Prefers moderate to high humidity.',
      fertilizing:
        'Feed monthly during the growing season with a balanced fertilizer. Curry leaf plants are moderate feeders.',
    },
    growth: {
      matureSize: '6-15 ft outdoors (2-4 ft in containers)',
      growthRate: 'Moderate — slow when young',
      lifespan: '10-15 years',
      bloomTime: 'Spring — small white fragrant flowers, followed by black berries',
    },
    commonProblems: [
      { problem: 'Leaf drop', cause: 'Cold stress or overwatering', solution: 'Keep warm and reduce watering. Leaves will regrow when conditions improve.' },
      { problem: 'Chlorosis (yellowing with green veins)', cause: 'Iron deficiency or high soil pH', solution: 'Apply iron chelate and ensure slightly acidic soil.' },
      { problem: 'Psyllid insect damage', cause: 'Jumping plant lice feeding on new growth', solution: 'Prune affected growth and spray with neem oil.' },
    ],
    goodFor: ['South Indian cooking', 'Containers', 'Tropical gardens', 'Culinary gardens'],
    tips: [
      'Fresh curry leaves are far more aromatic than dried — use them immediately after picking.',
      'Do not confuse curry leaf plant with curry powder — they are entirely different things.',
      'Pinch the growing tips to encourage bushier growth and more leaf production.',
    ],
    image:
      'https://images.pexels.com/photos/36801590/pexels-photo-36801590.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Curry leaves are unrelated to curry powder — the powder is a spice blend, while curry leaves come from a specific tree in the citrus family.',
  },
  {
    id: 'lemongrass',
    name: 'Lemongrass',
    scientificName: 'Cymbopogon citratus',
    category: ['herb', 'outdoor', 'indoor', 'edible', 'tropical'],
    environment: 'Both',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Rich, well-draining soil',
    temperature: '65-85°F (18-29°C)',
    difficulty: 'Beginner',
    tagline: 'Citrus-scented grass for Asian cuisine',
    summary:
      'A tall, arching tropical grass with a powerful lemon scent. The stalks are used in Thai and Vietnamese cooking, and the leaves make a refreshing tea.',
    care: {
      watering:
        'Water when the top inch of soil is dry — about 2-3 times per week. Keep soil moist but not waterlogged.',
      sunlight:
        'Needs full sun — at least 6 hours of direct light. Grows fastest in hot, bright conditions.',
      soil:
        'Use rich, well-draining soil. Lemongrass tolerates various soil types if drainage is good.',
      temperature:
        'Prefers 65-85°F. Sensitive to frost — bring indoors or dig up and store before freezing.',
      humidity:
        'Prefers moderate to high humidity.',
      fertilizing:
        'Feed monthly during the growing season with a high-nitrogen fertilizer for lush growth.',
    },
    growth: {
      matureSize: '3-5 ft tall and wide',
      growthRate: 'Fast',
      lifespan: 'Perennial in tropical climates; grown as annual in cold regions',
      bloomTime: 'Rarely blooms in cultivation',
    },
    commonProblems: [
      { problem: 'Rust disease', cause: 'Fungal infection causing orange spots on leaves', solution: 'Improve airflow and remove affected leaves.' },
      { problem: 'Brown leaf tips', cause: 'Underwatering or dry air', solution: 'Water more consistently and mist in dry conditions.' },
      { problem: 'Slow growth', cause: 'Insufficient heat or sun', solution: 'Move to a hotter, sunnier location.' },
    ],
    goodFor: ['Asian cooking', 'Containers', 'Herb gardens', 'Tea'],
    tips: [
      'Use the lower 4-6 inches of the stalk for cooking — peel off the tough outer layers first.',
      'Lemongrass repels mosquitoes — plant near patios and outdoor seating areas.',
      'Divide clumps in spring to propagate new plants.',
    ],
    image:
      'https://images.pexels.com/photos/38004213/pexels-photo-38004213.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Lemongrass oil contains citronella, the same compound used in insect-repelling candles — making it a natural mosquito deterrent.',
  },
  {
    id: 'rosemary',
    name: 'Rosemary',
    scientificName: 'Salvia rosmarinus',
    category: ['herb', 'outdoor', 'indoor', 'easy-care', 'edible'],
    environment: 'Both',
    sunlight: 'Direct',
    watering: 'Low',
    soil: 'Well-draining, slightly alkaline soil',
    temperature: '40-80°F (4-27°C)',
    difficulty: 'Beginner',
    tagline: 'Fragrant evergreen herb for roasting',
    summary:
      'An evergreen shrub with needle-like leaves and a strong piney fragrance. A versatile culinary herb that also makes an attractive landscape plant.',
    care: {
      watering:
        'Water when the top 2 inches of soil are dry. Rosemary is drought-tolerant — overwatering is the most common killer.',
      sunlight:
        'Needs full sun — at least 6-8 hours of direct light. Indoor plants need a bright south-facing window.',
      soil:
        'Use well-draining, slightly alkaline soil. Add sand or perlite for drainage. Hates wet, heavy soil.',
      temperature:
        'Hardy in 40-80°F. Some varieties tolerate frost down to 10°F. In cold climates, grow in containers and bring indoors.',
      humidity:
        'Prefers dry to moderate humidity. High humidity and poor airflow cause fungal issues.',
      fertilizing:
        'Feed lightly in spring with a balanced fertilizer. Rosemary is a light feeder.',
    },
    growth: {
      matureSize: '2-4 ft tall and wide (up to 6 ft in ideal climates)',
      growthRate: 'Slow to moderate',
      lifespan: '15-20+ years',
      bloomTime: 'Spring — small blue or white flowers',
    },
    commonProblems: [
      { problem: 'Browning needles', cause: 'Overwatering or poor drainage', solution: 'Reduce watering and improve drainage immediately.' },
      { problem: 'Leggy growth', cause: 'Insufficient light', solution: 'Move to full sun and prune regularly to maintain shape.' },
      { problem: 'Powdery mildew indoors', cause: 'Poor airflow and high humidity', solution: 'Increase ventilation and keep indoor plants in a dry, airy spot.' },
    ],
    goodFor: ['Mediterranean gardens', 'Containers', 'Culinary use', 'Hedges'],
    tips: [
      'Rosemary pairs perfectly with roasted meats, potatoes, and bread.',
      'Prune regularly to keep a bushy shape — use the clippings in cooking.',
      'In cold climates, grow in a pot and bring indoors to a cool, bright window for winter.',
    ],
    image:
      'https://images.pexels.com/photos/31976166/pexels-photo-31976166.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Rosemary has been a symbol of remembrance for centuries — ancient Greeks wore rosemary wreaths during exams to improve memory.',
  },
  {
    id: 'thyme',
    name: 'Thyme',
    scientificName: 'Thymus vulgaris',
    category: ['herb', 'outdoor', 'indoor', 'easy-care', 'edible'],
    environment: 'Both',
    sunlight: 'Direct',
    watering: 'Low',
    soil: 'Well-draining, sandy soil',
    temperature: '50-80°F (10-27°C)',
    difficulty: 'Beginner',
    tagline: 'Tiny aromatic leaves with big flavor',
    summary:
      'A low-growing woody herb with tiny, pungent leaves. Essential in Mediterranean cooking and an attractive ground cover in the garden.',
    care: {
      watering:
        'Water when the top 2 inches of soil are dry. Thyme is drought-tolerant — prefers to dry between waterings.',
      sunlight:
        'Needs full sun — at least 6 hours of direct light. Thyme develops the best flavor in hot, sunny conditions.',
      soil:
        'Use well-draining, sandy, slightly alkaline soil. Thyme thrives in lean, poor soil — avoid rich, heavy mixes.',
      temperature:
        'Hardy in 50-80°F. Tolerates frost and survives winter in most temperate climates.',
      humidity:
        'Prefers dry air. Good airflow is essential to prevent fungal issues.',
      fertilizing:
        'Feed once in spring with a balanced fertilizer. Thyme is a very light feeder — less is more.',
    },
    growth: {
      matureSize: '6-12 in tall, spreading 12-18 in',
      growthRate: 'Slow to moderate',
      lifespan: '5-10 years',
      bloomTime: 'Early summer — small pink or lilac flowers',
    },
    commonProblems: [
      { problem: 'Rotting stems', cause: 'Overwatering or poor drainage', solution: 'Improve drainage and reduce watering. Plant in sandy, gritty soil.' },
      { problem: 'Woody, leggy center', cause: 'Lack of pruning', solution: 'Prune back by one-third after flowering to encourage fresh, tender growth.' },
      { problem: 'Fungal disease', cause: 'High humidity and poor airflow', solution: 'Space plants properly and ensure good ventilation.' },
    ],
    goodFor: ['Mediterranean cooking', 'Ground cover', 'Rock gardens', 'Containers'],
    tips: [
      'Thyme pairs well with rosemary, oregano, and basil in Mediterranean dishes.',
      'Prune after flowering to keep the plant compact and productive.',
      'Thyme flowers are edible and attract bees and butterflies.',
    ],
    image:
      'https://images.pexels.com/photos/4198143/pexels-photo-4198143.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'The ancient Egyptians used thyme in embalming, and the name comes from the Greek word "thymos," meaning courage or spirit.',
  },
  {
    id: 'oregano',
    name: 'Oregano',
    scientificName: 'Origanum vulgare',
    category: ['herb', 'outdoor', 'indoor', 'easy-care', 'edible'],
    environment: 'Both',
    sunlight: 'Direct',
    watering: 'Low',
    soil: 'Well-draining, sandy soil',
    temperature: '50-80°F (10-27°C)',
    difficulty: 'Beginner',
    tagline: 'The pungent pizza herb',
    summary:
      'A woody perennial herb with small, aromatic leaves. The signature flavor of Italian and Greek cooking — indispensable for pizza, pasta, and marinades.',
    care: {
      watering:
        'Water when the top 2 inches of soil are dry. Oregano is drought-tolerant and prefers to dry between waterings.',
      sunlight:
        'Needs full sun — at least 6 hours of direct light. Oregano develops the strongest flavor in hot, sunny conditions.',
      soil:
        'Use well-draining, sandy soil. Oregano thrives in lean, poor soil — avoid rich, heavy mixes.',
      temperature:
        'Hardy in 50-80°F. Survives winter in most temperate climates as a perennial.',
      humidity:
        'Prefers dry air. Good airflow prevents fungal issues.',
      fertilizing:
        'Feed once in spring with a balanced fertilizer. Oregano is a light feeder.',
    },
    growth: {
      matureSize: '12-24 in tall, spreading 12-18 in',
      growthRate: 'Moderate',
      lifespan: '5-10 years (perennial)',
      bloomTime: 'Mid-summer — small pink or purple flowers',
    },
    commonProblems: [
      { problem: 'Mildew and root rot', cause: 'Overwatering or poor drainage', solution: 'Plant in sandy, well-draining soil and water sparingly.' },
      { problem: 'Weak flavor', cause: 'Insufficient sun or too much fertilizer', solution: 'Grow in full sun and avoid over-fertilizing — lean soil produces stronger flavor.' },
      { problem: 'Spreading aggressively', cause: 'Self-seeding and underground runners', solution: 'Trim flowers before they set seed, or grow in containers to contain spread.' },
    ],
    goodFor: ['Italian cooking', 'Mediterranean gardens', 'Containers', 'Ground cover'],
    tips: [
      'Oregano has stronger flavor dried than fresh — dry leaves in a warm, airy spot.',
      'Pinch flower buds to extend leaf production.',
      'Greek oregano (Origanum heracleoticum) has the most pungent flavor for cooking.',
    ],
    image:
      'https://images.pexels.com/photos/11506322/pexels-photo-11506322.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Oregano means "joy of the mountain" in Greek — it grows wild on Mediterranean hillsides and was traditionally associated with happiness.',
  },
  {
    id: 'chilli',
    name: 'Chilli Pepper',
    scientificName: 'Capsicum annuum',
    category: ['edible', 'outdoor', 'indoor'],
    environment: 'Both',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Rich, well-draining soil',
    temperature: '65-85°F (18-29°C)',
    difficulty: 'Beginner',
    tagline: 'Fiery fruit for the adventurous kitchen',
    summary:
      'A compact annual producing colorful, spicy peppers ranging from mild to extremely hot. Easy to grow in containers or garden beds.',
    care: {
      watering:
        'Water when the top inch of soil is dry — about 2-3 times per week. Keep soil evenly moist. Inconsistent watering causes blossom end rot.',
      sunlight:
        'Needs full sun — at least 6-8 hours of direct light for best fruit production.',
      soil:
        'Use rich, well-draining soil with compost. Slightly acidic pH (6.0-6.8).',
      temperature:
        'Loves heat — 65-85°F. Sensitive to cold — plant after the last frost and protect below 55°F.',
      humidity:
        'Moderate humidity is fine. High humidity can cause fungal issues.',
      fertilizing:
        'Feed every 2-3 weeks with a vegetable fertilizer. Switch to lower-nitrogen once flowering begins.',
    },
    growth: {
      matureSize: '12-36 in tall depending on variety',
      growthRate: 'Fast — fruits within 70-90 days from transplant',
      lifespan: 'One growing season (annual in most climates)',
      bloomTime: 'Summer — small white flowers, followed by peppers',
    },
    commonProblems: [
      { problem: 'Blossom end rot (dark sunken patches on fruit)', cause: 'Calcium deficiency from inconsistent watering', solution: 'Water consistently and add calcium (eggshells or lime) to soil.' },
      { problem: 'No fruit set', cause: 'Temperature too high or too low during flowering', solution: 'Ensure nighttime temperatures are between 60-75°F for pollen viability.' },
      { problem: 'Aphids', cause: 'Pest infestation on new growth', solution: 'Spray with water or insecticidal soap.' },
    ],
    goodFor: ['Vegetable gardens', 'Containers', 'Spice production', 'Edible landscaping'],
    tips: [
      'The heat of chilli peppers is measured in Scoville Heat Units (SHU) — from 0 (bell pepper) to over 2 million (Carolina Reaper).',
      'Harvest peppers when they reach full size and color for the best flavor.',
      'Wear gloves when handling very hot peppers and do not touch your eyes.',
    ],
    image:
      'https://images.pexels.com/photos/36133755/pexels-photo-36133755.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'The heat of chilli peppers comes from capsaicin, a compound that evolved to deter mammals — birds, which spread the seeds, cannot feel the burn.',
  },
  {
    id: 'tomato',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    category: ['edible', 'outdoor', 'indoor'],
    environment: 'Both',
    sunlight: 'Direct',
    watering: 'Frequent',
    soil: 'Rich, well-draining soil',
    temperature: '65-85°F (18-29°C)',
    difficulty: 'Beginner',
    tagline: 'The garden favorite for fresh eating',
    summary:
      'The most popular home garden vegetable. Produces juicy, flavorful fruits in a vast range of sizes from tiny cherry tomatoes to giant beefsteaks.',
    care: {
      watering:
        'Water deeply 2-3 times per week, keeping soil consistently moist. Inconsistent watering causes cracking and blossom end rot. Water at the base, not the leaves.',
      sunlight:
        'Needs full sun — at least 6-8 hours of direct light for best fruit production.',
      soil:
        'Use rich, well-draining soil with plenty of compost. Slightly acidic pH (6.0-6.8).',
      temperature:
        'Prefers 65-85°F. Plant after the last frost. Protect from cold below 50°F.',
      humidity:
        'Moderate humidity. High humidity with poor airflow promotes fungal disease.',
      fertilizing:
        'Feed every 2 weeks with a tomato fertilizer high in phosphorus and potassium. Avoid excessive nitrogen.',
    },
    growth: {
      matureSize: '3-6 ft tall (indeterminate) or 2-3 ft (determinate)',
      growthRate: 'Fast — fruits within 60-85 days from transplant',
      lifespan: 'One growing season (annual)',
      bloomTime: 'Summer — yellow flowers followed by fruit',
    },
    commonProblems: [
      { problem: 'Blossom end rot', cause: 'Calcium deficiency from inconsistent watering', solution: 'Water consistently and add calcium to soil. Mulch to retain moisture.' },
      { problem: 'Early blight', cause: 'Fungal infection causing lower leaves to yellow and brown', solution: 'Remove affected leaves, mulch around the base, and improve airflow.' },
      { problem: 'Cracking fruit', cause: 'Inconsistent watering — dry spells followed by heavy watering', solution: 'Maintain even soil moisture and mulch to prevent fluctuations.' },
    ],
    goodFor: ['Vegetable gardens', 'Containers (cherry types)', 'Beginners', 'Fresh eating'],
    tips: [
      'Plant tomatoes deep — bury the stem up to the first leaves. Roots will grow from the buried stem.',
      'Support indeterminate varieties with stakes or cages to keep fruit off the ground.',
      'Water at the base, never the leaves, to prevent fungal diseases.',
    ],
    image:
      'https://images.pexels.com/photos/5685910/pexels-photo-5685910.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Tomatoes were once called "love apples" and believed to be poisonous in Europe — they are members of the nightshade family, which includes some toxic plants.',
  },
  {
    id: 'spinach',
    name: 'Spinach',
    scientificName: 'Spinacia oleracea',
    category: ['edible', 'outdoor', 'indoor', 'easy-care'],
    environment: 'Both',
    sunlight: 'Medium',
    watering: 'Frequent',
    soil: 'Rich, moisture-retentive soil',
    temperature: '45-70°F (7-21°C)',
    difficulty: 'Beginner',
    tagline: 'Cool-season superfood green',
    summary:
      'A fast-growing leafy green packed with iron and vitamins. Best in cool weather — harvest baby leaves in just 3-4 weeks.',
    care: {
      watering:
        'Keep soil consistently moist. Water when the surface feels dry — spinach wilts quickly and bolts if stressed.',
      sunlight:
        'Prefers full sun in cool weather, partial shade in warm weather. Too much heat causes rapid bolting.',
      soil:
        'Use rich, moisture-retentive soil with compost. Spinach loves nitrogen for lush leaf growth.',
      temperature:
        'Cool-season crop — 45-70°F. Tolerates frost down to 20°F. Bolts quickly above 75°F.',
      humidity:
        'Average humidity is fine.',
      fertilizing:
        'Feed with a high-nitrogen fertilizer every 2-3 weeks for continuous leaf production.',
    },
    growth: {
      matureSize: '6-12 in tall',
      growthRate: 'Very fast — harvest baby leaves in 3-4 weeks',
      lifespan: 'One growing season (annual)',
      bloomTime: 'Bolts to seed in warm weather — small yellow-green flowers',
    },
    commonProblems: [
      { problem: 'Bolting (flowering)', cause: 'Warm temperatures or long days', solution: 'Grow in spring and fall, provide shade, and choose slow-bolt varieties.' },
      { problem: 'Downy mildew', cause: 'Fungal infection in cool, humid conditions', solution: 'Improve airflow and choose resistant varieties.' },
      { problem: 'Leaf miners', cause: 'Insect larvae tunneling inside leaves', solution: 'Remove affected leaves and use row covers to prevent adult flies.' },
    ],
    goodFor: ['Vegetable gardens', 'Beginners', 'Containers', 'Winter growing'],
    tips: [
      'Sow seeds every 2 weeks for a continuous supply of fresh leaves.',
      'Harvest outer leaves first — the center keeps producing new growth.',
      'Spinach grows well in containers and even indoors under grow lights.',
    ],
    image:
      'https://images.pexels.com/photos/34857767/pexels-photo-34857767.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Spinach became famous in the US thanks to the cartoon character Popeye, though the original reason — its iron content — was based on a decimal-point error that overestimated iron by 10 times.',
  },
  {
    id: 'fenugreek',
    name: 'Fenugreek',
    scientificName: 'Trigonella foenum-graecum',
    category: ['herb', 'edible', 'outdoor', 'indoor', 'easy-care'],
    environment: 'Both',
    sunlight: 'Bright',
    watering: 'Moderate',
    soil: 'Rich, well-draining soil',
    temperature: '50-80°F (10-27°C)',
    difficulty: 'Beginner',
    tagline: 'Aromatic leaves and seeds for Indian cuisine',
    summary:
      'A versatile annual herb whose leaves (methi) and seeds are used extensively in Indian cooking. Seeds have a maple-like aroma and the leaves are mildly bitter.',
    care: {
      watering:
        'Keep soil consistently moist. Water when the top inch feels dry. Do not let it dry out completely.',
      sunlight:
        'Prefers bright light to full sun. Tolerates partial shade, especially in warm climates.',
      soil:
        'Use rich, well-draining soil with compost. Fenugreek is not fussy about soil type.',
      temperature:
        'Prefers 50-80°F. Tolerates light frost. Bolts in extreme heat.',
      humidity:
        'Average humidity is fine.',
      fertilizing:
        'Feed lightly with a balanced fertilizer. Fenugreek fixes nitrogen and needs little extra feeding.',
    },
    growth: {
      matureSize: '12-24 in tall',
      growthRate: 'Very fast — harvest leaves in 3-4 weeks',
      lifespan: 'One growing season (annual)',
      bloomTime: 'Summer — small white or pale yellow flowers',
    },
    commonProblems: [
      { problem: 'Powdery mildew', cause: 'Fungal infection in humid conditions', solution: 'Improve airflow and avoid overhead watering.' },
      { problem: 'Aphids', cause: 'Pest infestation on tender growth', solution: 'Spray with water or insecticidal soap.' },
      { problem: 'Root rot', cause: 'Overwatering', solution: 'Ensure good drainage and do not let soil become waterlogged.' },
    ],
    goodFor: ['Indian cooking', 'Containers', 'Beginners', 'Sprouting'],
    tips: [
      'Both leaves and seeds are edible — harvest leaves young for the best flavor.',
      'Fenugreek seeds are used in curry powders and pickles.',
      'Sow seeds every 2-3 weeks for continuous leaf supply.',
    ],
    image:
      'https://images.pexels.com/photos/92435/pexels-photo-92435.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Fenugreek seeds smell like maple syrup — they are actually used commercially to flavor artificial maple syrup.',
  },
  {
    id: 'ginger',
    name: 'Ginger',
    scientificName: 'Zingiber officinale',
    category: ['edible', 'tropical', 'outdoor', 'indoor'],
    environment: 'Both',
    sunlight: 'Medium',
    watering: 'Frequent',
    soil: 'Rich, well-draining soil',
    temperature: '70-85°F (21-29°C)',
    difficulty: 'Beginner',
    tagline: 'Spicy rhizome for cooking and wellness',
    summary:
      'A tropical plant grown for its aromatic, spicy rhizomes. Easy to grow from grocery-store ginger pieces — harvest fresh ginger in 8-10 months.',
    care: {
      watering:
        'Keep soil consistently moist but not soggy. Water when the top inch feels dry. Reduce watering when leaves yellow in fall (dormancy).',
      sunlight:
        'Prefers bright, indirect or filtered light. In hot climates, partial shade is ideal. Direct sun can scorch leaves.',
      soil:
        'Use rich, well-draining soil with compost. Ginger needs moisture retention but also good drainage — rhizomes rot in soggy soil.',
      temperature:
        'Loves warmth — 70-85°F. Sensitive to cold — bring indoors below 55°F. Goes dormant in cool weather.',
      humidity:
        'Prefers high humidity. Mist regularly or grow in a humid environment.',
      fertilizing:
        'Feed monthly during the growing season with a balanced fertilizer.',
    },
    growth: {
      matureSize: '2-4 ft tall',
      growthRate: 'Moderate — harvest rhizomes in 8-10 months',
      lifespan: 'Perennial in tropics, grown as annual in cooler climates',
      bloomTime: 'Summer — cone-like flowers with yellow and red bracts (rare in cultivation)',
    },
    commonProblems: [
      { problem: 'Rhizome rot', cause: 'Overwatering or poor drainage', solution: 'Ensure excellent drainage and do not overwater. Plant in raised beds or well-draining containers.' },
      { problem: 'Yellowing leaves', cause: 'Natural dormancy in fall or overwatering', solution: 'If in fall, reduce watering — the plant is going dormant. If in summer, check drainage.' },
      { problem: 'Slow growth', cause: 'Insufficient heat or light', solution: 'Move to a warmer, brighter location with indirect light.' },
    ],
    goodFor: ['Tropical gardens', 'Containers', 'Edible rhizomes', 'Cooking'],
    tips: [
      'Grow ginger from a fresh piece bought at the store — soak it overnight, then plant with buds facing up.',
      'Harvest baby ginger (tender, pink, mild) at 4-5 months or mature ginger at 8-10 months.',
      'Let the soil dry and leaves yellow before harvesting — this signals the rhizomes are mature.',
    ],
    image:
      'https://images.pexels.com/photos/10899474/pexels-photo-10899474.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Ginger is not a root — it is a rhizome, an underground stem. The part we eat grows horizontally beneath the soil.',
  },
  {
    id: 'turmeric',
    name: 'Turmeric',
    scientificName: 'Curcuma longa',
    category: ['edible', 'tropical', 'outdoor', 'indoor'],
    environment: 'Both',
    sunlight: 'Medium',
    watering: 'Frequent',
    soil: 'Rich, well-draining soil',
    temperature: '70-85°F (21-29°C)',
    difficulty: 'Beginner',
    tagline: 'Golden anti-inflammatory super-root',
    summary:
      'A tropical plant related to ginger, grown for its brilliant orange rhizomes. The dried, ground rhizome is the golden spice central to curry powder.',
    care: {
      watering:
        'Keep soil consistently moist but well-drained. Water when the top inch feels dry. Reduce watering when leaves die back in fall.',
      sunlight:
        'Prefers bright, indirect or filtered light. Tolerates partial shade. Direct afternoon sun can scorch leaves.',
      soil:
        'Use rich, well-draining soil. Turmeric needs moisture retention but cannot tolerate waterlogging.',
      temperature:
        'Loves warmth — 70-85°F. Needs 8-10 months of warm growing conditions. Sensitive to cold below 60°F.',
      humidity:
        'Prefers high humidity. Mist regularly or grow in a humid greenhouse environment.',
      fertilizing:
        'Feed monthly during the growing season with a balanced fertilizer.',
    },
    growth: {
      matureSize: '3-4 ft tall',
      growthRate: 'Moderate — harvest rhizomes in 8-10 months',
      lifespan: 'Perennial in tropics, grown as annual in cooler climates',
      bloomTime: 'Summer — cone-like flowers with pink and white bracts',
    },
    commonProblems: [
      { problem: 'Rhizome rot', cause: 'Overwatering or poor drainage', solution: 'Ensure excellent drainage and plant in loose, well-draining soil.' },
      { problem: 'Leaf blotch', cause: 'Fungal infection causing brown patches', solution: 'Improve airflow and remove affected leaves.' },
      { problem: 'Slow growth', cause: 'Insufficient heat', solution: 'Move to a warmer location — turmeric needs consistent warmth.' },
    ],
    goodFor: ['Tropical gardens', 'Containers', 'Anti-inflammatory use', 'Cooking'],
    tips: [
      'Grow turmeric from fresh rhizomes — plant pieces with buds 2-3 inches deep in warm soil.',
      'Turmeric stains everything it touches bright orange — wear gloves when handling.',
      'Harvest when leaves die back in fall — dig up the entire clump of rhizomes.',
    ],
    image:
      'https://images.pexels.com/photos/7988018/pexels-photo-7988018.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Turmeric has been used in Ayurvedic medicine for over 4,000 years and is one of the most powerful natural anti-inflammatory compounds known.',
  },
];
