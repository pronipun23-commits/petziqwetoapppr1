import type { Plant } from './types';

const img = (url: string) => url;

export const indoorPlants: Plant[] = [
  {
    id: 'monstera-deliciosa',
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    category: ['tropical', 'indoor'],
    environment: 'Indoor',
    sunlight: 'Bright',
    watering: 'Moderate',
    soil: 'Well-draining potting mix with peat moss',
    temperature: '65-85°F (18-29°C)',
    difficulty: 'Beginner',
    tagline: 'The Instagram-famous split-leaf beauty',
    summary:
      'One of the most recognizable houseplants, prized for its dramatic fenestrated leaves that develop splits and holes as it matures.',
    care: {
      watering:
        'Water when the top 2 inches of soil feel dry — roughly once a week in summer, every 10-14 days in winter.',
      sunlight:
        'Thrives in bright, indirect light. Direct sun can scorch leaves; too little light slows growth and reduces fenestration.',
      soil:
        'Use a well-draining aroid mix with peat moss, perlite, and orchid bark for good aeration.',
      temperature:
        'Prefers warm temperatures between 65-85°F. Avoid cold drafts below 50°F.',
      humidity:
        'Loves humidity above 50%. Mist regularly or use a pebble tray for optimal growth.',
      fertilizing:
        'Feed monthly during the growing season (spring-summer) with a balanced liquid fertilizer diluted to half strength.',
    },
    growth: {
      matureSize: 'Up to 10 ft indoors, 60 ft in the wild',
      growthRate: 'Fast — can grow 1-2 ft per year',
      lifespan: '40+ years with proper care',
      bloomTime: 'Rarely blooms indoors; outdoors produces edible fruit after 3+ years',
    },
    commonProblems: [
      { problem: 'Yellowing leaves', cause: 'Overwatering', solution: 'Let the top 2 inches of soil dry before watering again and ensure the pot drains freely.' },
      { problem: 'No fenestration (splits)', cause: 'Insufficient light', solution: 'Move to a brighter spot with indirect light; mature plants fenestrate more in brighter conditions.' },
      { problem: 'Brown crispy edges', cause: 'Low humidity or underwatering', solution: 'Increase humidity with a pebble tray or humidifier and water more consistently.' },
    ],
    goodFor: ['Beginners', 'Living rooms', 'Bright corners'],
    tips: [
      'Wipe leaves monthly with a damp cloth to keep photosynthesis efficient.',
      'Provide a moss pole for climbing — Monsteras grow larger leaves when they can climb.',
      'Yellowing leaves usually mean overwatering; let the soil dry out more between waterings.',
    ],
    image: img('https://images.pexels.com/photos/38647162/pexels-photo-38647162.jpeg?auto=compress&cs=tinysrgb&w=900'),
    funFact:
      'In the wild, Monsteras can grow up to 60 feet tall, climbing rainforest trees for sunlight.',
  },
  {
    id: 'snake-plant',
    name: 'Snake Plant',
    scientificName: 'Dracaena trifasciata',
    category: ['succulent', 'indoor', 'easy-care'],
    environment: 'Indoor',
    sunlight: 'Medium',
    watering: 'Low',
    soil: 'Sandy, well-draining cactus mix',
    temperature: '60-85°F (15-29°C)',
    difficulty: 'Beginner',
    tagline: 'The indestructible air purifier',
    summary:
      'A nearly unkillable succulent with tall, sword-like leaves. One of the best air-purifying plants for bedrooms and offices.',
    care: {
      watering:
        'Water only when soil is completely dry — every 2-3 weeks in summer, monthly in winter. Overwatering is the #1 killer.',
      sunlight:
        'Tolerates low light to bright indirect light. Will grow faster with more light but adapts to almost anywhere.',
      soil:
        'Use a fast-draining cactus/succulent mix. Adding perlite improves drainage further.',
      temperature:
        'Comfortable between 60-85°F. Sensitive to cold — keep above 50°F.',
      humidity:
        'Thrives in average household humidity. No special humidity needs.',
      fertilizing:
        'Feed 2-3 times during the growing season with a cactus fertilizer. Less is more.',
    },
    growth: {
      matureSize: '2-4 ft tall indoors',
      growthRate: 'Slow to moderate',
      lifespan: '10-25 years',
      bloomTime: 'Rarely blooms indoors',
    },
    commonProblems: [
      { problem: 'Leaves falling over', cause: 'Overwatering or too little light', solution: 'Reduce watering frequency and move to a brighter location.' },
      { problem: 'Soft, mushy leaves', cause: 'Root rot from overwatering', solution: 'Remove affected leaves, repot in fresh dry soil, and water much less frequently.' },
      { problem: 'Brown tips', cause: 'Cold damage or inconsistent watering', solution: 'Keep away from cold drafts and maintain a regular watering schedule.' },
    ],
    goodFor: ['Beginners', 'Bedrooms', 'Low-light spaces', 'Frequent travelers'],
    tips: [
      'Snake plants prefer to be root-bound, so repot only every 3-5 years.',
      'NASA studies found it removes formaldehyde and benzene from air.',
      'Leaves falling over usually indicates overwatering or too little light.',
    ],
    image: img('https://images.pexels.com/photos/8936386/pexels-photo-8936386.jpeg?auto=compress&cs=tinysrgb&w=900'),
    funFact:
      'Snake plants perform CAM photosynthesis — they release oxygen at night, making them ideal bedroom plants.',
  },
  {
    id: 'zz-plant',
    name: 'ZZ Plant',
    scientificName: 'Zamioculcas zamiifolia',
    category: ['tropical', 'indoor', 'easy-care'],
    environment: 'Indoor',
    sunlight: 'Low',
    watering: 'Minimal',
    soil: 'Well-draining potting mix',
    temperature: '60-75°F (15-24°C)',
    difficulty: 'Beginner',
    tagline: 'The drought-tolerant dark horse',
    summary:
      'A glossy-leaved plant that survives neglect, low light, and infrequent watering. Perfect for those who kill everything else.',
    care: {
      watering:
        'Water every 2-3 weeks. The thick rhizomes store water, so it prefers to dry out fully between waterings.',
      sunlight:
        'Tolerates low light to bright indirect. One of the best plants for dim corners and office spaces.',
      soil:
        'Use a well-draining potting mix with perlite. Avoid heavy mixes that stay wet.',
      temperature:
        'Happy in 60-75°F. Avoid temperatures below 45°F.',
      humidity:
        'Average household humidity is perfect. No special requirements.',
      fertilizing:
        'Feed once or twice a year — the ZZ plant is a very light feeder.',
    },
    growth: {
      matureSize: '2-3 ft tall and wide',
      growthRate: 'Slow — 2-6 inches per year',
      lifespan: '5-10 years',
      bloomTime: 'Rarely blooms indoors',
    },
    commonProblems: [
      { problem: 'Yellowing leaves', cause: 'Overwatering', solution: 'Allow soil to dry completely between waterings. The rhizomes store plenty of water.' },
      { problem: 'Drooping stems', cause: 'Excess water or root rot', solution: 'Check roots for rot, repot in fresh dry soil, and reduce watering significantly.' },
      { problem: 'Browned leaf tips', cause: 'Direct sun exposure', solution: 'Move away from direct sunlight to a spot with filtered or indirect light.' },
    ],
    goodFor: ['Beginners', 'Low-light rooms', 'Frequent travelers', 'Offices'],
    tips: [
      'ZZ plants grow slowly — be patient and do not overwater.',
      'All parts are toxic if ingested, so keep away from pets and children.',
      'Wipe the waxy leaves occasionally for a glossy shine.',
    ],
    image: img('https://images.pexels.com/photos/5173850/pexels-photo-5173850.jpeg?auto=compress&cs=tinysrgb&w=900'),
    funFact:
      'The ZZ plant stores water in potato-like rhizomes beneath the soil, letting it survive months without water.',
  },
  {
    id: 'pothos',
    name: 'Pothos',
    scientificName: 'Epipremnum aureum',
    category: ['tropical', 'indoor', 'easy-care'],
    environment: 'Indoor',
    sunlight: 'Medium',
    watering: 'Moderate',
    soil: 'Standard well-draining potting mix',
    temperature: '60-85°F (15-29°C)',
    difficulty: 'Beginner',
    tagline: 'The trailing vine that grows anywhere',
    summary:
      'A fast-growing, vining plant with heart-shaped leaves that cascades beautifully from shelves and hanging baskets.',
    care: {
      watering:
        'Water when the top inch of soil is dry — about once a week. Very forgiving if you forget occasionally.',
      sunlight:
        'Adapts from low light to bright indirect. Variegated varieties need more light to keep their patterns.',
      soil:
        'Any well-draining potting mix works. Standard houseplant soil is fine.',
      temperature:
        'Keep between 60-85°F. Avoid sudden temperature drops below 50°F.',
      humidity:
        'Average household humidity is fine; higher humidity encourages faster growth.',
      fertilizing:
        'Feed monthly with a balanced houseplant fertilizer during spring and summer.',
    },
    growth: {
      matureSize: 'Vines up to 10-30 ft long',
      growthRate: 'Fast — can grow several inches per month',
      lifespan: '5-10 years, easily propagated indefinitely',
      bloomTime: 'Rarely blooms indoors',
    },
    commonProblems: [
      { problem: 'Yellowing leaves', cause: 'Overwatering', solution: 'Let the top inch of soil dry before watering and ensure proper drainage.' },
      { problem: 'Leggy vines with large gaps', cause: 'Insufficient light', solution: 'Move to a brighter spot and prune regularly to encourage bushier growth.' },
      { problem: 'Drooping leaves', cause: 'Thirst', solution: 'Water thoroughly — the plant recovers within hours of watering.' },
    ],
    goodFor: ['Beginners', 'Hanging baskets', 'Bookshelves', 'Office desks'],
    tips: [
      'Trim vines regularly to encourage bushier growth.',
      'Pothos is easy to propagate — just place a cutting in water until roots form.',
      'Drooping leaves signal thirst — water and it recovers within hours.',
    ],
    image: img('https://images.pexels.com/photos/5825369/pexels-photo-5825369.jpeg?auto=compress&cs=tinysrgb&w=900'),
    funFact:
      'Pothos can grow vines over 30 feet long in ideal conditions — in the wild they climb trees like their cousin the Monstera.',
  },
  {
    id: 'peace-lily',
    name: 'Peace Lily',
    scientificName: 'Spathiphyllum wallisii',
    category: ['flowering', 'indoor', 'easy-care'],
    environment: 'Indoor',
    sunlight: 'Low',
    watering: 'Moderate',
    soil: 'Rich, well-draining potting mix',
    temperature: '65-80°F (18-27°C)',
    difficulty: 'Beginner',
    tagline: 'Elegant white blooms for low light',
    summary:
      'A graceful plant with dark green leaves and elegant white spathes. One of the few flowering plants that thrives in low light.',
    care: {
      watering:
        'Water when the top inch of soil is dry. The plant will dramatically droop when thirsty and recover quickly after watering.',
      sunlight:
        'Tolerates low light but blooms best in bright, indirect light. Avoid direct sun which scorches leaves.',
      soil:
        'Use a rich, well-draining potting mix with some peat moss.',
      temperature:
        'Keep between 65-80°F. Sensitive to cold — avoid temperatures below 55°F.',
      humidity:
        'Prefers high humidity. Mist regularly or use a pebble tray.',
      fertilizing:
        'Feed monthly during the growing season with a balanced fertilizer diluted to half strength.',
    },
    growth: {
      matureSize: '1-4 ft tall and wide',
      growthRate: 'Moderate',
      lifespan: '3-5 years, often longer',
      bloomTime: 'Spring through summer, occasionally year-round',
    },
    commonProblems: [
      { problem: 'Brown leaf tips', cause: 'Low humidity or fluoride in tap water', solution: 'Increase humidity and use filtered or distilled water.' },
      { problem: 'Drooping leaves', cause: 'Underwatering', solution: 'Water thoroughly — peace lilies recover quickly once watered.' },
      { problem: 'No flowers', cause: 'Insufficient light', solution: 'Move to a brighter spot with indirect light to encourage blooming.' },
    ],
    goodFor: ['Beginners', 'Low-light rooms', 'Bedrooms', 'Air purification'],
    tips: [
      'The dramatic droop when thirsty is a built-in watering indicator.',
      'Wipe leaves regularly to keep them glossy and dust-free.',
      'Peace lilies are mildly toxic to pets — keep out of reach.',
    ],
    image: img('https://images.pexels.com/photos/33964557/pexels-photo-33964557.jpeg?auto=compress&cs=tinysrgb&w=900'),
    funFact:
      'Peace lilies were studied by NASA for air purification — they remove formaldehyde, benzene, and carbon monoxide from indoor air.',
  },
  {
    id: 'spider-plant',
    name: 'Spider Plant',
    scientificName: 'Chlorophytum comosum',
    category: ['indoor', 'easy-care', 'tropical'],
    environment: 'Indoor',
    sunlight: 'Medium',
    watering: 'Moderate',
    soil: 'Well-draining potting mix',
    temperature: '65-75°F (18-24°C)',
    difficulty: 'Beginner',
    tagline: 'The playful cascading classic',
    summary:
      'A lively plant with arching striped leaves that produces baby "spiderettes" on long stems. Perfect for hanging baskets.',
    care: {
      watering:
        'Water when the top inch of soil is dry — about once a week. Tolerates occasional neglect.',
      sunlight:
        'Prefers bright, indirect light. Tolerates medium light but variegation fades in too little light.',
      soil:
        'Any well-draining potting mix. Not fussy about soil type.',
      temperature:
        'Comfortable in 65-75°F. Avoid temperatures below 45°F.',
      humidity:
        'Average household humidity is fine.',
      fertilizing:
        'Feed monthly during spring and summer with a balanced fertilizer.',
    },
    growth: {
      matureSize: '1-2 ft tall, spiderettes trail 2-3 ft',
      growthRate: 'Fast',
      lifespan: '10+ years',
      bloomTime: 'Produces small white flowers sporadically year-round',
    },
    commonProblems: [
      { problem: 'Brown leaf tips', cause: 'Fluoride or chlorine in tap water', solution: 'Use filtered or distilled water, or let tap water sit overnight before using.' },
      { problem: 'Pale, drooping leaves', cause: 'Overwatering or poor drainage', solution: 'Allow soil to dry slightly between waterings and ensure the pot drains well.' },
      { problem: 'No spiderettes', cause: 'Plant too young or insufficient light', solution: 'Provide brighter indirect light and be patient — mature plants produce babies readily.' },
    ],
    goodFor: ['Beginners', 'Hanging baskets', 'Children', 'Air purification'],
    tips: [
      'Spiderettes root easily in water or soil — share them with friends.',
      'Brown tips are harmless and can be trimmed with scissors.',
      'Spider plants are non-toxic and safe around pets and children.',
    ],
    image: img('https://images.pexels.com/photos/2308403/pexels-photo-2308403.jpeg?auto=compress&cs=tinysrgb&w=900'),
    funFact:
      'Spider plants are one of the few houseplants that are completely non-toxic to cats and dogs, making them a top choice for pet owners.',
  },
  {
    id: 'rubber-plant',
    name: 'Rubber Plant',
    scientificName: 'Ficus elastica',
    category: ['tree', 'indoor', 'tropical'],
    environment: 'Indoor',
    sunlight: 'Bright',
    watering: 'Moderate',
    soil: 'Well-draining potting mix',
    temperature: '60-80°F (15-27°C)',
    difficulty: 'Beginner',
    tagline: 'Glossy architectural statement plant',
    summary:
      'A striking tree-like plant with thick, glossy leaves. Low-maintenance and grows into an impressive indoor specimen over time.',
    care: {
      watering:
        'Water when the top few inches of soil are dry. Reduce watering in winter when growth slows.',
      sunlight:
        'Prefers bright, indirect light. Can adapt to medium light but grows slower. Avoid direct midday sun.',
      soil:
        'Use a well-draining potting mix with some perlite. Avoid heavy, water-retentive mixes.',
      temperature:
        'Comfortable in 60-80°F. Dislikes cold drafts and sudden temperature changes.',
      humidity:
        'Average household humidity is fine. Wipe leaves regularly to remove dust.',
      fertilizing:
        'Feed monthly during spring and summer with a balanced fertilizer.',
    },
    growth: {
      matureSize: '6-10 ft indoors, up to 100 ft outdoors',
      growthRate: 'Fast — 1-2 ft per year',
      lifespan: '15+ years',
      bloomTime: 'Does not bloom indoors',
    },
    commonProblems: [
      { problem: 'Dropping lower leaves', cause: 'Insufficient light or overwatering', solution: 'Move to a brighter spot and water only when the top few inches of soil are dry.' },
      { problem: 'Sticky leaves', cause: 'Pest infestation (scale or mealybugs)', solution: 'Wipe leaves with neem oil solution and inspect regularly for pests.' },
      { problem: 'Yellowing leaves', cause: 'Overwatering', solution: 'Reduce watering frequency and ensure the pot has drainage.' },
    ],
    goodFor: ['Living rooms', 'Statement pieces', 'Beginners'],
    tips: [
      'Rotate the plant monthly so all sides get even light and it grows straight.',
      'Wipe the large leaves with a damp cloth to keep them glossy and dust-free.',
      'If lower leaves drop, the plant may need more light.',
    ],
    image: img('https://images.pexels.com/photos/7190005/pexels-photo-7190005.jpeg?auto=compress&cs=tinysrgb&w=900'),
    funFact:
      'The rubber plant gets its name from the milky latex sap in its leaves, which was once studied as a source of natural rubber.',
  },
  {
    id: 'chinese-evergreen',
    name: 'Chinese Evergreen',
    scientificName: 'Aglaonema commutatum',
    category: ['tropical', 'indoor', 'easy-care'],
    environment: 'Indoor',
    sunlight: 'Low',
    watering: 'Moderate',
    soil: 'Well-draining potting mix',
    temperature: '65-80°F (18-27°C)',
    difficulty: 'Beginner',
    tagline: 'Colorful foliage for dim corners',
    summary:
      'A tough, adaptable plant with variegated leaves in shades of green, silver, pink, and red. One of the easiest houseplants to grow.',
    care: {
      watering:
        'Water when the top 2 inches of soil are dry. Tolerates occasional drought better than overwatering.',
      sunlight:
        'Tolerates low light well. Varieties with pink or red tones need brighter indirect light to maintain color.',
      soil:
        'Use a well-draining potting mix. Standard houseplant soil works fine.',
      temperature:
        'Prefers warm conditions, 65-80°F. Very sensitive to cold — keep above 60°F.',
      humidity:
        'Average household humidity is fine. Higher humidity promotes larger leaves.',
      fertilizing:
        'Feed 2-3 times per year with a balanced houseplant fertilizer.',
    },
    growth: {
      matureSize: '1-3 ft tall and wide',
      growthRate: 'Slow to moderate',
      lifespan: '5-10 years',
      bloomTime: 'Occasionally produces small spathes indoors',
    },
    commonProblems: [
      { problem: 'Yellowing leaves', cause: 'Overwatering', solution: 'Allow soil to dry more between waterings and ensure drainage.' },
      { problem: 'Faded leaf color', cause: 'Insufficient light', solution: 'Move to a brighter spot with indirect light to enhance variegation.' },
      { problem: 'Brown leaf tips', cause: 'Dry air or fluoride in water', solution: 'Increase humidity and use filtered water.' },
    ],
    goodFor: ['Beginners', 'Low-light rooms', 'Offices', 'Colorful foliage'],
    tips: [
      'Chinese evergreens are among the most tolerant houseplants for low light.',
      'Mist occasionally to increase humidity and keep leaves clean.',
      'All parts are toxic to pets and children if ingested.',
    ],
    image: img('https://images.pexels.com/photos/7718150/pexels-photo-7718150.jpeg?auto=compress&cs=tinysrgb&w=900'),
    funFact:
      'In Asia, Chinese evergreens are considered lucky plants and are often given as housewarming gifts to bring good fortune.',
  },
  {
    id: 'lucky-bamboo',
    name: 'Lucky Bamboo',
    scientificName: 'Dracaena sanderiana',
    category: ['indoor', 'easy-care'],
    environment: 'Indoor',
    sunlight: 'Low',
    watering: 'Frequent',
    soil: 'Can grow in water or well-draining soil',
    temperature: '65-90°F (18-32°C)',
    difficulty: 'Beginner',
    tagline: 'Symbolic, water-loving, and easy',
    summary:
      'Not actually bamboo — a type of Dracaena that grows happily in water or soil. Popular in feng shui for bringing luck and prosperity.',
    care: {
      watering:
        'If growing in water, change the water every 1-2 weeks. If in soil, keep consistently moist but not soggy.',
      sunlight:
        'Prefers bright, indirect light. Avoid direct sun which causes yellowing. Tolerates low light.',
      soil:
        'Can grow in water alone with pebbles for support, or in well-draining potting soil.',
      temperature:
        'Prefers warm temperatures, 65-90°F. Keep away from cold drafts.',
      humidity:
        'Average household humidity is fine.',
      fertilizing:
        'If in water, add a diluted liquid fertilizer every 2 months. If in soil, feed monthly during the growing season.',
    },
    growth: {
      matureSize: '1-3 ft tall',
      growthRate: 'Slow',
      lifespan: '1-2 years in water, 5+ years in soil',
      bloomTime: 'Does not bloom indoors',
    },
    commonProblems: [
      { problem: 'Yellowing stalks', cause: 'Direct sunlight or chlorine in water', solution: 'Move to indirect light and use filtered or distilled water.' },
      { problem: 'Rotting stalks', cause: 'Dirty water or bacterial growth', solution: 'Change water weekly and clean the container. Remove any slimy roots.' },
      { problem: 'Brown tips', cause: 'Fluoride in tap water or dry air', solution: 'Use filtered water and increase humidity.' },
    ],
    goodFor: ['Beginners', 'Desk plants', 'Feng shui', 'Water gardens'],
    tips: [
      'Use filtered or distilled water — lucky bamboo is sensitive to chlorine and fluoride.',
      'Twisting stalks toward light creates decorative spiral shapes over time.',
      'In feng shui, different stalk numbers represent different blessings.',
    ],
    image: img('https://images.pexels.com/photos/13677856/pexels-photo-13677856.jpeg?auto=compress&cs=tinysrgb&w=900'),
    funFact:
      'Lucky bamboo is not bamboo at all — it belongs to the asparagus family and is actually a type of Dracaena.',
  },
  {
    id: 'prayer-plant',
    name: 'Prayer Plant',
    scientificName: 'Maranta leuconeura',
    category: ['tropical', 'indoor'],
    environment: 'Indoor',
    sunlight: 'Medium',
    watering: 'Moderate',
    soil: 'Rich, well-draining potting mix',
    temperature: '65-80°F (18-27°C)',
    difficulty: 'Intermediate',
    tagline: 'Leaves that fold up at night',
    summary:
      'A captivating plant with patterned leaves that fold upward like praying hands at night. Striking foliage with red veins and green spots.',
    care: {
      watering:
        'Keep soil lightly moist but not soggy. Water when the top inch feels dry — avoid letting it dry out completely.',
      sunlight:
        'Prefers bright, indirect light. Direct sun fades the leaf patterns; too little light slows growth.',
      soil:
        'Use a rich, well-draining mix with peat moss and perlite for moisture retention and aeration.',
      temperature:
        'Thrives in 65-80°F. Very sensitive to cold — keep above 60°F.',
      humidity:
        'Needs high humidity (50%+). Use a humidifier, pebble tray, or group with other plants.',
      fertilizing:
        'Feed monthly during the growing season with a diluted balanced fertilizer.',
    },
    growth: {
      matureSize: '6-12 in tall, spreads 12-18 in',
      growthRate: 'Slow to moderate',
      lifespan: '3-5 years, propagated easily',
      bloomTime: 'Rarely blooms indoors; small purple-white flowers',
    },
    commonProblems: [
      { problem: 'Crispy brown leaf edges', cause: 'Low humidity', solution: 'Increase humidity with a humidifier or pebble tray and mist regularly.' },
      { problem: 'Leaves not folding at night', cause: 'Insufficient light or dehydration', solution: 'Provide brighter indirect light and keep soil consistently moist.' },
      { problem: 'Yellowing leaves', cause: 'Overwatering or poor drainage', solution: 'Allow the top inch of soil to dry slightly and ensure the pot drains well.' },
    ],
    goodFor: ['Intermediate owners', 'Terrariums', 'Bathrooms', 'Colorful foliage'],
    tips: [
      'The leaves fold upward at night in a behavior called nyctinasty — hence the name "prayer plant."',
      'Use rain or filtered water to prevent brown leaf tips from tap water chemicals.',
      'Pinch stem tips to encourage a fuller, bushier plant.',
    ],
    image: img('https://images.pexels.com/photos/20233792/pexels-photo-20233792.jpeg?auto=compress&cs=tinysrgb&w=900'),
    funFact:
      'Prayer plants move their leaves in a daily rhythm controlled by an internal clock — they fold up at night and spread flat during the day.',
  },
  {
    id: 'calathea',
    name: 'Calathea',
    scientificName: 'Calathea orbifolia',
    category: ['tropical', 'indoor'],
    environment: 'Indoor',
    sunlight: 'Medium',
    watering: 'Moderate',
    soil: 'Rich, well-draining potting mix',
    temperature: '65-80°F (18-27°C)',
    difficulty: 'Experienced',
    tagline: 'Stunning patterned foliage diva',
    summary:
      'A breathtaking plant with large, round leaves featuring silver and green stripes. Beautiful but demanding — requires consistent care.',
    care: {
      watering:
        'Keep soil consistently moist but never soggy. Water when the top inch feels dry. Use filtered or distilled water.',
      sunlight:
        'Prefers bright, indirect light. Direct sun fades patterns and burns leaves; too little light reduces leaf size.',
      soil:
        'Use a rich, well-draining mix with peat moss and perlite. Needs both moisture retention and aeration.',
      temperature:
        'Keep between 65-80°F. Extremely sensitive to cold and temperature fluctuations.',
      humidity:
        'Requires high humidity (60%+). Use a humidifier, pebble tray, or grow in a terrarium.',
      fertilizing:
        'Feed monthly during spring and summer with a balanced fertilizer diluted to half strength.',
    },
    growth: {
      matureSize: '1-2 ft tall, leaves up to 12 in wide',
      growthRate: 'Slow',
      lifespan: '3-5 years',
      bloomTime: 'Rarely blooms indoors',
    },
    commonProblems: [
      { problem: 'Crispy brown edges', cause: 'Low humidity or tap water minerals', solution: 'Increase humidity to 60%+ and use filtered or distilled water exclusively.' },
      { problem: 'Curling leaves', cause: 'Underwatering or low humidity', solution: 'Water more consistently and raise humidity levels immediately.' },
      { problem: 'Faded leaf patterns', cause: 'Too much direct light', solution: 'Move to a spot with only indirect or filtered light.' },
    ],
    goodFor: ['Experienced owners', 'Humid spaces', 'Terrariums', 'Statement foliage'],
    tips: [
      'Calatheas are sensitive to tap water chemicals — use filtered or distilled water.',
      'Group with other humidity-loving plants to create a microclimate.',
      'Like prayer plants, Calatheas move their leaves up at night.',
    ],
    image: img('https://images.pexels.com/photos/9935755/pexels-photo-9935755.jpeg?auto=compress&cs=tinysrgb&w=900'),
    funFact:
      'Calatheas are sometimes called "living plants" because their leaves move throughout the day in response to light changes.',
  },
  {
    id: 'philodendron',
    name: 'Philodendron',
    scientificName: 'Philodendron hederaceum',
    category: ['tropical', 'indoor', 'easy-care'],
    environment: 'Indoor',
    sunlight: 'Medium',
    watering: 'Moderate',
    soil: 'Well-draining potting mix',
    temperature: '65-80°F (18-27°C)',
    difficulty: 'Beginner',
    tagline: 'The heart-leafed classic climber',
    summary:
      'A vining plant with glossy heart-shaped leaves that trails or climbs. One of the easiest and most rewarding tropical houseplants.',
    care: {
      watering:
        'Water when the top inch of soil is dry — about once a week. Tolerates occasional neglect.',
      sunlight:
        'Prefers bright, indirect light. Tolerates medium light but grows slower. Avoid direct sun.',
      soil:
        'Use a well-draining potting mix with peat moss and perlite.',
      temperature:
        'Keep between 65-80°F. Avoid cold drafts below 55°F.',
      humidity:
        'Average household humidity is fine; higher humidity promotes larger leaves.',
      fertilizing:
        'Feed monthly during spring and summer with a balanced fertilizer.',
    },
    growth: {
      matureSize: 'Vines 3-10 ft long indoors',
      growthRate: 'Fast',
      lifespan: '10+ years, propagated indefinitely',
      bloomTime: 'Rarely blooms indoors',
    },
    commonProblems: [
      { problem: 'Yellowing leaves', cause: 'Overwatering', solution: 'Allow the top inch of soil to dry before watering and ensure drainage.' },
      { problem: 'Small, pale leaves', cause: 'Insufficient light or nutrients', solution: 'Move to brighter indirect light and fertilize monthly during growing season.' },
      { problem: 'Drooping leaves', cause: 'Thirst or heat stress', solution: 'Water thoroughly and move away from heat sources or direct sun.' },
    ],
    goodFor: ['Beginners', 'Hanging baskets', 'Shelves', 'Climbing poles'],
    tips: [
      'Philodendrons root easily in water — propagate cuttings to share or expand your collection.',
      'Provide a moss pole for climbing varieties to develop larger leaves.',
      'All parts are toxic to pets and children if ingested.',
    ],
    image: img('https://images.pexels.com/photos/5607881/pexels-photo-5607881.jpeg?auto=compress&cs=tinysrgb&w=900'),
    funFact:
      'The name Philodendron comes from Greek — "philo" means love and "dendron" means tree, reflecting how these plants climb trees in the wild.',
  },
  {
    id: 'fiddle-leaf-fig',
    name: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    category: ['tree', 'indoor', 'tropical'],
    environment: 'Indoor',
    sunlight: 'Bright',
    watering: 'Moderate',
    soil: 'Well-draining indoor potting mix',
    temperature: '60-75°F (15-24°C)',
    difficulty: 'Experienced',
    tagline: 'The dramatic designer favorite',
    summary:
      'A tall, sculptural plant with large violin-shaped leaves. Stunning but finicky — the quintessential statement plant for design lovers.',
    care: {
      watering:
        'Water when the top inch of soil is dry — about once a week. Consistency is key; erratic watering causes leaf drop.',
      sunlight:
        'Needs bright, filtered light. Place near an east or south-facing window. Rotate weekly for even growth.',
      soil:
        'Use a well-draining indoor potting mix. Ensure the pot has a drainage hole.',
      temperature:
        'Keep between 60-75°F. Hates drafts, AC vents, and sudden temperature changes.',
      humidity:
        'Prefers 40-50% humidity. Mist leaves or use a humidifier in dry homes.',
      fertilizing:
        'Feed monthly during the growing season with a balanced fertilizer.',
    },
    growth: {
      matureSize: '6-10 ft indoors, up to 50 ft outdoors',
      growthRate: 'Moderate — 1-2 ft per year',
      lifespan: '10-15 years indoors',
      bloomTime: 'Does not bloom indoors',
    },
    commonProblems: [
      { problem: 'Sudden leaf drop', cause: 'Environmental stress (moved, draft, or watering change)', solution: 'Find a permanent spot and maintain consistent watering. Do not move the plant.' },
      { problem: 'Brown spots on leaves', cause: 'Fungal infection from overwatering or poor airflow', solution: 'Remove affected leaves, reduce watering, and improve air circulation.' },
      { problem: 'Leaning or uneven growth', cause: 'Not rotating the plant', solution: 'Rotate a quarter turn each week so all sides receive equal light.' },
    ],
    goodFor: ['Experienced owners', 'Statement corners', 'Bright living rooms'],
    tips: [
      'Fiddle leaf figs hate being moved — pick a spot and leave it there.',
      'Dusty leaves block light — wipe them gently with a damp cloth every 2 weeks.',
      'If leaves drop after moving, give it time and consistent care to recover.',
    ],
    image: img('https://images.pexels.com/photos/22610783/pexels-photo-22610783.jpeg?auto=compress&cs=tinysrgb&w=900'),
    funFact:
      'Fiddle leaf figs became wildly popular after appearing in architecture and design magazines in the 2010s.',
  },
  {
    id: 'boston-fern',
    name: 'Boston Fern',
    scientificName: 'Nephrolepis exaltata',
    category: ['fern', 'indoor', 'outdoor'],
    environment: 'Both',
    sunlight: 'Medium',
    watering: 'Frequent',
    soil: 'Rich, moisture-retentive potting mix',
    temperature: '65-75°F (18-24°C)',
    difficulty: 'Intermediate',
    tagline: 'Lush feathery fronds for humid spaces',
    summary:
      'A classic fern with arching, feathery fronds that thrive in humid environments like bathrooms and shaded patios.',
    care: {
      watering:
        'Keep soil consistently moist but not soggy. Water when the surface feels dry — do not let it dry out completely.',
      sunlight:
        'Prefers bright, indirect light or filtered shade. Direct sun scorches the fronds; too little light causes sparse growth.',
      soil:
        'Use a rich, peat-based potting mix that holds moisture but still drains. Adding compost helps.',
      temperature:
        'Thrives in 65-75°F. Sensitive to cold — avoid temperatures below 55°F.',
      humidity:
        'Needs high humidity (50%+). Place in bathrooms, use a humidifier, or set on a pebble tray with water.',
      fertilizing:
        'Feed monthly with a diluted balanced fertilizer during the growing season.',
    },
    growth: {
      matureSize: '2-3 ft tall and wide',
      growthRate: 'Moderate',
      lifespan: '5+ years',
      bloomTime: 'Ferns do not flower — reproduce via spores on frond undersides',
    },
    commonProblems: [
      { problem: 'Crispy, brown fronds', cause: 'Low humidity or underwatering', solution: 'Increase humidity immediately and keep soil consistently moist.' },
      { problem: 'Frond yellowing', cause: 'Overwatering or poor drainage', solution: 'Ensure the pot drains well and reduce watering slightly.' },
      { problem: 'Shedding leaves', cause: 'Dry air or temperature stress', solution: 'Move to a more humid location and away from heating vents.' },
    ],
    goodFor: ['Bathrooms', 'Hanging baskets', 'Shaded porches'],
    tips: [
      'Mist daily if your home is dry — Boston ferns love humidity.',
      'Trim dead fronds at the base to keep the plant looking fresh.',
      'If fronds turn crispy and brown, humidity is too low.',
    ],
    image: img('https://images.pexels.com/photos/3854761/pexels-photo-3854761.jpeg?auto=compress&cs=tinysrgb&w=900'),
    funFact:
      'Boston ferns were a Victorian-era status symbol — elaborate fern collections were called "pteridomania" or fern fever.',
  },
  {
    id: 'dieffenbachia',
    name: 'Dieffenbachia',
    scientificName: 'Dieffenbachia seguine',
    category: ['tropical', 'indoor'],
    environment: 'Indoor',
    sunlight: 'Medium',
    watering: 'Moderate',
    soil: 'Well-draining potting mix',
    temperature: '60-80°F (15-27°C)',
    difficulty: 'Beginner',
    tagline: 'Bold variegated foliage statement',
    summary:
      'A striking plant with large leaves patterned in green, cream, and white. Fast-growing and dramatic, but handle with care — sap is toxic.',
    care: {
      watering:
        'Water when the top inch of soil is dry — about once a week. Tolerates occasional drying.',
      sunlight:
        'Prefers bright, indirect light. Tolerates medium light. Direct sun burns the leaves.',
      soil:
        'Use a rich, well-draining potting mix with peat moss.',
      temperature:
        'Keep between 60-80°F. Sensitive to cold — avoid temperatures below 55°F.',
      humidity:
        'Average to high humidity. Mist regularly for best leaf quality.',
      fertilizing:
        'Feed monthly during the growing season with a balanced fertilizer.',
    },
    growth: {
      matureSize: '3-5 ft tall indoors',
      growthRate: 'Fast',
      lifespan: '3-5 years',
      bloomTime: 'Rarely blooms indoors',
    },
    commonProblems: [
      { problem: 'Drooping leaves', cause: 'Underwatering', solution: 'Water thoroughly and maintain a consistent schedule.' },
      { problem: 'Yellowing lower leaves', cause: 'Natural aging or overwatering', solution: 'Remove old yellow leaves. If many yellow at once, reduce watering.' },
      { problem: 'Brown leaf edges', cause: 'Low humidity or fluoride in water', solution: 'Increase humidity and use filtered water.' },
    ],
    goodFor: ['Beginners', 'Living rooms', 'Statement foliage'],
    tips: [
      'Always wash hands after handling — the sap can cause skin irritation and is toxic if ingested.',
      'Keep away from children and pets — the common name "dumb cane" refers to the sap temporarily numbing the mouth.',
      'Pinch the growing tip to encourage bushier growth.',
    ],
    image: img('https://images.pexels.com/photos/18321685/pexels-photo-18321685.jpeg?auto=compress&cs=tinysrgb&w=900'),
    funFact:
      'Dieffenbachia is nicknamed "dumb cane" because chewing the stem can temporarily paralyze the vocal cords due to calcium oxalate crystals.',
  },
  {
    id: 'dracaena',
    name: 'Dracaena Marginata',
    scientificName: 'Dracaena marginata',
    category: ['tree', 'indoor', 'easy-care'],
    environment: 'Indoor',
    sunlight: 'Medium',
    watering: 'Low',
    soil: 'Well-draining potting mix',
    temperature: '65-80°F (18-27°C)',
    difficulty: 'Beginner',
    tagline: 'The dragon tree with spiky crown',
    summary:
      'A dramatic, spiky-leaved plant with a tree-like trunk. Tolerant of neglect and low light, making it a reliable statement plant.',
    care: {
      watering:
        'Water when the top 2 inches of soil are dry — every 1-2 weeks. Very drought-tolerant once established.',
      sunlight:
        'Prefers bright, indirect light. Tolerates lower light but growth slows. Avoid direct sun.',
      soil:
        'Use a well-draining potting mix with perlite or sand for good drainage.',
      temperature:
        'Keep between 65-80°F. Sensitive to cold — keep above 55°F.',
      humidity:
        'Average household humidity is fine.',
      fertilizing:
        'Feed 2-3 times per year with a balanced fertilizer. Dracaenas are light feeders.',
    },
    growth: {
      matureSize: '5-6 ft tall indoors, up to 20 ft outdoors',
      growthRate: 'Slow — a few inches per year',
      lifespan: '10+ years',
      bloomTime: 'Does not bloom indoors',
    },
    commonProblems: [
      { problem: 'Brown leaf tips', cause: 'Fluoride in tap water or dry air', solution: 'Use filtered water and increase humidity. Trim brown tips with scissors.' },
      { problem: 'Yellowing lower leaves', cause: 'Natural aging', solution: 'Remove old leaves as they yellow — this is normal for dracaenas.' },
      { problem: 'Soft, mushy trunk', cause: 'Overwatering and stem rot', solution: 'Reduce watering immediately. If the trunk is soft, the plant may not recover.' },
    ],
    goodFor: ['Beginners', 'Statement corners', 'Low-light rooms', 'Offices'],
    tips: [
      'Dracaenas are sensitive to fluoride — use filtered or distilled water to prevent brown tips.',
      'Prune the top to control height and encourage branching.',
      'Keep away from pets — dracaenas are toxic to cats and dogs.',
    ],
    image: img('https://images.pexels.com/photos/14542158/pexels-photo-14542158.jpeg?auto=compress&cs=tinysrgb&w=900'),
    funFact:
      'The name Dracaena comes from the Greek word for "female dragon" — the red resin of some species is called "dragon\u2019s blood."',
  },
];
