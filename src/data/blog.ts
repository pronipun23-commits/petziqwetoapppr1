export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  body: string[];
  category: 'pets' | 'plants' | 'care' | 'general';
  author: string;
  date: string;
  readTime: string;
  image: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'choosing-the-right-pet-for-your-lifestyle',
    title: 'Choosing the Right Pet for Your Lifestyle',
    excerpt:
      'A practical guide to matching your daily routine, living space, and personality with the perfect animal companion.',
    body: [
      'Bringing a pet into your life is one of the most rewarding decisions you can make, but it comes with real responsibility. The key to a happy relationship is matching your lifestyle with the needs of the animal.',
      'Start by honestly assessing your daily routine. Do you work long hours away from home? A high-energy dog that needs two walks a day may not be the right fit. Cats, on the other hand, are more independent and can thrive in apartments as long as they have enrichment and interaction when you are around.',
      'Consider your living space. Small mammals like hamsters and guinea pigs need surprisingly modest space but still require proper enclosures and daily care. Reptiles need carefully controlled environments with specific heat and humidity gradients. Fish tanks may seem simple, but they require consistent water parameter management.',
      'Think about the long term. A dog or cat can live 15+ years. Some birds and reptiles can live even longer. Are you prepared for that commitment through life changes like moving, career shifts, or starting a family? Planning ahead prevents heartbreak later.',
      'Finally, consider your experience level. First-time keepers benefit from species that are forgiving of beginner mistakes. As you gain confidence, you can explore more specialized animals. The Petziq breed explorer helps you compare temperament, care difficulty, and space requirements side by side.',
    ],
    category: 'pets',
    author: 'Petziq Team',
    date: '2026-07-15',
    readTime: '5 min',
    image:
      'https://images.pexels.com/photos/7788657/pexels-photo-7788657.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'watering-your-houseplants-without-overdoing-it',
    title: 'Watering Your Houseplants Without Overdoing It',
    excerpt:
      'Overwatering is the number one cause of houseplant death. Learn the simple techniques to get it right every time.',
    body: [
      'If there is one mistake that kills more houseplants than any other, it is overwatering. Roots need oxygen just as much as they need water, and soggy soil suffocates them, leading to root rot.',
      'The golden rule: check before you water. Push your finger about an inch into the soil. If it feels moist, wait. For larger pots, a moisture meter takes the guesswork out of the process. Different plants have different needs — a snake plant can go weeks between waterings, while a peace lily will droop dramatically when thirsty.',
      'Water deeply rather than frequently. A thorough soak until water runs from the drainage holes encourages roots to grow deeper and stronger. Shallow, frequent watering keeps roots near the surface and makes the plant less resilient.',
      'Always use pots with drainage holes. Without them, excess water has nowhere to go and the roots sit in a pool. If you have a decorative pot without drainage, use it as a cachepot — place a plastic nursery pot inside it and remove it to water over a sink.',
      'Seasonal adjustments matter. Most houseplants grow actively in spring and summer and need more water. In fall and winter, growth slows and watering should decrease. The Petziq plant profiles include specific watering guidance for each species to help you build the right routine.',
    ],
    category: 'plants',
    author: 'Petziq Team',
    date: '2026-07-20',
    readTime: '4 min',
    image:
      'https://images.pexels.com/photos/1084197/pexels-photo-1084197.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'building-a-care-routine-that-sticks',
    title: 'Building a Care Routine That Actually Sticks',
    excerpt:
      'Consistency is the secret to healthy pets and plants. Here is how to build habits that last using simple reminders.',
    body: [
      'The difference between a thriving pet or plant and one that merely survives usually comes down to consistency. Feeding, watering, cleaning, and health checks all need to happen on a regular schedule — and that is exactly where most people struggle.',
      'Start with a single anchor habit. Pick one care task that you already do reliably, like making morning coffee, and attach a pet or plant care task to it. Watering the plants after your morning coffee or checking the cat\'s food bowl before you sit down to work creates a natural connection.',
      'Use reminders strategically. Petziq lets you create one-time or repeating reminders for any care task. Set them for watering schedules, feeding times, vet appointments, grooming, and medication. The dashboard shows what is due today so you never lose track.',
      'Batch related tasks. Instead of checking on one plant at a time, do a weekly "plant round" where you check all your plants at once. This takes 10 minutes and catches problems early — a drooping leaf or a pest issue is much easier to fix when you catch it right away.',
      'Review and adjust monthly. Plants need less water in winter. Pets may need different food as they age. Set a monthly reminder to review your care schedule and make adjustments. A routine that worked in July may need tweaking by October.',
    ],
    category: 'care',
    author: 'Petziq Team',
    date: '2026-07-25',
    readTime: '6 min',
    image:
      'https://images.pexels.com/photos/4226256/pexels-photo-4226256.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'understanding-your-dogs-body-language',
    title: 'Understanding Your Dog\'s Body Language',
    excerpt:
      'Dogs communicate constantly through posture, ears, tail, and eyes. Learn to read the signals they are sending.',
    body: [
      'Dogs are master communicators, but most of what they say is unspoken. Understanding body language helps you respond appropriately and strengthens the bond between you and your dog.',
      'A wagging tail does not always mean a happy dog. A loose, full-body wag with a relaxed posture usually signals friendliness. A stiff, rapid wag with a rigid body can signal agitation or arousal. Context and the rest of the body matter more than the tail alone.',
      'Watch the ears. Forward-facing ears show interest and alertness. Pinned-back ears can indicate fear, anxiety, or submission. Combined with other signals like lip licking or yawning, they tell you your dog may be uncomfortable with the situation.',
      'Eye contact is powerful. Soft, relaxed eyes with a slightly open mouth mean your dog is calm. A hard stare can be a challenge or warning. Whale eye — when you can see the whites of the eyes — often signals stress or anxiety. If you see it, give your dog space.',
      'Calming signals like lip licking, yawning, turning away, and sniffing the ground are your dog\'s way of self-soothing and communicating discomfort. Respecting these signals builds trust. Forcing a dog into a situation they are trying to avoid can escalate to more serious warnings.',
    ],
    category: 'pets',
    author: 'Petziq Team',
    date: '2026-07-30',
    readTime: '5 min',
    image:
      'https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'low-light-plants-that-actually-thrive',
    title: 'Low-Light Plants That Actually Thrive',
    excerpt:
      'Not every home has sunny windows. These resilient species flourish in dim corners and north-facing rooms.',
    body: [
      'If your home lacks bright, south-facing windows, you are not doomed to a plant-free space. Several species have evolved in the understory of forests, where light is filtered and indirect — making them perfect for dimmer rooms.',
      'The snake plant (Sansevieria) is nearly indestructible. It tolerates low light, irregular watering, and neglect. Its upright, architectural leaves add structure to any room, and it is one of the best air-purifying plants available.',
      'Pothos is the classic low-light champion. Its trailing vines can grow several feet long even in modest light, and it tells you clearly when it needs water — the leaves droop noticeably and perk back up within hours of a drink.',
      'The ZZ plant stores water in thick rhizomes, meaning it can go weeks between waterings and handles low light with ease. Its glossy, dark green leaves look lush even in a dim corner. Just keep it away from pets, as it is toxic if ingested.',
      'The cast iron plant lives up to its name. It was a favorite in dim Victorian parlors and still thrives in low-light, low-humidity environments. Explore the full Petziq plant database to filter by light requirements and find species suited to your specific space.',
    ],
    category: 'plants',
    author: 'Petziq Team',
    date: '2026-08-01',
    readTime: '4 min',
    image:
      'https://images.pexels.com/photos/3094215/pexels-photo-3094215.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'first-vet-visit-what-to-expect',
    title: 'Your Pet\'s First Vet Visit: What to Expect',
    excerpt:
      'A calm, prepared first vet visit sets the tone for a lifetime of stress-free healthcare. Here is how to get it right.',
    body: [
      'The first veterinary visit is a milestone for both you and your new pet. A little preparation goes a long way in making it a positive experience.',
      'Bring any records you received from the breeder, shelter, or rescue. This includes vaccination history, deworming, spay/neuter status, and any prior health concerns. The more your vet knows, the better they can advise you.',
      'Use a secure carrier for cats and small animals. Line it with a familiar-smelling blanket or towel. For dogs, bring a leash and collar or harness. Avoid feeding your pet right before the visit in case motion sickness is an issue.',
      'Expect a thorough physical exam. The vet will check eyes, ears, teeth, skin, heart, lungs, and body condition. They will likely discuss vaccination schedules, parasite prevention, nutrition, and spay or neuter timing.',
      'Come with questions. Write them down beforehand so you do not forget in the moment. Ask about diet, exercise needs, behavior concerns, and what warning signs to watch for. A good vet welcomes an engaged, informed owner.',
    ],
    category: 'care',
    author: 'Petziq Team',
    date: '2026-08-02',
    readTime: '5 min',
    image:
      'https://images.pexels.com/photos/6235265/pexels-photo-6235265.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

export function getBlogPost(id: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.id === id);
}
