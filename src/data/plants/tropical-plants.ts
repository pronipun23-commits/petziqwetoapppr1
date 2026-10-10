import type { Plant } from './types';

export const tropicalPlants: Plant[] = [
  {
    id: 'areca-palm',
    name: 'Areca Palm',
    scientificName: 'Dypsis lutescens',
    category: ['tropical', 'indoor', 'outdoor', 'easy-care'],
    environment: 'Both',
    sunlight: 'Bright',
    watering: 'Moderate',
    soil: 'Well-draining potting mix',
    temperature: '65-75°F (18-24°C)',
    difficulty: 'Beginner',
    tagline: 'The feathery privacy screen palm',
    summary:
      'A graceful clumping palm with soft, arching fronds. One of the best air-purifying palms for indoors and a popular tropical landscape plant.',
    care: {
      watering:
        'Water when the top 1-2 inches of soil are dry — about once a week. Do not let it sit in water or dry out completely.',
      sunlight:
        'Prefers bright, indirect light. Tolerates medium light. Direct sun can burn the fronds.',
      soil:
        'Use a well-draining potting mix with peat moss and perlite.',
      temperature:
        'Prefers 65-75°F. Sensitive to cold — keep above 55°F.',
      humidity:
        'Prefers moderate to high humidity. Mist regularly in dry indoor environments.',
      fertilizing:
        'Feed monthly during spring and summer with a balanced fertilizer.',
    },
    growth: {
      matureSize: '6-7 ft indoors, up to 20-30 ft outdoors',
      growthRate: 'Moderate — 6-12 inches per year',
      lifespan: '10+ years',
      bloomTime: 'Rarely blooms indoors; outdoors produces yellow flowers and small fruit',
    },
    commonProblems: [
      { problem: 'Brown frond tips', cause: 'Dry air, fluoride in water, or underwatering', solution: 'Increase humidity, use filtered water, and water more consistently.' },
      { problem: 'Yellowing fronds', cause: 'Overwatering or natural aging of lower fronds', solution: 'Remove old yellow fronds and ensure the pot drains freely.' },
      { problem: 'Spider mites', cause: 'Dry conditions', solution: 'Mist regularly and wipe fronds with a damp cloth.' },
    ],
    goodFor: ['Living rooms', 'Air purification', 'Privacy screens', 'Tropical landscaping'],
    tips: [
      'Areca palms are one of the best plants for removing indoor air pollutants.',
      'Do not trim frond tips — cut entire fronds at the base when they yellow.',
      'Group multiple stems for a fuller, bushier appearance.',
    ],
    image:
      'https://images.pexels.com/photos/8458248/pexels-photo-8458248.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'The areca palm is one of the most effective air-humidifying plants — a 6 ft plant can release up to 1 liter of water into the air per day.',
  },
  {
    id: 'banana-plant',
    name: 'Banana Plant',
    scientificName: 'Musa acuminata',
    category: ['tropical', 'outdoor', 'indoor', 'edible'],
    environment: 'Both',
    sunlight: 'Direct',
    watering: 'Frequent',
    soil: 'Rich, well-draining soil',
    temperature: '75-95°F (24-35°C)',
    difficulty: 'Intermediate',
    tagline: 'Dramatic tropical foliage and sweet fruit',
    summary:
      'A fast-growing tropical plant with huge, dramatic leaves. Edible varieties produce bananas in warm climates; ornamental varieties are grown for stunning foliage.',
    care: {
      watering:
        'Water frequently — banana plants are very thirsty. Keep soil consistently moist but not waterlogged. Water 2-3 times per week or daily in extreme heat.',
      sunlight:
        'Needs full sun — at least 6-8 hours of direct, hot light for fruit production. Indoor plants need the brightest location possible.',
      soil:
        'Use rich, well-draining soil with plenty of compost. Bananas are heavy feeders and need fertile, organic soil.',
      temperature:
        'Loves heat — 75-95°F. Sensitive to cold — damaged below 50°F and killed by frost. Bring indoors or protect in winter.',
      humidity:
        'Prefers high humidity (50%+). Mist regularly indoors.',
      fertilizing:
        'Feed monthly with a high-potassium fertilizer. Bananas are heavy feeders — do not skimp on fertilizer.',
    },
    growth: {
      matureSize: '6-15 ft (dwarf) to 20-30 ft (standard)',
      growthRate: 'Very fast — can grow several feet per season',
      lifespan: 'The main stem fruits once then dies; pups regrow',
      bloomTime: 'Summer — large purple-red flower bud, then fruit',
    },
    commonProblems: [
      { problem: 'Tattered, split leaves', cause: 'Wind damage', solution: 'Plant in a sheltered location protected from strong winds.' },
      { problem: 'No fruit', cause: 'Insufficient heat, sun, or nutrients', solution: 'Ensure full sun, warm temperatures, and regular high-potassium fertilizer.' },
      { problem: 'Cold damage', cause: 'Temperatures below 50°F', solution: 'Bring potted plants indoors or wrap outdoor plants in frost cloth.' },
    ],
    goodFor: ['Tropical landscapes', 'Statement indoor plants', 'Edible gardens', 'Poolside planting'],
    tips: [
      'Banana plants are technically giant herbs, not trees — the "trunk" is made of overlapping leaf bases.',
      'The main stem fruits once and then dies, but new pups (suckers) grow from the base to replace it.',
      'Choose dwarf varieties (like Dwarf Cavendish) for containers and indoor growing.',
    ],
    image:
      'https://images.pexels.com/photos/16761787/pexels-photo-16761787.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Banana plants are not trees — they are the world\u2019s largest herbaceous plants. The "trunk" is actually made of tightly overlapping leaf bases.',
  },
  {
    id: 'bird-of-paradise',
    name: 'Bird of Paradise',
    scientificName: 'Strelitzia reginae',
    category: ['tropical', 'outdoor', 'indoor', 'flowering'],
    environment: 'Both',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Rich, well-draining soil',
    temperature: '65-85°F (18-29°C)',
    difficulty: 'Intermediate',
    tagline: 'Crane-like flowers in brilliant orange and blue',
    summary:
      'A striking tropical plant with large, paddle-shaped leaves and extraordinary bird-like flowers in orange and blue. A dramatic statement plant indoors or out.',
    care: {
      watering:
        'Water when the top 2 inches of soil are dry — about once a week. Tolerates some drought but grows best with consistent moisture.',
      sunlight:
        'Needs full sun to bright indirect light — at least 4-6 hours of direct sun for flowering. Tolerates partial shade but blooms less.',
      soil:
        'Use rich, well-draining soil with compost. Bird of paradise likes organic, fertile soil.',
      temperature:
        'Prefers 65-85°F. Tolerates brief cold to 28°F but frost damages leaves and flowers.',
      humidity:
        'Prefers moderate humidity. Average household humidity is fine indoors.',
      fertilizing:
        'Feed monthly during the growing season with a balanced fertilizer.',
    },
    growth: {
      matureSize: '3-5 ft indoors, 5-6 ft outdoors',
      growthRate: 'Moderate — 1-2 ft per year',
      lifespan: '10-20+ years',
      bloomTime: 'Spring through fall — crane-like orange and blue flowers',
    },
    commonProblems: [
      { problem: 'No flowers', cause: 'Young plant (needs 4-5 years), insufficient sun, or root-bound', solution: 'Ensure full sun, be patient with young plants, and keep slightly root-bound to encourage blooming.' },
      { problem: 'Leaves splitting', cause: 'Natural adaptation to wind', solution: 'Splitting is normal — the leaves split to reduce wind resistance in their native habitat.' },
      { problem: 'Brown leaf edges', cause: 'Underwatering or low humidity', solution: 'Water more consistently and increase humidity.' },
    ],
    goodFor: ['Tropical landscapes', 'Statement indoor plants', 'Cut flowers', 'Poolside planting'],
    tips: [
      'Bird of paradise flowers look like a colorful crane\u2019s head — hence the alternate name "crane flower."',
      'Plants need to be 4-5 years old before they bloom.',
      'Keep slightly root-bound in containers to encourage flowering.',
    ],
    image:
      'https://images.pexels.com/photos/17289905/pexels-photo-17289905.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Bird of paradise is the official flower of the city of Los Angeles, where it grows abundantly in the warm climate.',
  },
  {
    id: 'croton',
    name: 'Croton',
    scientificName: 'Codiaeum variegatum',
    category: ['tropical', 'outdoor', 'indoor'],
    environment: 'Both',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Rich, well-draining soil',
    temperature: '60-85°F (15-29°C)',
    difficulty: 'Intermediate',
    tagline: 'A riot of color in every leaf',
    summary:
      'A vivid foliage plant with leaves splashed in green, yellow, orange, red, and purple. The more sun it gets, the more intense the colors become.',
    care: {
      watering:
        'Water when the top inch of soil is dry — about once a week. Keep soil consistently moist. Crotons wilt dramatically when thirsty.',
      sunlight:
        'Needs full sun to bright indirect light for best color. In low light, the colorful patterns fade to plain green.',
      soil:
        'Use rich, well-draining potting soil with compost.',
      temperature:
        'Prefers 60-85°F. Sensitive to cold — leaf drop occurs below 50°F. Protect from frost.',
      humidity:
        'Prefers high humidity. Mist regularly, especially indoors.',
      fertilizing:
        'Feed monthly during the growing season with a balanced fertilizer.',
    },
    growth: {
      matureSize: '3-8 ft outdoors, 2-4 ft indoors',
      growthRate: 'Moderate',
      lifespan: '5-10 years',
      bloomTime: 'Rarely blooms indoors; outdoors produces small star-shaped flowers',
    },
    commonProblems: [
      { problem: 'Leaf drop', cause: 'Environmental stress — cold, draft, or sudden change', solution: 'Keep in a stable, warm location away from drafts and sudden temperature changes.' },
      { problem: 'Faded colors', cause: 'Insufficient light', solution: 'Move to a brighter spot with more direct sun — colors intensify with light.' },
      { problem: 'Spider mites', cause: 'Dry indoor conditions', solution: 'Mist regularly and increase humidity.' },
    ],
    goodFor: ['Colorful foliage', 'Tropical gardens', 'Containers', 'Statement plants'],
    tips: [
      'The more direct sun a croton gets, the more vibrant its colors.',
      'Crotons hate being moved — expect some leaf drop after bringing a new plant home.',
      'All parts are toxic if ingested and the sap can irritate skin.',
    ],
    image:
      'https://images.pexels.com/photos/11457413/pexels-photo-11457413.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Croton leaves can display up to 7 different colors simultaneously on a single leaf — green, yellow, orange, red, purple, copper, and pink.',
  },
  {
    id: 'ti-plant',
    name: 'Ti Plant',
    scientificName: 'Cordyline fruticosa',
    category: ['tropical', 'outdoor', 'indoor'],
    environment: 'Both',
    sunlight: 'Bright',
    watering: 'Moderate',
    soil: 'Rich, well-draining soil',
    temperature: '65-85°F (18-29°C)',
    difficulty: 'Intermediate',
    tagline: 'Sword-shaped leaves in pink, red, and purple',
    summary:
      'A tropical plant with elongated, sword-shaped leaves in shades of pink, red, purple, and green. Culturally significant in Hawaii and the South Pacific.',
    care: {
      watering:
        'Water when the top inch of soil is dry — about once a week. Keep soil moist but not soggy. Reduce watering in winter.',
      sunlight:
        'Prefers bright, indirect light. Colored varieties need good light to maintain vibrant hues. Direct sun can scorch leaves.',
      soil:
        'Use rich, well-draining soil with compost.',
      temperature:
        'Prefers 65-85°F. Sensitive to cold — keep above 55°F. Damaged by frost.',
      humidity:
        'Needs high humidity. Mist daily indoors or use a humidifier.',
      fertilizing:
        'Feed monthly during the growing season with a balanced fertilizer.',
    },
    growth: {
      matureSize: '3-10 ft outdoors, 3-6 ft indoors',
      growthRate: 'Moderate',
      lifespan: '5-10 years',
      bloomTime: 'Summer — fragrant white or pinkish flowers in panicles',
    },
    commonProblems: [
      { problem: 'Brown leaf tips', cause: 'Low humidity or fluoride in tap water', solution: 'Increase humidity and use filtered or rain water.' },
      { problem: 'Faded leaf color', cause: 'Insufficient light', solution: 'Move to brighter indirect light to restore color.' },
      { problem: 'Leaf spot diseases', cause: 'Fungal infection in humid, wet conditions', solution: 'Improve airflow and avoid getting water on leaves.' },
    ],
    goodFor: ['Tropical gardens', 'Colorful foliage', 'Containers', 'Hawaiian landscapes'],
    tips: [
      'In Hawaiian culture, ti plants are considered sacred and bring good luck.',
      'Ti leaves are used in Hawaiian cooking to wrap food for steaming.',
      'Choose varieties with pink, red, or purple foliage for the most dramatic color.',
    ],
    image:
      'https://images.pexels.com/photos/667263/pexels-photo-667263.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'In Hawaiian culture, the ti plant is considered sacred and is planted near homes to bring good luck and ward off evil spirits.',
  },
  {
    id: 'anthurium',
    name: 'Anthurium',
    scientificName: 'Anthurium andraeanum',
    category: ['tropical', 'indoor', 'flowering'],
    environment: 'Indoor',
    sunlight: 'Medium',
    watering: 'Moderate',
    soil: 'Well-draining, chunky aroid mix',
    temperature: '65-80°F (18-27°C)',
    difficulty: 'Intermediate',
    tagline: 'Glossy red hearts that bloom year-round',
    summary:
      'A tropical plant with glossy, heart-shaped red, pink, or white spathes that last for weeks. One of the longest-blooming flowering houseplants.',
    care: {
      watering:
        'Water when the top 2 inches of soil are dry — about once a week. Do not let it sit in water. Anthuriums tolerate slight drying between waterings.',
      sunlight:
        'Prefers bright, indirect light. Tolerates medium light but blooms less. Direct sun burns the leaves.',
      soil:
        'Use a chunky, well-draining aroid mix with orchid bark, perlite, and peat moss.',
      temperature:
        'Prefers 65-80°F. Sensitive to cold — keep above 60°F.',
      humidity:
        'Needs high humidity (60%+). Mist regularly or use a humidifier.',
      fertilizing:
        'Feed monthly during the growing season with a balanced fertilizer diluted to half strength.',
    },
    growth: {
      matureSize: '12-18 in tall and wide',
      growthRate: 'Slow to moderate',
      lifespan: '5+ years',
      bloomTime: 'Year-round — each spathe lasts 6-8 weeks',
    },
    commonProblems: [
      { problem: 'Brown leaf tips', cause: 'Low humidity or fluoride in water', solution: 'Increase humidity and use filtered water.' },
      { problem: 'No flowers', cause: 'Insufficient light', solution: 'Move to brighter indirect light to encourage blooming.' },
      { problem: 'Yellowing leaves', cause: 'Overwatering', solution: 'Allow the top 2 inches of soil to dry between waterings and ensure drainage.' },
    ],
    goodFor: ['Indoor blooms', 'Tropical decor', 'Gifts', 'Humid bathrooms'],
    tips: [
      'The colorful "flowers" are actually modified leaves called spathes; the true flowers are tiny on the central spadix.',
      'Anthuriums bloom year-round with enough light and humidity.',
      'All parts are toxic to pets and children if ingested.',
    ],
    image:
      'https://images.pexels.com/photos/30396852/pexels-photo-30396852.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'The name Anthurium comes from Greek — "anthos" means flower and "oura" means tail, referring to the tail-like spadix in the center of the spathe.',
  },
  {
    id: 'alocasia',
    name: 'Alocasia',
    scientificName: 'Alocasia amazonica',
    category: ['tropical', 'indoor'],
    environment: 'Indoor',
    sunlight: 'Bright',
    watering: 'Moderate',
    soil: 'Well-draining, chunky aroid mix',
    temperature: '65-80°F (18-27°C)',
    difficulty: 'Experienced',
    tagline: 'Dramatic arrow-shaped leaves with silver veins',
    summary:
      'A breathtaking tropical plant with large, dark green arrow-shaped leaves marked with striking silver-white veins. Dramatic and demanding — a collector\u2019s plant.',
    care: {
      watering:
        'Water when the top 2 inches of soil are dry. Alocasias are sensitive to overwatering — let the soil dry slightly between waterings. Reduce watering in winter dormancy.',
      sunlight:
        'Prefers bright, indirect light. Direct sun burns leaves; too little light causes leggy growth and loss of leaf markings.',
      soil:
        'Use a chunky, well-draining aroid mix with orchid bark, perlite, and peat moss. Excellent drainage is essential.',
      temperature:
        'Prefers 65-80°F. Very sensitive to cold — keep above 60°F.',
      humidity:
        'Needs very high humidity (60%+). Use a humidifier, pebble tray, or grow in a greenhouse cabinet.',
      fertilizing:
        'Feed monthly during the growing season with a balanced fertilizer diluted to half strength. Do not feed during winter dormancy.',
    },
    growth: {
      matureSize: '2-3 ft tall and wide',
      growthRate: 'Moderate during active growth',
      lifespan: '3-5 years',
      bloomTime: 'Rarely blooms indoors; produces a typical aroid spathe and spadix',
    },
    commonProblems: [
      { problem: 'Drooping leaves', cause: 'Underwatering, overwatering, or natural movement', solution: 'Check soil moisture — water if dry, dry out if wet. Some drooping is normal as leaves reorient.' },
      { problem: 'Yellowing leaves', cause: 'Overwatering or natural aging', solution: 'Reduce watering if soil is wet. Old lower leaves yellowing is normal.' },
      { problem: 'Spider mites', cause: 'Dry conditions', solution: 'Increase humidity and wipe leaves with a damp cloth. Check regularly.' },
    ],
    goodFor: ['Experienced owners', 'Statement foliage', 'Greenhouse cabinets', 'Tropical collections'],
    tips: [
      'Alocasias may go dormant in winter, losing all leaves. Keep the tuber dry and warm — new growth returns in spring.',
      'The dramatic silver vein pattern is most striking in bright indirect light.',
      'All parts are toxic to pets and children if ingested.',
    ],
    image:
      'https://images.pexels.com/photos/18321912/pexels-photo-18321912.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Alocasia leaves can move throughout the day — they adjust their angle to capture optimal light, a behavior called photonasty.',
  },
  {
    id: 'caladium',
    name: 'Caladium',
    scientificName: 'Caladium bicolor',
    category: ['tropical', 'outdoor', 'indoor'],
    environment: 'Both',
    sunlight: 'Medium',
    watering: 'Moderate',
    soil: 'Rich, well-draining potting mix',
    temperature: '70-85°F (21-29°C)',
    difficulty: 'Intermediate',
    tagline: 'Heart-shaped leaves painted in pink and white',
    summary:
      'A tuberous tropical plant with translucent, paper-thin leaves in combinations of pink, white, red, and green. Grown for spectacular foliage that lights up shade gardens.',
    care: {
      watering:
        'Keep soil consistently moist during active growth. Water when the top inch feels dry. Reduce watering when leaves die back in fall (dormancy).',
      sunlight:
        'Prefers bright, indirect to partial shade. Some varieties tolerate more sun. Direct sun burns the delicate leaves.',
      soil:
        'Use rich, well-draining potting soil with peat moss and perlite.',
      temperature:
        'Loves warmth — 70-85°F. Sensitive to cold — will not grow below 60°F and tubers rot in cold, wet soil.',
      humidity:
        'Needs high humidity. Mist regularly or grow in a humid environment.',
      fertilizing:
        'Feed monthly during the growing season with a balanced fertilizer diluted to half strength.',
    },
    growth: {
      matureSize: '12-24 in tall',
      growthRate: 'Fast during active growth',
      lifespan: 'Tubers can be stored and replanted for many years',
      bloomTime: 'Primarily grown for foliage; rarely produces a small spathe',
    },
    commonProblems: [
      { problem: 'Tuber rot', cause: 'Cold, wet soil or overwatering', solution: 'Ensure warm, well-draining soil. Dig up tubers in fall and store dry in cold climates.' },
      { problem: 'Dormancy (leaves dying back)', cause: 'Natural winter dormancy', solution: 'Stop watering, let the tuber rest, and resume watering in spring when growth resumes.' },
      { problem: 'Faded colors', cause: 'Too much shade', solution: 'Provide brighter indirect light for more vivid colors.' },
    ],
    goodFor: ['Shade gardens', 'Containers', 'Colorful foliage', 'Indoor decor'],
    tips: [
      'Caladiums go dormant in fall — the leaves die back. Dig up tubers and store in a warm, dry place for winter.',
      'The leaves are paper-thin and translucent — backlight makes the colors glow.',
      'Plant tubers with the bumpy side (eyes) facing up.',
    ],
    image:
      'https://images.pexels.com/photos/1382393/pexels-photo-1382393.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Caladium leaves are so thin and translucent that they appear to glow when backlit — they evolved this trait to capture light in the dense shade of tropical forests.',
  },
  {
    id: 'cordyline',
    name: 'Cordyline',
    scientificName: 'Cordyline australis',
    category: ['tropical', 'outdoor', 'indoor', 'tree'],
    environment: 'Both',
    sunlight: 'Bright',
    watering: 'Moderate',
    soil: 'Well-draining soil',
    temperature: '60-85°F (15-29°C)',
    difficulty: 'Beginner',
    tagline: 'Spiky crown of colorful strap-like leaves',
    summary:
      'A palm-like plant with a single trunk topped by a fountain of long, strap-shaped leaves in green, red, pink, or purple. Adds a tropical architectural element.',
    care: {
      watering:
        'Water when the top 2 inches of soil are dry — about once a week. Tolerates short droughts but prefers consistent moisture.',
      sunlight:
        'Prefers full sun to bright indirect light. Colored varieties need more light to maintain vivid hues. Green varieties tolerate more shade.',
      soil:
        'Use well-draining soil with compost. Tolerates various soil types if drainage is good.',
      temperature:
        'Prefers 60-85°F. Some varieties tolerate frost down to 20°F. In cold climates, grow in containers and bring indoors.',
      humidity:
        'Prefers moderate to high humidity. Mist indoor plants regularly.',
      fertilizing:
        'Feed monthly during the growing season with a balanced fertilizer.',
    },
    growth: {
      matureSize: '3-10 ft outdoors, 3-6 ft indoors',
      growthRate: 'Moderate',
      lifespan: '10+ years',
      bloomTime: 'Summer — fragrant white or pinkish flowers on mature plants',
    },
    commonProblems: [
      { problem: 'Brown leaf tips', cause: 'Low humidity or fluoride in water', solution: 'Increase humidity and use filtered or rain water.' },
      { problem: 'Lower leaves dropping', cause: 'Natural aging', solution: 'Remove old leaves as they yellow and drop — this is normal.' },
      { problem: 'Faded color', cause: 'Insufficient light', solution: 'Move to brighter light for more intense foliage color.' },
    ],
    goodFor: ['Tropical landscapes', 'Architectural accent', 'Containers', 'Modern gardens'],
    tips: [
      'Cordyline develops a trunk over time as lower leaves drop, giving it a palm-like appearance.',
      'Choose red or purple-leaved varieties for maximum color impact.',
      'Cordyline is often confused with Phormium (flax) — Cordyline has a trunk; Phormium does not.',
    ],
    image:
      'https://images.pexels.com/photos/1069766/pexels-photo-1069766.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'In its native New Zealand, Cordyline australis is called "cabbage tree" — the young inner leaves and roots were eaten by Maori people.',
  },
];
