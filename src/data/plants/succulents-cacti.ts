import type { Plant } from './types';

export const succulentCactiPlants: Plant[] = [
  {
    id: 'aloe-vera',
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    category: ['succulent', 'indoor', 'outdoor', 'easy-care'],
    environment: 'Both',
    sunlight: 'Direct',
    watering: 'Minimal',
    soil: 'Cactus/succulent mix with extra perlite',
    temperature: '55-80°F (13-27°C)',
    difficulty: 'Beginner',
    tagline: 'The healing succulent',
    summary:
      'A medicinal succulent whose gel-filled leaves soothe burns and skin irritation. Striking structural form for sunny spots.',
    care: {
      watering:
        'Water deeply but infrequently — every 3 weeks in summer, monthly in winter. Let soil dry completely between waterings.',
      sunlight:
        'Needs bright direct or indirect light. A south-facing window is ideal. Insufficient light makes leaves thin and leggy.',
      soil:
        'Use a well-draining cactus mix. Adding sand or perlite prevents root rot.',
      temperature:
        'Prefers 55-80°F. Bring indoors before frost — aloe cannot tolerate freezing.',
      humidity:
        'Prefers dry air. No humidity needed — high humidity can cause fungal issues.',
      fertilizing:
        'Feed sparingly with a cactus fertilizer 2-3 times per year.',
    },
    growth: {
      matureSize: '1-2 ft tall and wide',
      growthRate: 'Slow to moderate',
      lifespan: '10-20 years',
      bloomTime: 'Mature plants produce tall yellow or orange flower spikes in spring',
    },
    commonProblems: [
      { problem: 'Soft, mushy leaves', cause: 'Overwatering', solution: 'Stop watering immediately and let the soil dry out completely. Repot in fresh dry cactus mix if needed.' },
      { problem: 'Thin, leggy leaves', cause: 'Insufficient light', solution: 'Move to a sunnier location with at least 6 hours of direct or bright indirect light.' },
      { problem: 'Brown leaf tips', cause: 'Underwatering or fluoride in water', solution: 'Water slightly more frequently and use filtered water.' },
    ],
    goodFor: ['Beginners', 'Sunny windowsills', 'Medicinal use', 'Outdoor patios'],
    tips: [
      'Harvest gel by cutting a mature outer leaf and squeezing the clear gel inside.',
      'Aloe produces "pups" (baby plants) you can separate and pot up.',
      'Soft, mushy leaves mean overwatering — stop watering immediately.',
    ],
    image:
      'https://images.pexels.com/photos/12448627/pexels-photo-12448627.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Aloe vera has been used medicinally for over 6,000 years — ancient Egyptians called it the "plant of immortality."',
  },
  {
    id: 'echeveria',
    name: 'Echeveria',
    scientificName: 'Echeveria elegans',
    category: ['succulent', 'outdoor', 'indoor'],
    environment: 'Both',
    sunlight: 'Direct',
    watering: 'Minimal',
    soil: 'Cactus/succulent mix',
    temperature: '50-80°F (10-27°C)',
    difficulty: 'Beginner',
    tagline: 'Rosette succulents in soft pastel tones',
    summary:
      'Compact rosette-shaped succulents with powdery pastel leaves. Drought-tolerant and perfect for small pots and arrangements.',
    care: {
      watering:
        'Water when soil is fully dry — every 2-3 weeks in summer, monthly in winter. Always water the soil, not the leaves.',
      sunlight:
        'Needs bright direct light or full sun for at least 4-6 hours. Insufficient light causes stretching.',
      soil:
        'Use a gritty cactus mix with plenty of perlite or pumice.',
      temperature:
        'Happy in 50-80°F. Some varieties tolerate light frost but most need protection.',
      humidity:
        'Prefers dry air. High humidity can cause rot.',
      fertilizing:
        'Feed once during spring with a diluted cactus fertilizer.',
    },
    growth: {
      matureSize: '4-8 in tall and wide',
      growthRate: 'Slow',
      lifespan: '3-5 years, propagated easily from leaves',
      bloomTime: 'Spring to summer — bell-shaped flowers on tall stalks',
    },
    commonProblems: [
      { problem: 'Stretched, leggy rosette', cause: 'Insufficient light (etiolation)', solution: 'Move to a brighter spot with direct sun. The stretched growth will not revert but new growth will be compact.' },
      { problem: 'Rotting center', cause: 'Water trapped in the rosette', solution: 'Always water the soil, not the leaves. Remove affected leaves and let the plant dry out.' },
      { problem: 'Shriveling leaves', cause: 'Underwatering', solution: 'Water thoroughly when the soil is completely dry — shriveling bottom leaves are normal during drought.' },
    ],
    goodFor: ['Sunny windowsills', 'Desk plants', 'Succulent arrangements', 'Outdoors'],
    tips: [
      'Echeveria produce beautiful bell-shaped flowers on tall stalks in spring.',
      'Avoid getting water in the rosette — it can cause rot.',
      'If the plant stretches tall with gaps between leaves, it needs more light.',
    ],
    image:
      'https://images.pexels.com/photos/36620948/pexels-photo-36620948.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Echeveria are native to Mexico and named after the 18th-century Mexican botanical artist Atanasio Echeverría y Godoy.',
  },
  {
    id: 'jade-plant',
    name: 'Jade Plant',
    scientificName: 'Crassula ovata',
    category: ['succulent', 'indoor', 'easy-care'],
    environment: 'Indoor',
    sunlight: 'Bright',
    watering: 'Low',
    soil: 'Cactus/succulent mix',
    temperature: '65-75°F (18-24°C)',
    difficulty: 'Beginner',
    tagline: 'The money tree of prosperity',
    summary:
      'A classic succulent with thick, oval, glossy leaves and a tree-like form. Believed to bring prosperity and incredibly long-lived.',
    care: {
      watering:
        'Water when the soil is completely dry — every 2-3 weeks in summer, monthly in winter. Overwatering causes root rot.',
      sunlight:
        'Needs at least 4 hours of bright indirect or direct light. Insufficient light causes leggy growth and leaf drop.',
      soil:
        'Use a well-draining cactus/succulent mix with added perlite.',
      temperature:
        'Prefers 65-75°F. Keep above 50°F — jade plants are not frost-tolerant.',
      humidity:
        'Average household humidity is fine. Prefers dry conditions.',
      fertilizing:
        'Feed 2-3 times during the growing season with a cactus fertilizer.',
    },
    growth: {
      matureSize: '3-6 ft tall over many years',
      growthRate: 'Slow — a few inches per year',
      lifespan: '50-100 years',
      bloomTime: 'Mature plants produce small pink or white flowers in winter',
    },
    commonProblems: [
      { problem: 'Wrinkled, soft leaves', cause: 'Underwatering', solution: 'Water thoroughly when soil is dry — jade leaves should be plump and firm.' },
      { problem: 'Leaf drop', cause: 'Overwatering or sudden temperature change', solution: 'Reduce watering and keep away from drafts and heating vents.' },
      { problem: 'Leggy, stretched growth', cause: 'Insufficient light', solution: 'Move to a brighter location with at least 4 hours of direct sun.' },
    ],
    goodFor: ['Beginners', 'Sunny windowsills', 'Bonsai-style growing', 'Gifts'],
    tips: [
      'Jade plants can live for decades — they are often passed down through generations.',
      'In feng shui, jade plants placed near entrances are said to invite prosperity.',
      'Prune regularly to maintain a tree-like shape and encourage branching.',
    ],
    image:
      'https://images.pexels.com/photos/36346257/pexels-photo-36346257.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Jade plants can live for over 100 years. In their native South Africa, they grow into shrubs several feet tall.',
  },
  {
    id: 'haworthia',
    name: 'Haworthia',
    scientificName: 'Haworthiopsis attenuata',
    category: ['succulent', 'indoor', 'easy-care'],
    environment: 'Indoor',
    sunlight: 'Medium',
    watering: 'Low',
    soil: 'Cactus/succulent mix',
    temperature: '65-80°F (18-27°C)',
    difficulty: 'Beginner',
    tagline: 'Tiny spiky succulent with white dots',
    summary:
      'Small, architectural succulents with pointed leaves covered in white raised tubercles. Compact and perfect for small spaces.',
    care: {
      watering:
        'Water when soil is completely dry — every 2-3 weeks in summer, monthly in winter. Less is more.',
      sunlight:
        'Prefers bright, indirect light. Tolerates lower light better than most succulents. Direct sun causes leaf burn.',
      soil:
        'Use a well-draining cactus mix with perlite or pumice.',
      temperature:
        'Comfortable in 65-80°F. Keep above 50°F.',
      humidity:
        'Prefers dry air. No humidity needed.',
      fertilizing:
        'Feed once or twice a year with a diluted cactus fertilizer.',
    },
    growth: {
      matureSize: '3-5 in tall and wide',
      growthRate: 'Very slow',
      lifespan: '5-10 years',
      bloomTime: 'Summer — thin, tall flower spike with tiny white flowers',
    },
    commonProblems: [
      { problem: 'Stretching and pale color', cause: 'Insufficient light', solution: 'Move to brighter indirect light, but avoid hot direct sun.' },
      { problem: 'Mushy, translucent leaves', cause: 'Overwatering', solution: 'Stop watering and let soil dry completely. Repot in fresh dry mix if rot has started.' },
      { problem: 'Leaf tips turning brown', cause: 'Underwatering or mineral buildup', solution: 'Water slightly more often and flush the soil occasionally with filtered water.' },
    ],
    goodFor: ['Beginners', 'Desk plants', 'Small spaces', 'Succulent arrangements'],
    tips: [
      'Haworthias tolerate lower light better than most succulents — great for offices.',
      'They produce offsets (pups) that can be separated for new plants.',
      'The white raised dots are actually translucent windows that let light into the leaf interior.',
    ],
    image:
      'https://images.pexels.com/photos/28887600/pexels-photo-28887600.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Haworthia leaves have translucent "windows" at the tips that let sunlight penetrate deep into the leaf — an adaptation for growing partially buried in soil.',
  },
  {
    id: 'barrel-cactus',
    name: 'Barrel Cactus',
    scientificName: 'Echinocactus grusonii',
    category: ['cacti', 'outdoor', 'succulent'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Minimal',
    soil: 'Gritty, sandy cactus mix',
    temperature: '50-100°F (10-38°C)',
    difficulty: 'Beginner',
    tagline: 'The golden globe of the desert',
    summary:
      'A iconic round cactus with golden spines that can live for decades. Drought-tolerant and striking in outdoor xeriscape gardens.',
    care: {
      watering:
        'Water every 3-4 weeks in summer, stop almost entirely in winter. Soil must dry completely between waterings.',
      sunlight:
        'Needs full sun — at least 6-8 hours of direct sunlight daily.',
      soil:
        'Use a very gritty, sandy cactus mix with pumice or gravel. Excellent drainage is essential.',
      temperature:
        'Hardy in 50-100°F. Tolerates light frost if kept dry. Best in hot, arid climates.',
      humidity:
        'Prefers dry air. High humidity can cause rot.',
      fertilizing:
        'Feed once in spring with a cactus fertilizer. Most barrel cacti need little to no fertilizer.',
    },
    growth: {
      matureSize: '1-3 ft tall and wide, up to 5 ft over decades',
      growthRate: 'Very slow — 1-2 inches per year',
      lifespan: '30-100 years',
      bloomTime: 'Summer — yellow or orange flowers crown the top of mature plants',
    },
    commonProblems: [
      { problem: 'Soft, mushy spots', cause: 'Overwatering and rot', solution: 'Stop watering immediately and remove affected areas. Ensure soil is gritty and drains fast.' },
      { problem: 'Elongated, stretched shape', cause: 'Insufficient light', solution: 'Move to full sun. Once stretched, the shape will not correct itself.' },
      { problem: 'Corking (brown, woody patches)', cause: 'Natural aging', solution: 'This is normal for older cacti — no action needed.' },
    ],
    goodFor: ['Outdoor gardens', 'Xeriscaping', 'Desert landscapes', 'Low water'],
    tips: [
      'Handle with thick gloves — the golden spines are sharp and difficult to remove from skin.',
      'Barrel cacti can survive months without water — when in doubt, do not water.',
      'Plant in the ground or in heavy pots to prevent toppling as they grow large.',
    ],
    image:
      'https://images.pexels.com/photos/37992861/pexels-photo-37992861.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'The golden barrel cactus is critically endangered in the wild but is one of the most cultivated cacti worldwide.',
  },
  {
    id: 'christmas-cactus',
    name: 'Christmas Cactus',
    scientificName: 'Schlumbergera bridgessii',
    category: ['cacti', 'indoor', 'flowering'],
    environment: 'Indoor',
    sunlight: 'Medium',
    watering: 'Moderate',
    soil: 'Light, well-draining mix with some peat',
    temperature: '60-70°F (15-21°C)',
    difficulty: 'Beginner',
    tagline: 'Holiday blooms in the dead of winter',
    summary:
      'Unlike desert cacti, this tropical forest cactus blooms with vibrant pink or red flowers in winter. A cherished holiday gift plant.',
    care: {
      watering:
        'Keep soil lightly moist — water when the top inch feels dry. Do not let it dry out completely or sit in water.',
      sunlight:
        'Prefers bright, indirect light. Direct sun burns the segments. Needs longer dark periods in fall to set buds.',
      soil:
        'Use a light, well-draining mix with peat moss and perlite. Not a desert cactus — needs more organic matter.',
      temperature:
        'Prefers 60-70°F. Cool nights (55-60°F) in fall help trigger blooming.',
      humidity:
        'Prefers moderate humidity. Higher than desert cacti — mist occasionally.',
      fertilizing:
        'Feed monthly from spring through summer with a balanced fertilizer. Stop in fall to encourage blooming.',
    },
    growth: {
      matureSize: '1-2 ft tall, spreading 2-3 ft',
      growthRate: 'Moderate',
      lifespan: '20-30+ years, often passed down through generations',
      bloomTime: 'November to January — pink, red, or white flowers',
    },
    commonProblems: [
      { problem: 'No flowers', cause: 'Insufficient darkness in fall or warm nights', solution: 'Provide 12-14 hours of complete darkness each night for 6-8 weeks in fall, and keep in a cool room.' },
      { problem: 'Shriveling segments', cause: 'Underwatering', solution: 'Water more consistently — this is a forest cactus, not a desert cactus, and needs regular moisture.' },
      { problem: 'Bud drop', cause: 'Temperature fluctuations, drafts, or overwatering', solution: 'Keep in a stable environment away from drafts, heating vents, and doors.' },
    ],
    goodFor: ['Beginners', 'Holiday gifts', 'Winter color', 'Hanging baskets'],
    tips: [
      'Christmas cacti need 12-14 hours of complete darkness each night for 6-8 weeks in fall to produce buds.',
      'Unlike desert cacti, they prefer more water and humidity.',
      'They can live for decades and are often passed down as family heirlooms.',
    ],
    image:
      'https://images.pexels.com/photos/30112791/pexels-photo-30112791.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Christmas cacti are not desert plants — they are epiphytes that grow on trees in the rainforests of Brazil.',
  },
  {
    id: 'prickly-pear',
    name: 'Prickly Pear',
    scientificName: 'Opuntia ficus-indica',
    category: ['cacti', 'outdoor', 'edible'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Minimal',
    soil: 'Sandy, well-draining cactus mix',
    temperature: '45-100°F (7-38°C)',
    difficulty: 'Beginner',
    tagline: 'The edible cactus with paddle pads',
    summary:
      'A distinctive cactus with flat, paddle-shaped segments and edible fruit. Cold-hardy and drought-tolerant — a practical xeriscape plant.',
    care: {
      watering:
        'Water every 3-4 weeks in summer. Established outdoor plants need no supplemental water. Stop watering in winter.',
      sunlight:
        'Needs full sun — at least 6-8 hours of direct light daily.',
      soil:
        'Plant in sandy, well-draining soil. Tolerates poor, rocky soils. Excellent drainage is essential.',
      temperature:
        'Hardy in 45-100°F. Some varieties survive temperatures down to 10°F.',
      humidity:
        'Prefers dry air. Tolerates arid and semi-arid conditions.',
      fertilizing:
        'Feed once in spring with a cactus fertilizer if grown in pots. Outdoor plants rarely need fertilizer.',
    },
    growth: {
      matureSize: '3-6 ft tall, spreading 3-8 ft',
      growthRate: 'Moderate',
      lifespan: '20+ years',
      bloomTime: 'Late spring to summer — yellow, orange, or red flowers',
    },
    commonProblems: [
      { problem: 'Black, mushy pads', cause: 'Overwatering or winter rot', solution: 'Remove affected pads and ensure the soil drains freely. Stop all winter watering.' },
      { problem: 'White cottony spots', cause: 'Cochineal scale insect', solution: 'Spray with neem oil or remove manually with a jet of water.' },
      { problem: 'Pads falling off', cause: 'Overwatering or physical damage', solution: 'Reduce watering and handle carefully — pads detach easily.' },
    ],
    goodFor: ['Outdoor gardens', 'Xeriscaping', 'Edible landscaping', 'Cold climates'],
    tips: [
      'The fruit (tuna) and young pads (nopales) are edible — harvest with tongs and remove spines before eating.',
      'Handle with thick gloves — the small, hair-like glochids are more irritating than the large spines.',
      'Prickly pear is one of the most cold-hardy cacti, surviving in zones as low as 4.',
    ],
    image:
      'https://images.pexels.com/photos/923548/pexels-photo-923548.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'The cochineal insect that lives on prickly pear cacti produces carmine dye, which has been used for centuries to color food, cosmetics, and textiles.',
  },
  {
    id: 'string-of-pearls',
    name: 'String of Pearls',
    scientificName: 'Curio rowleyanus',
    category: ['succulent', 'indoor'],
    environment: 'Indoor',
    sunlight: 'Bright',
    watering: 'Low',
    soil: 'Gritty cactus/succulent mix',
    temperature: '65-80°F (18-27°C)',
    difficulty: 'Intermediate',
    tagline: 'Cascading peas from a hanging pot',
    summary:
      'A unique trailing succulent with spherical, pea-like leaves cascading from hanging baskets. Striking and unusual but needs careful watering.',
    care: {
      watering:
        'Water when the soil is completely dry — every 2 weeks in summer, every 3-4 weeks in winter. Overwatering causes rapid rot.',
      sunlight:
        'Prefers bright, indirect light. Some direct morning sun is fine. Insufficient light causes sparse, elongated pearls.',
      soil:
        'Use a very gritty cactus mix with plenty of perlite or pumice. Excellent drainage is critical.',
      temperature:
        'Keep between 65-80°F. Protect from cold — sensitive below 50°F.',
      humidity:
        'Prefers dry air. No humidity needed.',
      fertilizing:
        'Feed once or twice during the growing season with a diluted cactus fertilizer.',
    },
    growth: {
      matureSize: 'Trails 2-3 ft long',
      growthRate: 'Moderate',
      lifespan: '3-5 years, propagated easily from cuttings',
      bloomTime: 'Summer — small white flowers with a cinnamon scent',
    },
    commonProblems: [
      { problem: 'Shriveling pearls', cause: 'Underwatering', solution: 'Water thoroughly when soil is completely dry — pearls should be plump, not wrinkled.' },
      { problem: 'Mushy, translucent pearls', cause: 'Overwatering', solution: 'Stop watering immediately and let soil dry. Remove affected strands to prevent spread.' },
      { problem: 'Bald spots on vines', cause: 'Physical damage or too little light', solution: 'Provide brighter indirect light and handle gently — pearls detach easily.' },
    ],
    goodFor: ['Hanging baskets', 'Intermediate owners', 'Unique specimens'],
    tips: [
      'String of pearls is easy to propagate — lay a cutting on soil and it will root from each node.',
      'Do not mist — water only the soil, never the pearls.',
      'Keep away from pets — toxic if ingested.',
    ],
    image:
      'https://images.pexels.com/photos/12367419/pexels-photo-12367419.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Each spherical leaf has a transparent "window" that lets light penetrate inside for photosynthesis — an adaptation to intense African sunlight.',
  },
  {
    id: 'sedum',
    name: 'Sedum',
    scientificName: 'Sedum rubrotinctum',
    category: ['succulent', 'outdoor', 'indoor', 'easy-care'],
    environment: 'Both',
    sunlight: 'Direct',
    watering: 'Minimal',
    soil: 'Gritty cactus/succulent mix',
    temperature: '50-80°F (10-27°C)',
    difficulty: 'Beginner',
    tagline: 'Color-changing jelly bean leaves',
    summary:
      'A low-growing spreading succulent with plump, jelly-bean-shaped leaves that turn red in bright sun. Great for ground cover or containers.',
    care: {
      watering:
        'Water when soil is completely dry — every 2-3 weeks in summer, monthly in winter. Very drought-tolerant.',
      sunlight:
        'Needs full sun to partial shade. Leaves turn red with bright sun; stay green in lower light.',
      soil:
        'Use a gritty cactus mix with perlite or pumice for excellent drainage.',
      temperature:
        'Hardy in 50-80°F. Tolerates light frost down to 25°F if kept dry.',
      humidity:
        'Prefers dry air. No humidity needed.',
      fertilizing:
        'Feed once in spring with a diluted cactus fertilizer.',
    },
    growth: {
      matureSize: '6-12 in tall, spreading 12-18 in',
      growthRate: 'Fast',
      lifespan: '3-5 years, spreads indefinitely through dropped leaves',
      bloomTime: 'Summer — small yellow, star-shaped flowers',
    },
    commonProblems: [
      { problem: 'Leaves dropping easily', cause: 'Overwatering or physical disturbance', solution: 'Reduce watering and avoid touching the plant — leaves detach naturally to propagate.' },
      { problem: 'Stretched, green growth', cause: 'Insufficient light', solution: 'Move to a sunnier spot. Red coloration indicates sufficient light.' },
      { problem: 'Rotting stems', cause: 'Overwatering', solution: 'Remove affected stems and let soil dry between waterings.' },
    ],
    goodFor: ['Beginners', 'Ground cover', 'Rock gardens', 'Container gardens'],
    tips: [
      'Dropped leaves root and grow into new plants — spread them on soil to propagate.',
      'The red stress coloration in bright sun is normal and desirable.',
      'Sedums are excellent for green roofs and xeriscaping.',
    ],
    image:
      'https://images.pexels.com/photos/33249973/pexels-photo-33249973.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Sedum leaves that fall from the plant can root and grow into entirely new plants — each leaf is a potential clone.',
  },
  {
    id: 'zebra-haworthia',
    name: 'Zebra Haworthia',
    scientificName: 'Haworthiopsis attenuata',
    category: ['succulent', 'indoor', 'easy-care'],
    environment: 'Indoor',
    sunlight: 'Medium',
    watering: 'Low',
    soil: 'Gritty cactus/succulent mix',
    temperature: '65-80°F (18-27°C)',
    difficulty: 'Beginner',
    tagline: 'White-striped spikes for small spaces',
    summary:
      'A compact succulent with dark green pointed leaves covered in raised white stripes. Easy to grow and perfect for desks and windowsills.',
    care: {
      watering:
        'Water when soil is completely dry — every 2-3 weeks in summer, monthly in winter.',
      sunlight:
        'Prefers bright, indirect light to partial shade. Tolerates lower light. Direct afternoon sun can burn leaves.',
      soil:
        'Use a gritty cactus mix with plenty of perlite or pumice.',
      temperature:
        'Comfortable in 65-80°F. Keep above 40°F.',
      humidity:
        'Prefers dry air. No humidity needed.',
      fertilizing:
        'Feed once or twice a year with a diluted cactus fertilizer.',
    },
    growth: {
      matureSize: '4-6 in tall and wide',
      growthRate: 'Very slow',
      lifespan: '5-10 years',
      bloomTime: 'Summer — thin flower spike with tiny white tubular flowers',
    },
    commonProblems: [
      { problem: 'Leaves turning deep red/purple', cause: 'Too much direct sun (stress coloring)', solution: 'Move to a spot with indirect or filtered light.' },
      { problem: 'Soft, mushy leaves', cause: 'Overwatering', solution: 'Stop watering and let soil dry completely. Repot in fresh gritty mix if needed.' },
      { problem: 'Stretching and pale color', cause: 'Insufficient light', solution: 'Move to brighter indirect light.' },
    ],
    goodFor: ['Beginners', 'Desk plants', 'Small spaces', 'Windowsill gardens'],
    tips: [
      'The white stripes are natural and distinctive — each plant has a unique pattern.',
      'Zebra haworthias produce pups that can be separated for new plants.',
      'They tolerate neglect well — perfect for busy people or offices.',
    ],
    image:
      'https://images.pexels.com/photos/20216923/pexels-photo-20216923.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'The white "zebra" stripes are actually raised tubercles made of hard tissue — they help the leaf survive intense light in its native South African habitat.',
  },
];
