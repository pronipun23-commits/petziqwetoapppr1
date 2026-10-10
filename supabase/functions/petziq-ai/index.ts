import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface PetContextItem {
  name?: string;
  species?: string;
  breed?: string | null;
  age?: string | null;
  gender?: string | null;
  animal_taxon_id?: string | null;
}

interface PlantContextItem {
  name?: string;
  species?: string | null;
  care_level?: string | null;
  watering_frequency?: string | null;
  location?: string | null;
}

interface RequestBody {
  messages: ChatMessage[];
  /** Legacy free-text knowledge context (still honored). */
  context?: string;
  /** Saved pets of the authenticated user, sent by the Petziq app. */
  petContext?: PetContextItem[];
  /** Saved plants of the authenticated user, sent by the Petziq app. */
  plantContext?: PlantContextItem[];
}

const SYSTEM_PROMPT = `You are Petziq AI, the care companion inside the Petziq app — a friendly, knowledgeable assistant for pet and plant care. You help with:

- Everyday pet care: routines, hygiene, safety at home, travel basics
- Feeding and nutrition: portions, safe foods, foods to avoid, life-stage feeding
- Grooming: brushing, bathing, nails, coat and skin care
- Exercise and enrichment: daily activity needs, play, mental stimulation
- Behavior: training basics, barking, anxiety, litter/l habits, socialization
- Pet setup and supplies: cages, tanks, litter areas, beds, starter checklists
- Plant care: watering, light, soil, humidity, repotting, common problems
- Choosing a suitable pet for someone's lifestyle, space, budget, and experience
- Choosing suitable plants for someone's light, schedule, and pets (pet-safe options)

How to answer:
- Be warm, clear, and practical. Prefer short paragraphs and bullet points.
- When the user's saved pets or plants are provided in the knowledge context, use them to tailor answers (species, breed, age) and you may use the pet's or plant's name naturally.
- Ask for important missing details (species, age, symptoms, living situation) — briefly.
- Never claim to be a veterinarian or to diagnose. For potentially serious animal-health signs (bleeding, seizures, poisoning, breathing trouble, collapse, not eating over a day, repeated vomiting), give calm general information, then clearly and prominently recommend contacting a qualified veterinarian — urgently when appropriate.
- Privacy: never ask for, repeat, or store private details such as addresses, phone numbers, payment details, or Smart Tag identifiers. Do not reference the user's Smart Tag data at all.
- Do not invent facts. If unsure, say so and suggest a reliable next step (a vet, an exotics specialist, a reputable breeder/plant nursery).
- Keep answers focused: typically 80–180 words unless the user asks for depth.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { messages, context, petContext, plantContext }: RequestBody = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const knowledge = buildKnowledgeContext(context, petContext, plantContext);
    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    if (openaiKey) {
      const systemMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...(knowledge
          ? [{ role: "system", content: `Knowledge context from Petziq (the user's own saved data — use privately, never ask them to repeat it):\n${knowledge.slice(0, 6000)}` }]
          : []),
        ...messages,
      ];

      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: systemMessages,
          max_tokens: 700,
          temperature: 0.7,
        }),
      });

      if (openaiRes.ok) {
        const data = await openaiRes.json();
        const reply = data?.choices?.[0]?.message?.content?.trim();
        if (reply) {
          return new Response(
            JSON.stringify({ reply }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
      } else {
        console.error("OpenAI error:", await openaiRes.text());
      }
    }

    // No key or upstream failure — built-in fallback keeps the assistant useful.
    const reply = generateFallback(messages, knowledge, petContext, plantContext);
    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ reply: "I'm having trouble responding right now. Please try again in a moment." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

/** Compose the private knowledge context from saved pets/plants (+ legacy text). */
function buildKnowledgeContext(
  context: string | undefined,
  petContext: PetContextItem[] | undefined,
  plantContext: PlantContextItem[] | undefined,
): string {
  const parts: string[] = [];
  if (context && context.trim()) parts.push(context.trim());

  if (petContext && petContext.length > 0) {
    const lines = petContext
      .slice(0, 10)
      .map((p) => {
        const bits = [p.species, p.breed, p.age ? `age ${p.age}` : null].filter(Boolean);
        return `- ${p.name || "Unnamed pet"}${bits.length ? `: ${bits.join(", ")}` : ""}`;
      });
    parts.push(`The user's saved pets:\n${lines.join("\n")}`);
  }

  if (plantContext && plantContext.length > 0) {
    const lines = plantContext
      .slice(0, 10)
      .map((p) => {
        const bits = [
          p.species,
          p.watering_frequency ? `watering ${p.watering_frequency}` : null,
          p.location ? `located ${p.location}` : null,
        ].filter(Boolean);
        return `- ${p.name || "Unnamed plant"}${bits.length ? `: ${bits.join(", ")}` : ""}`;
      });
    parts.push(`The user's saved plants:\n${lines.join("\n")}`);
  }

  return parts.join("\n\n");
}

function summarizePets(petContext?: PetContextItem[]): string {
  if (!petContext || petContext.length === 0) return "";
  const named = petContext
    .slice(0, 3)
    .map((p) => `${p.name || "your pet"}${p.species ? ` (${[p.breed, p.age].filter(Boolean).join(", ") || p.species})` : ""}`)
    .join(", ");
  return named;
}

function generateFallback(
  messages: ChatMessage[],
  context: string | undefined,
  petContext?: PetContextItem[],
  plantContext?: PlantContextItem[],
): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const q = (lastUser?.content || "").toLowerCase();
  const petSummary = summarizePets(petContext);
  const petLead = petSummary ? `Since you've saved ${petSummary} in Petziq, here's what fits them best:\n\n` : "";

  // Emergency keywords → always route to a veterinarian.
  const emergencyWords = [
    "emergency", "bleeding", "not eating", "not breathing", "breathing heavily",
    "seizure", "collapse", "collapsed", "unconscious", "poison", "toxic",
    "vomit", "diarrhea", "lethargic", "hit by car", "bloat",
  ];
  if (emergencyWords.some((w) => q.includes(w))) {
    return "That sounds like it could be serious, and I can't diagnose health issues — I'm not a veterinarian.\n\nPlease contact a qualified veterinarian as soon as possible, and describe exactly what you're seeing. If this is happening right now, treat it as urgent: call your vet or the nearest emergency animal clinic. If you suspect poisoning, a poison-control hotline for animals can guide you in parallel.\n\nIn the meantime keep your pet calm, warm, and away from anything they may have eaten — don't attempt home remedies.";
  }

  // Try to match against knowledge-base context lines passed from the app.
  if (context) {
    const lines = context.split("\n");
    const matches: string[] = [];
    const queryWords = q.split(/\s+/).filter((w) => w.length > 3);
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (queryWords.some((w) => lower.includes(w))) {
        matches.push(line);
        if (matches.length >= 4) break;
      }
    }
    if (matches.length > 0) {
      return (
        "Here's what I can tell you based on what's saved in Petziq:\n\n" +
        matches.join("\n") +
        "\n\nCould you tell me a bit more so I can be more specific — for example the age, and what you've noticed?"
      );
    }
  }

  // Topic-based guidance.
  if (q.includes("feed") || q.includes("food") || q.includes("diet") || q.includes("eat") || q.includes("nutrition")) {
    return `${petLead}Feeding depends on species, age, and activity level. General anchors:

• Dogs: measured meals of quality food sized to breed and life stage; avoid free-feeding. No chocolate, grapes, onions, or cooked bones.
• Cats: wet + dry food helps hydration; portion control matters — most indoor cats do well on 2–3 measured meals.
• Birds: pellets as the base plus fresh vegetables; never avocado or chocolate.
• Rabbits and guinea pigs: unlimited hay, species pellets, fresh greens.
• Fish: tiny amounts once or twice daily; overfeeding pollutes the tank.

Tell me the species and age and I'll get more specific.`;
  }

  if (q.includes("plant") && (q.includes("water") || q.includes("light") || q.includes("soil") || q.includes("care") || q.includes("repot"))) {
    const plantLead = plantContext && plantContext.length > 0
      ? `For ${plantContext.slice(0, 2).map((p) => p.name || "your plant").join(" and ")}:\n\n`
      : "";
    return `${plantLead}Plant care comes down to a few factors:

• Water: let the top inch of soil dry between waterings for most houseplants — overwatering is the #1 killer. Succulents need far less.
• Light: match the plant to your window. Low-light plants (pothos, snake plant) tolerate shade; succulents and ficus want bright light.
• Soil: well-draining mix prevents root rot — add perlite for tropicals, use cactus mix for succulents.
• Humidity: calatheas, ferns, and orchids appreciate a humid corner or pebble tray.

Which plant are you asking about? Petziq's database has species-specific guides.`;
  }

  if (q.includes("choose a plant") || q.includes("plants for") || q.includes("which plant") || q.includes("plant suggestions") || q.includes("beginner plant") || (q.includes("plant") && q.includes("recommend"))) {
    const petSafe = petContext && petContext.length > 0
      ? "\n\nSince you have pets at home, prioritize pet-safe options: spider plant, parlor palm, calathea, Boston fern, and peperomia are all non-toxic to cats and dogs. Avoid pothos, philodendron, and lilies."
      : "";
    return `Choosing plants that fit your space and routine:

• Low light: snake plant, pothos (keep away from pets), ZZ plant, parlor palm.
• Busy schedule: snake plant, ZZ plant, pothos — they forgive missed waterings.
• Bright windows: succulents, jade, aloe, ficus.
• Humid bathrooms: ferns, calathea, orchids.
• Air quality and ease: spider plant and peace lily (lily is toxic to cats — skip it if you have one).${petSafe}

Tell me about your light and how often you want to water, and I'll narrow it down.`;
  }

  if (q.includes("behavior") || q.includes("bark") || q.includes("aggressive") || q.includes("anxious") || q.includes("training") || q.includes("litter")) {
    return `${petLead}Behavior and training principles:

• Positive reinforcement — rewarding what you want — is the most effective, humane method.
• Barking, chewing, or destruction usually signals boredom or under-exercise; enrich the day before correcting the symptom.
• Litter or house-training issues: rule out medical causes with a vet first, then revisit routine, placement, and cleanliness.
• Anxiety improves with predictable routines, gradual desensitization, and calm departures — not punishment.

What behavior are you seeing, and with which pet? I can suggest concrete steps.`;
  }

  if (q.includes("groom") || q.includes("brush") || q.includes("bath") || q.includes("nail") || q.includes("coat") || q.includes("shedding")) {
    return `${petLead}Grooming varies a lot by species and coat:

• Long-coated dogs: brush 3–4× a week, bathe monthly.
• Short-coated dogs: weekly brushing, baths as needed.
• Cats: most self-groom; long-haired breeds need brushing 2–3× a week to prevent mats.
• Nails: trim every 2–4 weeks — if you hear clicking on floors, it's time.
• Start handling paws, ears, and mouth early and reward calm behavior so grooming stays low-stress.

Which pet do you have? I can give breed-specific guidance.`;
  }

  if (q.includes("exercise") || q.includes("walk") || q.includes("play") || q.includes("enrichment") || q.includes("bored")) {
    return `${petLead}Exercise and enrichment keep pets physically and mentally healthy:

• High-energy dogs (Labs, GSDs, Border Collies): 60–90 min/day plus puzzle feeders or training games.
• Lower-energy dogs: 30–45 min/day of sniffy walks counts.
• Cats: 2× 10–15 min of interactive play daily — wand toys beat laser pointers for the final "catch".
• Small mammals: wheels (solid-surface for safety), tunnels, chew toys, dig boxes.
• Birds: daily out-of-cage time in a closed, safe room; rotate toys weekly to prevent boredom.

Which pet are you planning for? I can sketch a daily routine.`;
  }

  if (q.includes("setup") || q.includes("supplies") || q.includes("cage") || q.includes("tank") || q.includes("litter box") || q.includes("bring home") || q.includes("new pet checklist") || q.includes("starter")) {
    return `A good setup prevents most early problems:

• Dogs: a bed, two bowls, ID tag, leash and flat collar or harness, chew toys, and a quiet "home base" spot.
• Cats: one litter box per cat plus one, a scratcher, vertical perches, and a covered hideout.
• Fish: a cycled tank (not a bowl), filter, heater for tropical species, water conditioner, and a test kit.
• Small mammals: the largest cage you can fit, solid-surface wheel, hideout, hay, and chew items.
• Birds: a wide (not just tall) cage, natural perches of varying diameter, and foraging toys.

Tell me the species and I'll give you a first-week checklist.`;
  }

  if (q.includes("choose") || q.includes("recommend") || q.includes("beginner") || q.includes("first") || q.includes("best pet") || q.includes("which pet") || q.includes("adopt")) {
    return `Choosing the right pet comes down to honest limits:

• First-time owners: Golden Retrievers, Labs, and Ragdolls are forgiving and friendly.
• Apartments: cats, budgies, hamsters, guinea pigs, or a calm older dog.
• Active owners: Labs, GSDs, and Bengals thrive on vigorous daily activity.
• Low time budget: betta fish or leopard geckos — simple care, still rewarding.
• Allergies or tight space: fish, reptiles, or short-haired, low-shed breeds.

Tell me your living situation, hours away per day, budget, and experience — and I'll suggest a good match.`;
  }

  // Follow-up awareness so short replies stay conversational.
  const userMessages = messages.filter((m) => m.role === "user");
  const lastQuestion = lastUser?.content || "";
  if (userMessages.length > 1 && lastQuestion.split(/\s+/).length <= 6) {
    return "Good question! To give you the most useful answer, could you tell me a bit more — the species or breed, age, or the specific situation you're dealing with? Then I can tailor the advice.";
  }

  return "That's a great thing to think about. I want to give advice that actually fits your situation — could you share which pet or plant you're asking about, plus anything specific you've noticed? If you've saved pets or plants in Petziq, I'll already know their basics and can tailor from there.";
}
