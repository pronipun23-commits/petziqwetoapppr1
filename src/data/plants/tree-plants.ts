import type { Plant } from './types';

export const treePlants: Plant[] = [
  {
    id: 'neem',
    name: 'Neem Tree',
    scientificName: 'Azadirachta indica',
    category: ['tree', 'outdoor', 'herb'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Low',
    soil: 'Well-draining soil, tolerates poor soil',
    temperature: '55-100°F (13-38°C)',
    difficulty: 'Beginner',
    tagline: 'The medicinal tree of a thousand uses',
    summary:
      'A fast-growing evergreen tree whose leaves, seeds, and bark are used in traditional medicine, pest control, and agriculture. Drought-tolerant and deeply valued in South Asia.',
    care: {
      watering:
        'Water young trees weekly until established. Mature neem trees are extremely drought-tolerant and need little supplemental water.',
      sunlight:
        'Needs full sun — at least 6-8 hours of direct light daily.',
      soil:
        'Plant in well-draining soil. Neem tolerates poor, dry, and rocky soils but not waterlogged ground.',
      temperature:
        'Thrives in 55-100°F. Sensitive to frost — young trees need protection below 40°F.',
      humidity:
        'Tolerates dry air and arid conditions well.',
      fertilizing:
        'Feed young trees with a balanced fertilizer in spring. Mature trees rarely need feeding.',
    },
    growth: {
      matureSize: '15-30 ft tall in gardens, up to 50 ft in ideal conditions',
      growthRate: 'Fast — 2-3 ft per year',
      lifespan: '150-200 years',
      bloomTime: 'Spring — small white fragrant flowers',
    },
    commonProblems: [
      { problem: 'Leaf yellowing', cause: 'Overwatering or poor drainage', solution: 'Reduce watering and ensure soil drains freely.' },
      { problem: 'Sooty mold', cause: 'Honeydew from sap-sucking insects', solution: 'Treat the insect infestation and wipe leaves clean.' },
      { problem: 'Frost damage', cause: 'Cold temperatures below 40°F', solution: 'Cover young trees or bring potted specimens indoors during cold snaps.' },
    ],
    goodFor: ['Outdoor gardens', 'Medicinal use', 'Shade tree', 'Arid climates'],
    tips: [
      'Neem leaves are used as a natural insecticide — steep them in water to make an organic pest spray.',
      'Neem oil pressed from seeds is a popular organic treatment for garden pests.',
      'Plant neem away from waterlogged areas — it hates sitting in wet soil.',
    ],
    image:
      'https://images.pexels.com/photos/17715129/pexels-photo-17715129.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Neem is called "the village pharmacy" in India because virtually every part — leaves, bark, seeds, and twigs — has a medicinal or agricultural use.',
  },
  {
    id: 'mango',
    name: 'Mango Tree',
    scientificName: 'Mangifera indica',
    category: ['tree', 'outdoor', 'edible'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Deep, well-draining soil',
    temperature: '70-100°F (21-38°C)',
    difficulty: 'Intermediate',
    tagline: 'The king of tropical fruit trees',
    summary:
      'A large evergreen tree producing one of the world\u2019s most beloved tropical fruits. Sweet, fragrant mangoes ripen in summer and come in hundreds of varieties.',
    care: {
      watering:
        'Water young trees weekly. Mature trees are drought-tolerant but produce better fruit with consistent deep watering during flowering and fruiting.',
      sunlight:
        'Needs full sun — at least 8 hours of direct light for good fruit production.',
      soil:
        'Plant in deep, well-draining soil. Mangoes tolerate various soil types but hate waterlogged roots.',
      temperature:
        'Loves heat — 70-100°F. Young trees die below 30°F. Mature trees survive brief cold but fruit production drops.',
      humidity:
        'Prefers moderate to high humidity during flowering.',
      fertilizing:
        'Feed with a citrus or fruit tree fertilizer 3-4 times per year. Do not fertilize during flowering.',
    },
    growth: {
      matureSize: '10-30 ft (dwarf varieties) to 100 ft (seedling trees)',
      growthRate: 'Fast — 2-3 ft per year when young',
      lifespan: '100+ years for grafted trees',
      bloomTime: 'Late winter to spring — small pinkish flowers in panicles',
    },
    commonProblems: [
      { problem: 'No fruit', cause: 'Young tree age (grafted trees fruit in 3-5 years; seedlings take 6-10 years)', solution: 'Be patient — ensure full sun and proper fertilization with a bloom formula.' },
      { problem: 'Anthracnose (black spots on fruit and leaves)', cause: 'Fungal infection in humid, wet weather', solution: 'Apply a copper-based fungicide and improve airflow around the tree.' },
      { problem: 'Mango leafhoppers', cause: 'Insect infestation during flowering', solution: 'Spray with neem oil or insecticidal soap during early bloom.' },
    ],
    goodFor: ['Tropical gardens', 'Fruit production', 'Shade tree', 'Large landscapes'],
    tips: [
      'Choose grafted dwarf varieties for smaller gardens — they fruit sooner and stay manageable.',
      'Do not over-fertilize with nitrogen — it produces leaves at the expense of fruit.',
      'Mango trees need dry weather during flowering for successful fruit set.',
    ],
    image:
      'https://images.pexels.com/photos/20568790/pexels-photo-20568790.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Mango is the national fruit of India, Pakistan, and the Philippines, and the national tree of Bangladesh.',
  },
  {
    id: 'banyan',
    name: 'Banyan Tree',
    scientificName: 'Ficus benghalensis',
    category: ['tree', 'outdoor', 'tropical'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Well-draining soil',
    temperature: '60-100°F (15-38°C)',
    difficulty: 'Experienced',
    tagline: 'The sacred tree that walks across the land',
    summary:
      'A massive fig tree that spreads by dropping aerial roots from its branches, which become new trunk-like supports. India\u2019s national tree and a sacred symbol in Hinduism.',
    care: {
      watering:
        'Water young trees weekly. Mature banyan trees are drought-tolerant. Potted specimens need regular watering.',
      sunlight:
        'Needs full sun to partial shade. Young plants tolerate more shade.',
      soil:
        'Plant in well-draining soil. Banyans adapt to various soil types but need space for their extensive root system.',
      temperature:
        'Thrives in 60-100°F. Not frost-tolerant — needs tropical or subtropical climate.',
      humidity:
        'Prefers moderate to high humidity.',
      fertilizing:
        'Feed young trees monthly during the growing season. Mature trees need no fertilizer.',
    },
    growth: {
      matureSize: 'Can spread over hundreds of feet — the largest can cover 4+ acres',
      growthRate: 'Fast when established',
      lifespan: '200-500+ years',
      bloomTime: 'Spring and summer — figs (not showy, enclosed flowers)',
    },
    commonProblems: [
      { problem: 'Root damage to structures', cause: 'Aggressive, spreading root system', solution: 'Plant far from buildings, foundations, and underground pipes. Do not plant in small yards.' },
      { problem: 'Aerial roots becoming unmanageable', cause: 'Natural growth habit', solution: 'Prune aerial roots if desired, but they are essential to the tree\u2019s spreading nature.' },
      { problem: 'Leaf drop indoors', cause: 'Low light or environmental stress', solution: 'Provide maximum light if growing as a potted specimen indoors.' },
    ],
    goodFor: ['Large landscapes', 'Botanical gardens', 'Tropical estates', 'Shade'],
    tips: [
      'Banyan trees need enormous space — only plant if you have acres of land.',
      'In Hinduism, the banyan is sacred and represents eternal life.',
      'The Great Banyan in Howrah, India, appears as a forest but is a single tree covering over 4 acres.',
    ],
    image:
      'https://images.pexels.com/photos/38334416/pexels-photo-38334416.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'The largest banyan tree in the world, Thimmamma Marrimanu in Andhra Pradesh, covers over 4.7 acres and has over 1,100 aerial roots.',
  },
  {
    id: 'peepal',
    name: 'Peepal Tree',
    scientificName: 'Ficus religiosa',
    category: ['tree', 'outdoor', 'tropical'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Well-draining soil',
    temperature: '55-100°F (13-38°C)',
    difficulty: 'Intermediate',
    tagline: 'The sacred fig under which Buddha found enlightenment',
    summary:
      'A large deciduous tree with heart-shaped leaves that flutter in the breeze. Sacred in Buddhism, Hinduism, and Jainism — the Buddha is said to have attained enlightenment beneath one.',
    care: {
      watering:
        'Water young trees weekly until established. Mature peepal trees are drought-tolerant.',
      sunlight:
        'Needs full sun — at least 6-8 hours of direct light.',
      soil:
        'Plant in well-draining soil. Adapts to various soil types including rocky and poor soil.',
      temperature:
        'Thrives in 55-100°F. Tolerates brief cold but young trees need frost protection.',
      humidity:
        'Prefers moderate humidity. Tolerates dry periods once established.',
      fertilizing:
        'Feed young trees with a balanced fertilizer in spring. Mature trees need no feeding.',
    },
    growth: {
      matureSize: '30-100 ft tall',
      growthRate: 'Fast — 2-3 ft per year',
      lifespan: '500-1000+ years',
      bloomTime: 'Spring — figs (enclosed flowers)',
    },
    commonProblems: [
      { problem: 'Root damage to structures', cause: 'Aggressive root system', solution: 'Plant well away from buildings and infrastructure.' },
      { problem: 'Leaf drop in winter', cause: 'Natural deciduous behavior', solution: 'No action needed — new leaves emerge in spring.' },
      { problem: 'Sooty mold', cause: 'Honeydew from sap-sucking insects', solution: 'Control insect pests and wipe leaves clean.' },
    ],
    goodFor: ['Large landscapes', 'Temple gardens', 'Shade tree', 'Spiritual significance'],
    tips: [
      'Peepal leaves have a long, drawn-out tip that makes them flutter in even the slightest breeze.',
      'In Buddhism, the peepal is called the Bodhi tree — the tree of enlightenment.',
      'Plant in a location with plenty of space for the extensive root system.',
    ],
    image:
      'https://images.pexels.com/photos/34876696/pexels-photo-34876696.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'The Bodhi Tree at the Mahabodhi Temple in Bodh Gaya is a descendant of the original peepal tree under which the Buddha attained enlightenment.',
  },
  {
    id: 'coconut',
    name: 'Coconut Palm',
    scientificName: 'Cocos nucifera',
    category: ['tree', 'outdoor', 'tropical'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Sandy, well-draining soil',
    temperature: '70-100°F (21-38°C)',
    difficulty: 'Experienced',
    tagline: 'The tree of a thousand uses',
    summary:
      'An iconic tropical palm producing coconuts year-round. Every part of the tree is used in tropical cultures — food, drink, fiber, timber, and oil.',
    care: {
      watering:
        'Water regularly — coconut palms need consistent moisture. Young palms need weekly watering; established palms tap groundwater.',
      sunlight:
        'Needs full sun — at least 8 hours of direct, hot sunlight daily. No shade tolerance.',
      soil:
        'Plant in sandy, well-draining soil. Tolerates salt and coastal conditions. Hates heavy, waterlogged clay.',
      temperature:
        'Loves heat — 70-100°F. Cannot tolerate frost. Will not survive prolonged temperatures below 40°F.',
      humidity:
        'Needs high humidity. Thrives in tropical coastal environments.',
      fertilizing:
        'Feed with a palm-specific fertilizer containing magnesium and potassium 3-4 times per year.',
    },
    growth: {
      matureSize: '50-100 ft tall',
      growthRate: 'Moderate — 1-2 ft per year',
      lifespan: '60-80 years',
      bloomTime: 'Year-round in tropical climates — produces coconuts continuously',
    },
    commonProblems: [
      { problem: 'Frond yellowing', cause: 'Nutrient deficiency (potassium or magnesium)', solution: 'Apply a palm fertilizer with magnesium and potassium.' },
      { problem: 'Lethal yellowing disease', cause: 'Phytoplasma infection spread by insects', solution: 'Plant resistant varieties and remove infected trees.' },
      { problem: 'Cold damage', cause: 'Temperatures below 40°F', solution: 'Coconut palms cannot be grown in frost-prone areas. Dwarf varieties are slightly more cold-sensitive.' },
    ],
    goodFor: ['Tropical landscapes', 'Coastal gardens', 'Food production', 'Large estates'],
    tips: [
      'Coconut palms are called "the tree of life" in many tropical cultures.',
      'Dwarf varieties (like Malayan Dwarf) are easier to manage in home gardens.',
      'Do not plant near structures or walkways — falling coconuts are dangerous.',
    ],
    image:
      'https://images.pexels.com/photos/18139256/pexels-photo-18139256.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Every part of the coconut palm is used — the tree is known in Malay as "pokok seribu guna," meaning "the tree of a thousand uses."',
  },
  {
    id: 'guava',
    name: 'Guava Tree',
    scientificName: 'Psidium guajava',
    category: ['tree', 'outdoor', 'edible'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Well-draining soil, tolerates poor soil',
    temperature: '60-90°F (15-32°C)',
    difficulty: 'Beginner',
    tagline: 'Sweet tropical fruit with a vitamin C punch',
    summary:
      'A small, fast-growing tropical fruit tree producing round, fragrant fruits with sweet pink or white flesh. One of the richest fruit sources of vitamin C.',
    care: {
      watering:
        'Water young trees weekly. Mature guavas are somewhat drought-tolerant but fruit best with regular watering.',
      sunlight:
        'Needs full sun — at least 6-8 hours of direct light for good fruit production.',
      soil:
        'Plant in well-draining soil. Guava tolerates a wide range of soil types, including poor and acidic soils.',
      temperature:
        'Prefers 60-90°F. Can survive brief cold down to 27°F but young trees are frost-sensitive.',
      humidity:
        'Tolerates both humid and dry conditions.',
      fertilizing:
        'Feed every 2-3 months during the growing season with a fruit tree fertilizer.',
    },
    growth: {
      matureSize: '10-20 ft tall (dwarf varieties 4-6 ft)',
      growthRate: 'Fast — fruits within 2-4 years',
      lifespan: '30-40 years',
      bloomTime: 'Spring — white flowers with prominent stamens',
    },
    commonProblems: [
      { problem: 'Fruit fly damage', cause: 'Fruit flies laying eggs in ripening fruit', solution: 'Bag fruit or use fruit fly traps.' },
      { problem: 'Wilt disease', cause: 'Fungal infection causing sudden decline', solution: 'Plant in well-draining soil and avoid waterlogging.' },
      { problem: 'Mealybugs', cause: 'Sap-sucking insect infestation', solution: 'Spray with neem oil or insecticidal soap.' },
    ],
    goodFor: ['Tropical gardens', 'Fruit production', 'Containers (dwarf)', 'Hedges'],
    tips: [
      'Guava fruit has 4 times more vitamin C than an orange.',
      'Dwarf varieties can be grown in large containers and fruit within 2 years.',
      'Prune to keep the tree manageable and encourage fruiting branches.',
    ],
    image:
      'https://images.pexels.com/photos/12985589/pexels-photo-12985589.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'A single guava fruit contains about 4 times the vitamin C of an orange — one of the highest concentrations of any fruit.',
  },
  {
    id: 'lemon',
    name: 'Lemon Tree',
    scientificName: 'Citrus limon',
    category: ['tree', 'outdoor', 'edible'],
    environment: 'Both',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Well-draining, slightly acidic soil',
    temperature: '55-85°F (13-29°C)',
    difficulty: 'Intermediate',
    tagline: 'Bright, zesty fruit year-round',
    summary:
      'A compact citrus tree producing bright yellow, acidic lemons. Can be grown outdoors in warm climates or in containers indoors in cold regions.',
    care: {
      watering:
        'Water when the top 2 inches of soil are dry — about once a week. Container plants need more frequent watering. Do not let soil dry completely.',
      sunlight:
        'Needs full sun — at least 6-8 hours of direct light. Indoor plants need a south-facing window or grow lights.',
      soil:
        'Use well-draining, slightly acidic soil (pH 6.0-7.0). Citrus-specific potting mix is ideal for containers.',
      temperature:
        'Prefers 55-85°F. Bring indoors before frost — lemons tolerate brief cold to 29°F but prolonged frost kills them.',
      humidity:
        'Prefers moderate humidity. Indoor plants benefit from misting in dry winter air.',
      fertilizing:
        'Feed monthly during the growing season with a citrus-specific fertilizer containing zinc, iron, and manganese.',
    },
    growth: {
      matureSize: '8-15 ft outdoors (dwarf varieties 3-5 ft)',
      growthRate: 'Moderate — fruits within 2-3 years of planting',
      lifespan: '30-50 years',
      bloomTime: 'Year-round in warm climates — fragrant white flowers',
    },
    commonProblems: [
      { problem: 'Yellow leaves with green veins', cause: 'Iron deficiency or high soil pH', solution: 'Apply iron chelate and ensure soil is slightly acidic.' },
      { problem: 'Leaf drop', cause: 'Overwatering, cold stress, or sudden environmental change', solution: 'Water consistently, protect from cold, and avoid moving the plant suddenly.' },
      { problem: 'Scale insects', cause: 'Sap-sucking pests on stems and leaves', solution: 'Wipe with neem oil or insecticidal soap. Inspect regularly.' },
    ],
    goodFor: ['Fruit production', 'Containers (dwarf)', 'Mediterranean gardens', 'Edible landscaping'],
    tips: [
      'Dwarf lemon trees (like Meyer lemon) thrive in containers and can be moved indoors for winter.',
      'Lemon flowers are self-pollinating, but indoor plants may need hand pollination with a small brush.',
      'Do not let containers dry out completely — inconsistent watering causes fruit drop.',
    ],
    image:
      'https://images.pexels.com/photos/7457203/pexels-photo-7457203.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Lemon trees can produce fruit and flowers simultaneously year-round in warm climates — a single tree may have buds, flowers, and ripe fruit at the same time.',
  },
  {
    id: 'jackfruit',
    name: 'Jackfruit Tree',
    scientificName: 'Artocarpus heterophyllus',
    category: ['tree', 'outdoor', 'edible', 'tropical'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Rich, well-draining soil',
    temperature: '70-100°F (21-38°C)',
    difficulty: 'Intermediate',
    tagline: 'The world\u2019s largest tree fruit',
    summary:
      'A tropical tree that produces the largest fruit of any tree — individual jackfruits can weigh up to 80 pounds. The fruit is eaten ripe or used as a meat substitute when unripe.',
    care: {
      watering:
        'Water young trees weekly. Mature trees are drought-tolerant but produce better fruit with consistent moisture.',
      sunlight:
        'Needs full sun — at least 6-8 hours of direct light.',
      soil:
        'Plant in deep, rich, well-draining soil. Jackfruit prefers slightly acidic to neutral pH.',
      temperature:
        'Loves heat — 70-100°F. Sensitive to cold — young trees die below 32°F.',
      humidity:
        'Prefers high humidity — tropical conditions are ideal.',
      fertilizing:
        'Feed quarterly with a fruit tree fertilizer. Young trees need more nitrogen; mature trees need more potassium.',
    },
    growth: {
      matureSize: '30-70 ft tall',
      growthRate: 'Fast — 3-5 ft per year',
      lifespan: '60-100 years',
      bloomTime: 'Spring and summer — flowers form directly on the trunk',
    },
    commonProblems: [
      { problem: 'No fruit', cause: 'Young tree (fruits at 3-7 years) or insufficient pollination', solution: 'Be patient and plant multiple trees for cross-pollination if space allows.' },
      { problem: 'Fruit drop', cause: 'Water stress or poor pollination', solution: 'Maintain consistent watering during fruit development.' },
      { problem: 'Dieback', cause: 'Fungal disease or cold damage', solution: 'Prune affected branches and protect from cold.' },
    ],
    goodFor: ['Tropical gardens', 'Large landscapes', 'Fruit production', 'Food forests'],
    tips: [
      'Unripe jackfruit is used as a vegan meat substitute — its texture resembles pulled pork.',
      'One jackfruit can contain hundreds of edible yellow bulbs.',
      'The tree bears fruit on its trunk, a phenomenon called cauliflory.',
    ],
    image:
      'https://images.pexels.com/photos/34992294/pexels-photo-34992294.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Jackfruit is the largest tree-borne fruit in the world — individual fruits can weigh up to 80 pounds and contain hundreds of edible seeds.',
  },
  {
    id: 'apple',
    name: 'Apple Tree',
    scientificName: 'Malus domestica',
    category: ['tree', 'outdoor', 'edible'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Well-draining loam',
    temperature: '35-85°F (2-29°C)',
    difficulty: 'Intermediate',
    tagline: 'The classic orchard fruit tree',
    summary:
      'A deciduous fruit tree producing crisp, sweet apples in thousands of varieties. A cornerstone of temperate fruit orchards worldwide.',
    care: {
      watering:
        'Water young trees weekly. Mature trees need deep watering every 2-3 weeks during the growing season. Reduce watering before harvest.',
      sunlight:
        'Needs full sun — at least 6-8 hours of direct light for good fruit production.',
      soil:
        'Plant in well-draining loam with compost. Slightly acidic to neutral pH (6.0-7.0).',
      temperature:
        'Needs chill hours — 500-1,000 hours below 45°F in winter to set fruit. Different varieties have different chill requirements.',
      humidity:
        'Moderate humidity. Dry weather during bloom helps pollination.',
      fertilizing:
        'Feed in early spring with a fruit tree fertilizer. Do not fertilize after mid-summer to allow hardening off before winter.',
    },
    growth: {
      matureSize: '8-20 ft (dwarf) to 20-30 ft (standard)',
      growthRate: 'Moderate — fruits within 3-5 years',
      lifespan: '30-50 years (dwarf), 50-100 years (standard)',
      bloomTime: 'Spring — white to pink flowers before leaves emerge',
    },
    commonProblems: [
      { problem: 'No fruit', cause: 'No pollinator nearby (most varieties need cross-pollination)', solution: 'Plant two different compatible varieties within 50 ft of each other.' },
      { problem: 'Codling moth damage', cause: 'Insect larvae tunneling into fruit', solution: 'Use pheromone traps, bag fruit, or spray with appropriate insecticide.' },
      { problem: 'Apple scab', cause: 'Fungal infection causing dark scabs on fruit', solution: 'Plant scab-resistant varieties and rake up fallen leaves.' },
    ],
    goodFor: ['Orchards', 'Temperate gardens', 'Edible landscaping', 'Containers (dwarf)'],
    tips: [
      'Most apple trees need a second compatible variety nearby for cross-pollination.',
      'Dwarf rootstock keeps trees small and fruiting sooner — ideal for home gardens.',
      'Prune annually in late winter to maintain an open canopy for sunlight and airflow.',
    ],
    image:
      'https://images.pexels.com/photos/13317132/pexels-photo-13317132.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'There are over 7,500 known apple varieties worldwide, but only about 100 are grown commercially.',
  },
  {
    id: 'papaya',
    name: 'Papaya Tree',
    scientificName: 'Carica papaya',
    category: ['tree', 'outdoor', 'edible', 'tropical'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Well-draining, rich soil',
    temperature: '70-90°F (21-32°C)',
    difficulty: 'Beginner',
    tagline: 'Fast-growing tropical fruit factory',
    summary:
      'A fast-growing, single-stemmed tropical plant producing large, sweet orange-fleshed fruits. Can fruit within a year of planting from seed.',
    care: {
      watering:
        'Water 2-3 times per week. Papayas need consistent moisture but cannot tolerate waterlogged soil.',
      sunlight:
        'Needs full sun — at least 6-8 hours of direct, hot sunlight daily.',
      soil:
        'Plant in rich, well-draining soil. Papayas need excellent drainage — root rot is the biggest threat.',
      temperature:
        'Loves heat — 70-90°F. Very sensitive to cold — damaged below 32°F and killed below 28°F.',
      humidity:
        'Prefers moderate to high humidity.',
      fertilizing:
        'Feed monthly with a balanced fertilizer. Papayas are heavy feeders during active growth.',
    },
    growth: {
      matureSize: '6-20 ft tall',
      growthRate: 'Very fast — fruits within 6-12 months from seed',
      lifespan: '3-5 years (productivity declines after 3-4 years)',
      bloomTime: 'Year-round in tropical climates',
    },
    commonProblems: [
      { problem: 'Root rot', cause: 'Waterlogged soil', solution: 'Plant in well-draining soil or raised beds. Never let water pool around the base.' },
      { problem: 'Papaya ringspot virus', cause: 'Viral infection spread by aphids', solution: 'Plant resistant varieties and control aphid populations.' },
      { problem: 'No fruit', cause: 'Male plant or lack of pollination', solution: 'Plant several to ensure you have female or bisexual trees. Some are self-pollinating.' },
    ],
    goodFor: ['Tropical gardens', 'Fruit production', 'Fast results', 'Containers when young'],
    tips: [
      'Papayas can produce fruit within 12 months of planting from seed.',
      'Plant 2-3 seeds together and thin to the strongest, as you cannot tell male from female until flowering.',
      'Replace papaya plants every 3-4 years as productivity declines.',
    ],
    image:
      'https://images.pexels.com/photos/3187104/pexels-photo-3187104.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Papaya contains papain, an enzyme that breaks down protein — it is used as a meat tenderizer and in digestive supplements.',
  },
  {
    id: 'pomegranate',
    name: 'Pomegranate Tree',
    scientificName: 'Punica granatum',
    category: ['tree', 'outdoor', 'edible'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Low',
    soil: 'Well-draining soil, tolerates poor soil',
    temperature: '40-95°F (4-35°C)',
    difficulty: 'Beginner',
    tagline: 'Ruby-red seeds packed with antioxidants',
    summary:
      'A deciduous shrub or small tree producing leathery red fruits filled with jewel-like, juicy seeds. Drought-tolerant and adaptable to many climates.',
    care: {
      watering:
        'Water young trees weekly. Mature pomegranates are very drought-tolerant. Water deeply every 2-3 weeks during fruit development for best fruit.',
      sunlight:
        'Needs full sun — at least 6 hours of direct light for good fruit production.',
      soil:
        'Plant in well-draining soil. Tolerates poor, rocky, and alkaline soils. Hates waterlogged ground.',
      temperature:
        'Hardy in 40-95°F. Tolerates frost down to 10°F. One of the most cold-tolerant subtropical fruit trees.',
      humidity:
        'Prefers dry, arid conditions. High humidity can cause fruit splitting and fungal issues.',
      fertilizing:
        'Feed in spring with a balanced fertilizer. Pomegranates are light feeders — do not over-fertilize.',
    },
    growth: {
      matureSize: '6-12 ft tall and wide (dwarf varieties 2-4 ft)',
      growthRate: 'Moderate — fruits within 2-3 years',
      lifespan: '20-30 years',
      bloomTime: 'Spring — bright orange-red trumpet flowers',
    },
    commonProblems: [
      { problem: 'Fruit splitting', cause: 'Inconsistent watering during fruit development', solution: 'Water regularly during dry periods while fruit is growing.' },
      { problem: 'No fruit', cause: 'Young tree or insufficient sun', solution: 'Ensure 6+ hours of full sun and be patient — young trees need 2-3 years.' },
      { problem: 'Aphids', cause: 'Pest infestation on new growth', solution: 'Spray with insecticidal soap or a strong jet of water.' },
    ],
    goodFor: ['Mediterranean gardens', 'Drought-tolerant landscapes', 'Fruit production', 'Containers (dwarf)'],
    tips: [
      'Pomegranate seeds (arils) are eaten fresh, juiced, or used as garnish.',
      'Dwarf varieties can fruit in containers and tolerate pruning well.',
      'Pomegranates are self-fertile but produce more fruit with a second variety nearby.',
    ],
    image:
      'https://images.pexels.com/photos/28678617/pexels-photo-28678617.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Pomegranate means "seeded apple" — a single fruit can contain over 600 edible seeds (arils).',
  },
  {
    id: 'orange',
    name: 'Orange Tree',
    scientificName: 'Citrus sinensis',
    category: ['tree', 'outdoor', 'edible'],
    environment: 'Both',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Well-draining, slightly acidic soil',
    temperature: '55-85°F (13-29°C)',
    difficulty: 'Intermediate',
    tagline: 'Sweet citrus sunshine',
    summary:
      'A classic citrus tree producing sweet, juicy oranges. Can be grown outdoors in warm climates or in containers indoors in colder regions.',
    care: {
      watering:
        'Water when the top 2 inches of soil are dry — about once a week for outdoor trees, more often for containers. Deep, infrequent watering encourages deep roots.',
      sunlight:
        'Needs full sun — at least 6-8 hours of direct light. Indoor plants need a bright south-facing window or grow lights.',
      soil:
        'Use well-draining, slightly acidic soil (pH 6.0-7.0). A citrus potting mix is ideal for containers.',
      temperature:
        'Prefers 55-85°F. Most varieties tolerate brief frost to 27°F. Bring container plants indoors before freezing.',
      humidity:
        'Prefers moderate humidity. Mist indoor plants in dry conditions.',
      fertilizing:
        'Feed monthly during the growing season with a citrus-specific fertilizer.',
    },
    growth: {
      matureSize: '10-20 ft outdoors (dwarf 4-8 ft)',
      growthRate: 'Moderate — fruits within 3-4 years',
      lifespan: '30-50 years',
      bloomTime: 'Spring — fragrant white orange-blossom flowers',
    },
    commonProblems: [
      { problem: 'Yellow leaves', cause: 'Nutrient deficiency or overwatering', solution: 'Apply citrus fertilizer with micronutrients and ensure proper drainage.' },
      { problem: 'Leaf miner damage', cause: 'Insect larvae tunneling in leaves', solution: 'Prune affected growth and spray with horticultural oil.' },
      { problem: 'Fruit drop', cause: 'Water stress or over-fertilization', solution: 'Maintain consistent watering and reduce fertilizer during fruit development.' },
    ],
    goodFor: ['Orchards', 'Containers (dwarf)', 'Mediterranean gardens', 'Edible landscaping'],
    tips: [
      'Dwarf orange varieties thrive in containers and can be moved indoors for winter.',
      'Orange blossoms produce a fragrance used in perfumery — neroli oil is distilled from the flowers.',
      'Oranges ripen on the tree and do not continue ripening after picking — wait until fully colored.',
    ],
    image:
      'https://images.pexels.com/photos/3804878/pexels-photo-3804878.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Orange blossom flowers are the state flower of Florida, and their fragrance is used to make neroli, a prized essential oil in perfumery.',
  },
  {
    id: 'fig',
    name: 'Fig Tree',
    scientificName: 'Ficus carica',
    category: ['tree', 'outdoor', 'edible'],
    environment: 'Both',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Well-draining soil',
    temperature: '50-95°F (10-35°C)',
    difficulty: 'Beginner',
    tagline: 'Ancient sweet fruit with lobed leaves',
    summary:
      'A deciduous tree producing sweet, honey-filled figs. One of the earliest cultivated plants — grown for over 11,000 years. Adaptable and drought-tolerant once established.',
    care: {
      watering:
        'Water young trees weekly. Mature figs are drought-tolerant. Container-grown figs need regular watering — do not let them dry out completely during fruiting.',
      sunlight:
        'Needs full sun — at least 6-8 hours of direct light for sweet fruit.',
      soil:
        'Plant in well-draining soil. Figs tolerate poor, rocky, and alkaline soils. Hates wet, heavy ground.',
      temperature:
        'Hardy in 50-95°F. Some varieties tolerate cold down to 10°F with protection. Container plants should be moved to a cool garage or shed for winter.',
      humidity:
        'Tolerates dry and moderate humidity well.',
      fertilizing:
        'Feed in spring with a balanced fertilizer. Do not over-fertilize — too much nitrogen produces leaves instead of fruit.',
    },
    growth: {
      matureSize: '10-30 ft outdoors (dwarf 3-6 ft for containers)',
      growthRate: 'Fast — fruits within 2-3 years',
      lifespan: '50-100+ years',
      bloomTime: 'Figs are inverted flowers — no visible bloom, fruit develops directly',
    },
    commonProblems: [
      { problem: 'No fruit', cause: 'Young tree, wrong variety for climate, or insufficient sun', solution: 'Choose a self-fertile variety suited to your chill hours and ensure full sun.' },
      { problem: 'Fruit drop before ripening', cause: 'Water stress or too much nitrogen', solution: 'Maintain consistent watering and switch to a low-nitrogen fertilizer.' },
      { problem: 'Winter dieback', cause: 'Cold damage to branches', solution: 'Wrap young trees in burlap for winter or move container plants to a sheltered spot.' },
    ],
    goodFor: ['Mediterranean gardens', 'Containers (dwarf)', 'Edible landscaping', 'Drought-tolerant gardens'],
    tips: [
      'Figs are actually inverted flowers — the tiny seeds inside are the fruits of individual flowers inside the fig.',
      'Container-grown figs can be moved to a cool, dark garage for winter dormancy.',
      'Choose self-fertile varieties like Brown Turkey or Celeste for home gardens.',
    ],
    image:
      'https://images.pexels.com/photos/34876689/pexels-photo-34876689.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'A fig is not a fruit in the botanical sense — it is a synconium, an inverted flower stalk with hundreds of tiny flowers inside.',
  },
  {
    id: 'avocado',
    name: 'Avocado Tree',
    scientificName: 'Persea americana',
    category: ['tree', 'outdoor', 'edible', 'tropical'],
    environment: 'Both',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Well-draining soil',
    temperature: '60-85°F (15-29°C)',
    difficulty: 'Intermediate',
    tagline: 'Creamy green superfood tree',
    summary:
      'A subtropical tree producing nutrient-rich, creamy fruits. Can be grown outdoors in warm climates or as a container plant. Trees grown from pit may take 7-10 years to fruit.',
    care: {
      watering:
        'Water when the top 2-3 inches of soil are dry — about once a week. Avocados need consistent moisture but excellent drainage. Overwatering causes root rot.',
      sunlight:
        'Needs full sun — at least 6 hours of direct light. Young plants benefit from some afternoon shade in hot climates.',
      soil:
        'Use well-draining soil. Avocados are highly susceptible to root rot — excellent drainage is non-negotiable.',
      temperature:
        'Prefers 60-85°F. Mexican varieties tolerate frost down to 18°F. Guatemalan varieties are more cold-sensitive.',
      humidity:
        'Prefers moderate humidity. Good airflow prevents disease.',
      fertilizing:
        'Feed monthly during the growing season with a citrus/avocado fertilizer containing zinc.',
    },
    growth: {
      matureSize: '15-30 ft outdoors (dwarf 5-8 ft for containers)',
      growthRate: 'Fast — 2-3 ft per year when young',
      lifespan: '50+ years (grafted trees fruit in 3-4 years)',
      bloomTime: 'Spring — small yellow-green flowers',
    },
    commonProblems: [
      { problem: 'No fruit', cause: 'Tree grown from seed (takes 7-10 years) or no pollinator', solution: 'Buy a grafted tree for fruit in 3-4 years. Type A and Type B varieties improve pollination.' },
      { problem: 'Root rot', cause: 'Overwatering or poor drainage', solution: 'Ensure excellent drainage, plant in raised beds or well-draining soil, and water less frequently.' },
      { problem: 'Leaf tip burn', cause: 'Salt buildup or chloride in water', solution: 'Leach the soil with deep watering periodically and use low-chloride water if available.' },
    ],
    goodFor: ['Subtropical gardens', 'Containers (dwarf)', 'Edible landscaping', 'Food forests'],
    tips: [
      'Trees grown from a grocery-store pit take 7-10 years to fruit — buy a grafted tree for faster production.',
      'Avocados have type A or type B flowers — planting one of each improves fruit set.',
      'Excellent drainage is the single most important factor for avocado success.',
    ],
    image:
      'https://images.pexels.com/photos/14023214/pexels-photo-14023214.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Avocados are technically a berry — a single-seeded berry with a fleshy mesocarp, unlike any other fruit.',
  },
];
