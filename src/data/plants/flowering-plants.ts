import type { Plant } from './types';

export const floweringPlants: Plant[] = [
  {
    id: 'lavender',
    name: 'Lavender',
    scientificName: 'Lavandula angustifolia',
    category: ['flowering', 'outdoor', 'herb'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Low',
    soil: 'Sandy, alkaline, well-draining soil',
    temperature: '45-90°F (7-32°C)',
    difficulty: 'Intermediate',
    tagline: 'The fragrant purple field classic',
    summary:
      'An aromatic Mediterranean shrub with slender silver-green leaves and spikes of purple flowers. Beloved for scent and pollinators.',
    care: {
      watering:
        'Water established plants only during dry spells. Lavender prefers dry conditions — overwatering kills it.',
      sunlight:
        'Needs full sun — at least 6-8 hours of direct light daily.',
      soil:
        'Requires sandy, well-draining, slightly alkaline soil. Add gravel or sand to heavy clay soils.',
      temperature:
        'Hardy in 45-90°F. English lavender survives winter freezes; Spanish lavender needs mild winters.',
      humidity:
        'Prefers dry, breezy conditions. High humidity promotes fungal disease.',
      fertilizing:
        'Do not over-fertilize — lavender thrives in lean soil. A light compost top-dressing in spring is enough.',
    },
    growth: {
      matureSize: '1-3 ft tall and wide',
      growthRate: 'Moderate',
      lifespan: '5-15 years',
      bloomTime: 'Late spring to summer — purple flower spikes',
    },
    commonProblems: [
      { problem: 'Woody, leggy center', cause: 'Lack of pruning', solution: 'Prune back by one-third after flowering each year to maintain shape and prevent woodiness.' },
      { problem: 'Root rot', cause: 'Heavy, wet soil', solution: 'Plant in sandy, well-draining soil or in raised beds. Avoid clay-heavy ground.' },
      { problem: 'No flowers', cause: 'Insufficient sun or over-fertilizing', solution: 'Ensure 6+ hours of full sun and stop fertilizing — lavender blooms best in lean conditions.' },
    ],
    goodFor: ['Outdoor gardens', 'Pollinator gardens', 'Fragrance', 'Dried arrangements'],
    tips: [
      'Prune after flowering to keep a tidy shape and prevent woodiness.',
      'Lavender attracts bees and butterflies — great for pollinator gardens.',
      'Dry harvested stems by hanging small bundles upside down in a dark, airy spot.',
    ],
    image:
      'https://images.pexels.com/photos/7782167/pexels-photo-7782167.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Lavender has been used for 2,500 years — ancient Romans used it in baths, and its name comes from "lavare," meaning "to wash."',
  },
  {
    id: 'rose',
    name: 'Garden Rose',
    scientificName: 'Rosa rubiginosa',
    category: ['flowering', 'outdoor'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Rich, well-draining loamy soil',
    temperature: '40-85°F (4-29°C)',
    difficulty: 'Intermediate',
    tagline: 'The timeless garden icon',
    summary:
      'The world\u2019s most beloved flowering shrub, with fragrant blooms in countless colors. A garden centerpiece for centuries.',
    care: {
      watering:
        'Water deeply once or twice a week, soaking the root zone. Avoid wetting the leaves to prevent disease.',
      sunlight:
        'Needs at least 6 hours of direct sun daily for abundant blooms.',
      soil:
        'Plant in rich, well-draining loam with compost. Slightly acidic pH (6.0-6.5) is ideal.',
      temperature:
        'Hardy across a wide range (40-85°F). Winter-hardy varieties survive freezes with mulch protection.',
      humidity:
        'Moderate humidity is fine. High humidity with poor airflow promotes black spot and mildew.',
      fertilizing:
        'Feed in early spring and again mid-summer with a rose-specific fertilizer.',
    },
    growth: {
      matureSize: '3-8 ft tall and wide depending on variety',
      growthRate: 'Moderate to fast',
      lifespan: '15-35+ years',
      bloomTime: 'Late spring through fall — continuous with deadheading',
    },
    commonProblems: [
      { problem: 'Black spot disease', cause: 'Fungal infection in humid conditions', solution: 'Improve airflow by pruning, water at the base (not leaves), and apply a fungicide if needed.' },
      { problem: 'Aphids on new growth', cause: 'Pest infestation', solution: 'Spray with a strong jet of water or insecticidal soap. Ladybirds are natural predators.' },
      { problem: 'Powdery mildew', cause: 'High humidity and poor airflow', solution: 'Improve spacing and airflow, and apply a fungicide if severe.' },
    ],
    goodFor: ['Outdoor gardens', 'Cottage gardens', 'Cut flowers', 'Fragrance'],
    tips: [
      'Prune in late winter or early spring to remove dead wood and shape the plant.',
      'Mulch around the base to retain moisture and suppress weeds.',
      'Deadhead spent blooms to encourage continuous flowering.',
    ],
    image:
      'https://images.pexels.com/photos/1233418/pexels-photo-1233418.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Roses are one of the oldest cultivated flowers — fossil evidence shows roses existed 35 million years ago.',
  },
  {
    id: 'orchid',
    name: 'Phalaenopsis Orchid',
    scientificName: 'Phalaenopsis amabilis',
    category: ['flowering', 'indoor', 'tropical'],
    environment: 'Indoor',
    sunlight: 'Medium',
    watering: 'Low',
    soil: 'Orchid bark mix (not regular soil)',
    temperature: '65-80°F (18-27°C)',
    difficulty: 'Intermediate',
    tagline: 'Elegant long-lasting indoor blooms',
    summary:
      'The "moth orchid" — one of the easiest orchids to grow indoors, with elegant arching sprays of flowers that last for months.',
    care: {
      watering:
        'Water once a week by running water through the bark, then let it drain fully. Never let roots sit in water.',
      sunlight:
        'Prefers bright, indirect light. An east-facing window is ideal. Direct sun burns the leaves.',
      soil:
        'Do not use regular soil. Plant in a coarse orchid bark mix that allows airflow to roots.',
      temperature:
        'Comfortable in 65-80°F. A drop to 60°F at night for a few weeks helps trigger reblooming.',
      humidity:
        'Needs 50-70% humidity. Use a humidity tray or humidifier.',
      fertilizing:
        'Feed monthly with a balanced fertilizer diluted to quarter strength.',
    },
    growth: {
      matureSize: '1-2 ft tall with flower spikes',
      growthRate: 'Slow',
      lifespan: '10-15 years with proper care',
      bloomTime: 'Flowers last 2-4 months; typically blooms once or twice per year',
    },
    commonProblems: [
      { problem: 'Bud drop', cause: 'Temperature changes, drafts, or overwatering', solution: 'Keep in a stable environment away from drafts, vents, and ripening fruit (ethylene gas).' },
      { problem: 'Wrinkled, silvery roots', cause: 'Underwatering', solution: 'Water more regularly — healthy roots are green and plump.' },
      { problem: 'Crown rot', cause: 'Water sitting in the center where leaves meet', solution: 'Never let water sit in the crown. Water the bark, not from the top.' },
    ],
    goodFor: ['Indoor blooms', 'Gifts', 'Bright bathrooms', 'Elegant decor'],
    tips: [
      'After flowers drop, cut the spike above a node to encourage reblooming.',
      'Roots that are green are hydrated; silvery roots mean it is time to water.',
      'Never let water sit in the crown where leaves meet — it causes crown rot.',
    ],
    image:
      'https://images.pexels.com/photos/34205551/pexels-photo-34205551.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'The orchid family is the largest flowering plant family on Earth, with over 28,000 species.',
  },
  {
    id: 'hibiscus',
    name: 'Hibiscus',
    scientificName: 'Hibiscus rosa-sinensis',
    category: ['flowering', 'outdoor', 'tropical'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Rich, well-draining soil',
    temperature: '60-90°F (15-32°C)',
    difficulty: 'Intermediate',
    tagline: 'Tropical trumpet blooms in bold colors',
    summary:
      'A tropical shrub producing huge, trumpet-shaped flowers in red, pink, orange, and yellow. Each bloom lasts only a day but plants flower continuously.',
    care: {
      watering:
        'Water deeply 2-3 times per week. Keep soil consistently moist but not soggy. Container plants may need daily watering in heat.',
      sunlight:
        'Needs full sun — at least 6 hours of direct light for abundant blooms.',
      soil:
        'Use rich, well-draining soil with compost. Slightly acidic pH is preferred.',
      temperature:
        'Loves heat — 60-90°F. Bring indoors before frost; hibiscus cannot tolerate freezing.',
      humidity:
        'Prefers moderate to high humidity. Mist in dry climates.',
      fertilizing:
        'Feed every 2 weeks during the growing season with a high-potassium fertilizer for blooms.',
    },
    growth: {
      matureSize: '4-10 ft tall and wide outdoors',
      growthRate: 'Fast',
      lifespan: '10+ years',
      bloomTime: 'Spring through fall — continuous flowers in warm weather',
    },
    commonProblems: [
      { problem: 'Yellowing leaves', cause: 'Overwatering, nutrient deficiency, or pest stress', solution: 'Check drainage, reduce watering if soil is soggy, and feed with a balanced fertilizer.' },
      { problem: 'Bud drop', cause: 'Temperature stress, drought, or insect damage', solution: 'Keep watering consistent and protect from sudden temperature changes.' },
      { problem: 'Aphids and whiteflies', cause: 'Pest infestation on new growth', solution: 'Spray with insecticidal soap or neem oil and check regularly.' },
    ],
    goodFor: ['Outdoor gardens', 'Tropical landscapes', 'Containers', 'Hedges'],
    tips: [
      'Each hibiscus flower lasts only one day, but a healthy plant produces new blooms daily.',
      'Prune in early spring to control size and encourage bushier growth.',
      'Hibiscus flowers are edible and used in teas worldwide.',
    ],
    image:
      'https://images.pexels.com/photos/17009331/pexels-photo-17009331.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Hibiscus is the national flower of Malaysia and appears on the country\u2019s coins and currency.',
  },
  {
    id: 'jasmine',
    name: 'Jasmine',
    scientificName: 'Jasminum officinale',
    category: ['flowering', 'outdoor', 'tropical'],
    environment: 'Outdoor',
    sunlight: 'Bright',
    watering: 'Moderate',
    soil: 'Rich, well-draining soil',
    temperature: '60-85°F (15-29°C)',
    difficulty: 'Intermediate',
    tagline: 'Intoxicating fragrance under moonlight',
    summary:
      'A climbing vine with delicate white, star-shaped flowers that release their sweet fragrance in the evening. Classic for trellises and pergolas.',
    care: {
      watering:
        'Water when the top inch of soil is dry — 1-2 times per week. Keep soil moist but not soggy.',
      sunlight:
        'Prefers full sun to partial shade — at least 4-6 hours of bright light for best blooming.',
      soil:
        'Use rich, well-draining soil with compost. Tolerates various soil types if drainage is good.',
      temperature:
        'Comfortable in 60-85°F. Some varieties tolerate frost; tropical jasmine needs protection below 40°F.',
      humidity:
        'Prefers moderate to high humidity. Mist in dry conditions.',
      fertilizing:
        'Feed monthly during the growing season with a high-phosphorus fertilizer to encourage blooms.',
    },
    growth: {
      matureSize: 'Vines 10-15 ft long',
      growthRate: 'Fast',
      lifespan: '10+ years',
      bloomTime: 'Late spring to fall — white flowers open in evening',
    },
    commonProblems: [
      { problem: 'No flowers', cause: 'Insufficient light or too much nitrogen', solution: 'Move to a sunnier spot and switch to a high-phosphorus fertilizer.' },
      { problem: 'Yellowing leaves', cause: 'Overwatering or poor drainage', solution: 'Improve drainage and water only when the top inch of soil is dry.' },
      { problem: 'Pests (spider mites)', cause: 'Dry, dusty conditions', solution: 'Mist regularly to increase humidity and spray with neem oil if infestation occurs.' },
    ],
    goodFor: ['Trellises', 'Pergolas', 'Fragrance gardens', 'Moon gardens'],
    tips: [
      'Jasmine flowers open at night and release their strongest fragrance in the evening.',
      'Prune after flowering to control size and remove old or tangled growth.',
      'Jasmine tea is made from Jasminum sambac flowers.',
    ],
    image:
      'https://images.pexels.com/photos/54608/flower-jasmine-bush-white-54608.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Jasmine flowers open at dusk and release their fragrance at night to attract nocturnal moths for pollination.',
  },
  {
    id: 'marigold',
    name: 'Marigold',
    scientificName: 'Tagetes erecta',
    category: ['flowering', 'outdoor', 'easy-care'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Well-draining garden soil',
    temperature: '60-85°F (15-29°C)',
    difficulty: 'Beginner',
    tagline: 'Cheerful golden blooms that repel pests',
    summary:
      'A bright, easy-to-grow annual with pompon-like flowers in shades of orange, yellow, and red. Companion plant that deters garden pests.',
    care: {
      watering:
        'Water when the top inch of soil is dry — about once a week. Marigolds tolerate some drought once established.',
      sunlight:
        'Needs full sun — at least 6 hours of direct light daily for best blooming.',
      soil:
        'Plant in well-draining garden soil. Tolerates poor soil but blooms better with compost.',
      temperature:
        'Prefers warm conditions, 60-85°F. Sensitive to frost — plant after the last frost date.',
      humidity:
        'Tolerates most humidity levels. Good airflow prevents fungal issues.',
      fertilizing:
        'Feed monthly with a balanced fertilizer, or skip entirely — marigolds bloom fine in average soil.',
    },
    growth: {
      matureSize: '6 in to 3 ft tall depending on variety',
      growthRate: 'Fast — blooms 6-8 weeks from seed',
      lifespan: 'One growing season (annual)',
      bloomTime: 'Spring through frost — continuous bloom',
    },
    commonProblems: [
      { problem: 'Powdery mildew', cause: 'High humidity and poor airflow', solution: 'Space plants properly and avoid overhead watering.' },
      { problem: 'Spider mites', cause: 'Hot, dry conditions', solution: 'Spray with water to dislodge mites and maintain adequate soil moisture.' },
      { problem: 'No blooms', cause: 'Too much shade or excessive nitrogen', solution: 'Move to full sun and use a lower-nitrogen fertilizer.' },
    ],
    goodFor: ['Beginners', 'Companion planting', 'Borders', 'Pest deterrent'],
    tips: [
      'Plant marigolds near tomatoes and vegetables — they repel nematodes and whiteflies.',
      'Deadhead spent blooms to keep the plant flowering continuously.',
      'Marigolds are easy to grow from seed — direct sow after the last frost.',
    ],
    image:
      'https://images.pexels.com/photos/14304115/pexels-photo-14304115.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Marigolds are used in Day of the Dead celebrations in Mexico — their bright color and strong scent are believed to guide spirits home.',
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    scientificName: 'Helianthus annuus',
    category: ['flowering', 'outdoor', 'edible'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Well-draining soil',
    temperature: '70-85°F (21-29°C)',
    difficulty: 'Beginner',
    tagline: 'The sun-tracking giant of summer',
    summary:
      'An iconic summer annual with large, golden flower heads that track the sun. Fast-growing and produces edible seeds.',
    care: {
      watering:
        'Water deeply once a week. Established sunflowers are drought-tolerant but consistent watering produces the largest flowers.',
      sunlight:
        'Needs full sun — at least 6-8 hours of direct light. Sunflowers literally follow the sun across the sky.',
      soil:
        'Plant in well-draining soil. Tolerates poor soil but grows tallest in rich, amended soil.',
      temperature:
        'Prefers warm conditions, 70-85°F. Sensitive to frost — sow after the last frost date.',
      humidity:
        'Tolerates most humidity levels.',
      fertilizing:
        'Feed once with a balanced fertilizer at planting. Too much nitrogen produces tall, weak stems.',
    },
    growth: {
      matureSize: '3-12 ft tall depending on variety',
      growthRate: 'Very fast — can grow several inches per day',
      lifespan: 'One growing season (annual)',
      bloomTime: 'Mid-summer to early fall',
    },
    commonProblems: [
      { problem: 'Stem falling over', cause: 'Wind or weak stem from too much nitrogen', solution: 'Stake tall varieties and reduce nitrogen fertilizer.' },
      { problem: 'Birds eating seeds', cause: 'Birds attracted to maturing seed heads', solution: 'Cover seed heads with netting or paper bags as they mature.' },
      { problem: 'Squirrels and rodents', cause: 'Animals digging up planted seeds', solution: 'Plant seeds deeper and cover with netting until sprouted.' },
    ],
    goodFor: ['Beginners', 'Children\u2019s gardens', 'Cut flowers', 'Edible seeds'],
    tips: [
      'Sunflowers exhibit heliotropism — young flower heads follow the sun east to west each day.',
      'Save mature seed heads for bird feeders or roast the seeds for a snack.',
      'Plant in rows along fences or use as a natural privacy screen.',
    ],
    image:
      'https://images.pexels.com/photos/33198389/pexels-photo-33198389.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Young sunflower heads track the sun across the sky (heliotropism), but once the flower matures it faces east permanently to attract pollinators.',
  },
  {
    id: 'gerbera',
    name: 'Gerbera Daisy',
    scientificName: 'Gerbera jamesonii',
    category: ['flowering', 'outdoor', 'indoor'],
    environment: 'Both',
    sunlight: 'Bright',
    watering: 'Moderate',
    soil: 'Well-draining, slightly acidic soil',
    temperature: '60-75°F (15-24°C)',
    difficulty: 'Intermediate',
    tagline: 'Bold daisy blooms in vivid colors',
    summary:
      'A cheerful flowering plant with large, daisy-like blooms in vibrant shades of red, orange, pink, yellow, and white. Popular for cut flowers.',
    care: {
      watering:
        'Water when the top inch of soil is dry. Water at the base — avoid wetting the crown to prevent crown rot.',
      sunlight:
        'Needs bright light — full sun to partial shade. In hot climates, afternoon shade prevents wilting.',
      soil:
        'Use well-draining, slightly acidic soil rich in organic matter.',
      temperature:
        'Prefers 60-75°F. Not frost-tolerant — bring indoors or treat as annual in cold climates.',
      humidity:
        'Moderate humidity is ideal. Good airflow prevents fungal issues.',
      fertilizing:
        'Feed every 2 weeks during the growing season with a bloom-boosting fertilizer.',
    },
    growth: {
      matureSize: '12-18 in tall and wide',
      growthRate: 'Moderate',
      lifespan: '2-3 years, often grown as annual',
      bloomTime: 'Spring through fall — continuous in cool weather',
    },
    commonProblems: [
      { problem: 'Crown rot', cause: 'Water sitting at the base of the plant', solution: 'Plant slightly above soil level and water at the base, keeping the crown dry.' },
      { problem: 'Powdery mildew', cause: 'High humidity and poor airflow', solution: 'Improve spacing and airflow and avoid overhead watering.' },
      { problem: 'Few or no blooms', cause: 'Insufficient light', solution: 'Move to a brighter spot with at least 6 hours of light.' },
    ],
    goodFor: ['Cut flowers', 'Containers', 'Borders', 'Colorful displays'],
    tips: [
      'Gerberas are the fifth most popular cut flower in the world.',
      'Deadhead spent blooms to encourage continuous flowering.',
      'In cold climates, grow as an annual or dig up and store for winter.',
    ],
    image:
      'https://images.pexels.com/photos/15784568/pexels-photo-15784568.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Gerbera daisies are among the top five most popular cut flowers in the world, alongside roses, carnations, chrysanthemums, and tulips.',
  },
  {
    id: 'petunia',
    name: 'Petunia',
    scientificName: 'Petunia × hybrida',
    category: ['flowering', 'outdoor'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Well-draining potting or garden soil',
    temperature: '60-80°F (15-27°C)',
    difficulty: 'Beginner',
    tagline: 'Trumpet-shaped blooms in every color',
    summary:
      'A prolific bloomer with trumpet-shaped flowers in nearly every color. Perfect for hanging baskets, window boxes, and garden borders.',
    care: {
      watering:
        'Water when the top inch of soil is dry — daily in hot weather for container plants. Do not let containers dry out completely.',
      sunlight:
        'Needs full sun — at least 6 hours of direct light for best blooming.',
      soil:
        'Use well-draining potting or garden soil. Add compost for richer blooms.',
      temperature:
        'Prefers 60-80°F. Heat-tolerant but may slow blooming in extreme heat. Not frost-tolerant.',
      humidity:
        'Tolerates most humidity levels. Good airflow prevents disease.',
      fertilizing:
        'Feed every 2 weeks with a water-soluble bloom fertilizer for continuous flowering.',
    },
    growth: {
      matureSize: '6-18 in tall, spreading 1-3 ft depending on variety',
      growthRate: 'Fast',
      lifespan: 'One growing season (annual)',
      bloomTime: 'Spring through frost — continuous with deadheading',
    },
    commonProblems: [
      { problem: 'Leggy growth', cause: 'Insufficient light or not pruning', solution: 'Cut back stems by half mid-season to rejuvenate and encourage bushier growth.' },
      { problem: 'Flowers close in daytime', cause: 'Older varieties close at night or in cloudy weather', solution: 'Choose newer "day bloom" or self-cleaning varieties that stay open.' },
      { problem: 'Botrytis blight', cause: 'Fungal infection in wet, humid conditions', solution: 'Remove affected flowers and improve airflow and drainage.' },
    ],
    goodFor: ['Hanging baskets', 'Window boxes', 'Containers', 'Borders'],
    tips: [
      'Deadhead regularly to keep blooms coming — or choose self-cleaning varieties.',
      'Trailing petunias (like "Wave" series) spread up to 3 ft and need no deadheading.',
      'Cut back by half in mid-summer if plants become leggy — they will regrow and rebloom.',
    ],
    image:
      'https://images.pexels.com/photos/23947968/pexels-photo-23947968.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Petunias are related to tomatoes, peppers, and tobacco — all members of the nightshade family (Solanaceae).',
  },
  {
    id: 'bougainvillea',
    name: 'Bougainvillea',
    scientificName: 'Bougainvillea spectabilis',
    category: ['flowering', 'outdoor', 'tropical'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Low',
    soil: 'Well-draining, slightly acidic soil',
    temperature: '60-100°F (15-38°C)',
    difficulty: 'Intermediate',
    tagline: 'Explosive color that loves the heat',
    summary:
      'A vigorous climbing vine covered in brilliant magenta, pink, orange, or white "flowers" — actually colorful modified leaves called bracts.',
    care: {
      watering:
        'Water when soil is fairly dry. Bougainvillea blooms best when slightly stressed — overwatering produces leaves but few blooms.',
      sunlight:
        'Needs full sun — at least 6 hours of direct, hot light. The more sun, the more blooms.',
      soil:
        'Plant in well-draining, slightly acidic soil. Tolerates poor, sandy soil. Does not like wet feet.',
      temperature:
        'Loves heat — 60-100°F. Not frost-tolerant. In cold climates, grow in containers and bring indoors.',
      humidity:
        'Tolerates dry air and coastal conditions well.',
      fertilizing:
        'Feed lightly in spring with a bloom-boosting fertilizer. Too much nitrogen produces leaves instead of flowers.',
    },
    growth: {
      matureSize: 'Vines 10-30 ft or more',
      growthRate: 'Fast',
      lifespan: '20+ years',
      bloomTime: 'Spring through fall — continuous in warm climates',
    },
    commonProblems: [
      { problem: 'All leaves, no flowers', cause: 'Overwatering or too much nitrogen', solution: 'Reduce watering to stress the plant slightly and switch to a high-phosphorus fertilizer.' },
      { problem: 'Thorns causing injury', cause: 'Sharp thorns on stems', solution: 'Wear thick gloves when pruning and train on sturdy supports away from walkways.' },
      { problem: 'Wilted leaves', cause: 'Underwatering or transplant shock', solution: 'Water the root zone deeply and give time to recover after transplanting.' },
    ],
    goodFor: ['Trellises', 'Walls', 'Mediterranean gardens', 'Containers'],
    tips: [
      'The colorful "flowers" are actually bracts — modified leaves. The true flowers are tiny white tubes inside.',
      'Bougainvillea blooms best when slightly stressed — do not overwater or over-fertilize.',
      'Wear gloves when pruning — the thorns are sharp and numerous.',
    ],
    image:
      'https://images.pexels.com/photos/8840233/pexels-photo-8840233.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'The colorful parts of bougainvillea are not petals but bracts — modified leaves evolved to attract pollinators to the tiny true flowers inside.',
  },
  {
    id: 'chrysanthemum',
    name: 'Chrysanthemum',
    scientificName: 'Chrysanthemum morifolium',
    category: ['flowering', 'outdoor'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Rich, well-draining soil',
    temperature: '55-75°F (13-24°C)',
    difficulty: 'Intermediate',
    tagline: 'The autumn bloom queen',
    summary:
      'The quintessential fall flower, with dense pompom or daisy-shaped blooms in white, yellow, pink, orange, and burgundy. A late-season garden staple.',
    care: {
      watering:
        'Water when the top inch of soil is dry — about 2-3 times per week. Keep soil evenly moist but not soggy.',
      sunlight:
        'Needs full sun — at least 6 hours of direct light for abundant blooms.',
      soil:
        'Plant in rich, well-draining soil with compost. Slightly acidic to neutral pH.',
      temperature:
        'Prefers cool conditions, 55-75°F. Blooms are triggered by shorter day length in fall.',
      humidity:
        'Moderate humidity. Good airflow prevents fungal diseases.',
      fertilizing:
        'Feed monthly from spring through summer with a balanced fertilizer. Stop when buds form.',
    },
    growth: {
      matureSize: '1-3 ft tall and wide',
      growthRate: 'Moderate',
      lifespan: '3-5 years (perennial in mild climates, annual in cold)',
      bloomTime: 'Late summer through fall',
    },
    commonProblems: [
      { problem: 'No fall blooms', cause: 'Street lights or porch lights interrupting dark period', solution: 'Plant away from nighttime light sources — mums need long dark nights to bloom.' },
      { problem: 'Aphids and leaf miners', cause: 'Pest infestation', solution: 'Spray with insecticidal soap and remove affected leaves.' },
      { problem: 'Powdery mildew', cause: 'High humidity and poor airflow', solution: 'Space plants properly and avoid overhead watering.' },
    ],
    goodFor: ['Fall gardens', 'Containers', 'Cut flowers', 'Gifts'],
    tips: [
      'Pinch back stems 2-3 times before mid-July for bushier plants with more blooms.',
      'Mums are photoperiodic — they bloom when nights get longer in fall.',
      'In cold climates, mulch heavily to help mums survive winter as perennials.',
    ],
    image:
      'https://images.pexels.com/photos/30044328/pexels-photo-30044328.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Chrysanthemums are the official flower of November and the symbol of the Japanese imperial family.',
  },
  {
    id: 'dahlia',
    name: 'Dahlia',
    scientificName: 'Dahlia pinnata',
    category: ['flowering', 'outdoor'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Rich, well-draining soil',
    temperature: '60-80°F (15-27°C)',
    difficulty: 'Intermediate',
    tagline: 'Spectacular blooms from dinner-plate to pompon',
    summary:
      'A diverse flowering plant with blooms ranging from tiny pompons to 10-inch "dinner plate" flowers. Stunning cut flowers in a vast color range.',
    care: {
      watering:
        'Water deeply 2-3 times per week. Keep soil consistently moist but not soggy. Container plants need more frequent watering.',
      sunlight:
        'Needs full sun — at least 6-8 hours of direct light for best blooms.',
      soil:
        'Plant in rich, well-draining soil with compost. Slightly acidic pH (6.5-7.0) is ideal.',
      temperature:
        'Prefers 60-80°F. Not frost-tolerant — dig up tubers after first frost in cold climates.',
      humidity:
        'Moderate humidity. Good airflow prevents disease.',
      fertilizing:
        'Feed every 2 weeks with a low-nitrogen, bloom-boosting fertilizer during the growing season.',
    },
    growth: {
      matureSize: '2-5 ft tall depending on variety',
      growthRate: 'Fast',
      lifespan: 'Tubers can be stored and replanted for many years',
      bloomTime: 'Mid-summer through first frost',
    },
    commonProblems: [
      { problem: 'Tuber rot', cause: 'Wet, cold soil over winter', solution: 'Dig up tubers after first frost, dry them, and store in a cool, dry place for winter.' },
      { problem: 'Earwigs and slugs', cause: 'Pests eating petals and leaves', solution: 'Set out slug traps and keep the area around plants clean.' },
      { problem: 'No blooms', cause: 'Insufficient light or too much nitrogen', solution: 'Ensure 6+ hours of sun and switch to a bloom fertilizer.' },
    ],
    goodFor: ['Cut flowers', 'Show gardens', 'Containers', 'Borders'],
    tips: [
      'Stake tall varieties early — dahlias can topple under the weight of their blooms.',
      'Pinch the center shoot when plants are 1 ft tall for bushier growth and more blooms.',
      'Dig up tubers in fall in cold climates and store in a cool, dry place for replanting.',
    ],
    image:
      'https://images.pexels.com/photos/27965195/pexels-photo-27965195.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Dahlias belong to the same family as sunflowers, daisies, and chrysanthemums (Asteraceae) and were cultivated by the Aztecs as a food crop.',
  },
  {
    id: 'carnation',
    name: 'Carnation',
    scientificName: 'Dianthus caryophyllus',
    category: ['flowering', 'outdoor'],
    environment: 'Outdoor',
    sunlight: 'Direct',
    watering: 'Moderate',
    soil: 'Well-draining, slightly alkaline soil',
    temperature: '50-75°F (10-24°C)',
    difficulty: 'Beginner',
    tagline: 'Fringed blooms with clove fragrance',
    summary:
      'A classic cut flower with ruffled, fringed petals and a spicy clove-like fragrance. Long-lasting blooms in white, pink, red, and bi-colors.',
    care: {
      watering:
        'Water when the top inch of soil is dry — about once or twice a week. Do not overwater.',
      sunlight:
        'Needs full sun — at least 6 hours of direct light daily.',
      soil:
        'Plant in well-draining, slightly alkaline soil (pH 6.7-7.0). Add lime if soil is acidic.',
      temperature:
        'Prefers cool to moderate temperatures, 50-75°F. Tolerates light frost.',
      humidity:
        'Moderate humidity. Good airflow prevents fungal disease.',
      fertilizing:
        'Feed monthly with a balanced fertilizer during the growing season.',
    },
    growth: {
      matureSize: '12-24 in tall',
      growthRate: 'Moderate',
      lifespan: '2-5 years (perennial in mild climates)',
      bloomTime: 'Late spring through summer — reblooms with deadheading',
    },
    commonProblems: [
      { problem: 'Stem rot at soil line', cause: 'Fungal infection (Fusarium)', solution: 'Improve drainage, avoid overwatering, and rotate planting locations.' },
      { problem: 'Few blooms', cause: 'Insufficient light or overcrowding', solution: 'Plant in full sun and space 8-12 inches apart for airflow.' },
      { problem: 'Yellowing foliage', cause: 'Overwatering or poor drainage', solution: 'Water less frequently and ensure soil drains well.' },
    ],
    goodFor: ['Cut flowers', 'Borders', 'Containers', 'Fragrance gardens'],
    tips: [
      'Carnations can last 2-3 weeks as cut flowers — one of the longest-lasting blooms.',
      'Deadhead spent flowers to encourage repeat blooming.',
      'The spicy clove scent is strongest in warm, sunny weather.',
    ],
    image:
      'https://images.pexels.com/photos/11883994/pexels-photo-11883994.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Carnations are the official flower of Mother\u2019s Day — pink carnations specifically symbolize a mother\u2019s undying love.',
  },
  {
    id: 'gardenia',
    name: 'Gardenia',
    scientificName: 'Gardenia jasminoides',
    category: ['flowering', 'outdoor', 'indoor', 'tropical'],
    environment: 'Both',
    sunlight: 'Bright',
    watering: 'Moderate',
    soil: 'Acidic, well-draining soil',
    temperature: '65-75°F (18-24°C)',
    difficulty: 'Experienced',
    tagline: 'Intoxicating fragrance with creamy white blooms',
    summary:
      'An evergreen shrub with glossy leaves and creamy white, rose-like flowers that fill the air with one of the most powerful sweet fragrances in the plant world.',
    care: {
      watering:
        'Keep soil consistently moist but not soggy. Water when the top inch is dry. Use acidic or rainwater if possible.',
      sunlight:
        'Prefers bright light with some direct morning sun. In hot climates, afternoon shade prevents leaf scorch.',
      soil:
        'Needs acidic soil (pH 5.0-6.0) rich in organic matter. Use an acid-loving plant mix.',
      temperature:
        'Prefers 65-75°F. dislikes extreme heat or cold. Indoor plants need stable temperatures.',
      humidity:
        'Needs high humidity. Mist daily or use a humidifier, especially indoors.',
      fertilizing:
        'Feed monthly during the growing season with an acid-loving plant fertilizer.',
    },
    growth: {
      matureSize: '2-8 ft tall and wide depending on variety',
      growthRate: 'Slow to moderate',
      lifespan: '10+ years',
      bloomTime: 'Late spring through summer — sporadic blooms year-round indoors',
    },
    commonProblems: [
      { problem: 'Bud drop', cause: 'Temperature fluctuations, low humidity, or overwatering', solution: 'Maintain stable temperature, increase humidity, and water consistently.' },
      { problem: 'Yellowing leaves with green veins', cause: 'Iron deficiency (chlorosis)', solution: 'Apply an iron supplement and acidify the soil with elemental sulfur.' },
      { problem: 'Sooty mold on leaves', cause: 'Honeydew from aphids or whiteflies', solution: 'Control the insect infestation and wipe leaves clean with soapy water.' },
    ],
    goodFor: ['Fragrance gardens', 'Containers', 'Hedges', 'Gifts'],
    tips: [
      'Gardenias are demanding but worth it — the fragrance is among the most prized in perfumery.',
      'Use acidic fertilizer to prevent yellowing from iron deficiency.',
      'Indoor gardenias need high humidity — place on a pebble tray with water.',
    ],
    image:
      'https://images.pexels.com/photos/1252619/pexels-photo-1252619.jpeg?auto=compress&cs=tinysrgb&w=900',
    funFact:
      'Gardenia flowers are used in traditional Chinese medicine and were the favorite flower of Sigmund Freud.',
  },
];
