import type { IrregularVerb } from "./verbs.js";

export type VerbForm = "base" | "pastSimple" | "pastParticiple";

export type VerbContext = {
  form: VerbForm;
  sentence: string;
};

// One hand-written example for every verb. Forms rotate so learners practise
// infinitives, past simple, and past participles in context.
export const VERB_CONTEXTS: Record<string, VerbContext> = {
  arise: { form: "base", sentence: "Problems can ____ when nobody communicates clearly." },
  awake: { form: "pastSimple", sentence: "She ____ before sunrise and went for a run." },
  be: { form: "pastParticiple", sentence: "He has ____ very patient with the new students." },
  bear: { form: "base", sentence: "I cannot ____ the noise from the construction site." },
  beat: { form: "pastSimple", sentence: "Our team ____ the champions in the final." },
  become: { form: "pastParticiple", sentence: "The neighborhood has ____ much quieter recently." },
  begin: { form: "base", sentence: "The ceremony will ____ at six o'clock." },
  bend: { form: "pastSimple", sentence: "He ____ the wire into a circle." },
  bet: { form: "pastParticiple", sentence: "I have never ____ money on a football match." },
  bid: { form: "base", sentence: "Several collectors plan to ____ for the painting." },
  bind: { form: "pastSimple", sentence: "She ____ the papers together with string." },
  bite: { form: "pastParticiple", sentence: "The dog has never ____ anyone." },
  bleed: { form: "base", sentence: "A small cut can ____ for several minutes." },
  blow: { form: "pastSimple", sentence: "The wind ____ the gate open last night." },
  break: { form: "pastParticiple", sentence: "Someone has ____ the handle on the door." },
  breed: { form: "base", sentence: "These birds usually ____ near the coast." },
  bring: { form: "pastSimple", sentence: "Maya ____ homemade bread to the picnic." },
  build: { form: "pastParticiple", sentence: "They have ____ a new bridge across the river." },
  burn: { form: "base", sentence: "Dry leaves ____ very quickly." },
  burst: { form: "pastSimple", sentence: "The balloon ____ when it touched the candle." },
  buy: { form: "pastParticiple", sentence: "We have ____ enough food for the weekend." },
  cast: { form: "base", sentence: "Tall buildings ____ long shadows in winter." },
  catch: { form: "pastSimple", sentence: "I ____ the last bus home." },
  choose: { form: "pastParticiple", sentence: "They have ____ a quiet place for the meeting." },
  cling: { form: "base", sentence: "Wet clothes tend to ____ to your skin." },
  come: { form: "pastSimple", sentence: "Her cousins ____ to visit us yesterday." },
  cost: { form: "pastParticiple", sentence: "The repairs have ____ more than we expected." },
  creep: { form: "base", sentence: "The cat will ____ quietly toward the bird." },
  cut: { form: "pastSimple", sentence: "Leo ____ the cake into eight pieces." },
  deal: { form: "pastParticiple", sentence: "She has ____ with similar problems before." },
  dig: { form: "base", sentence: "We need to ____ a hole for the tree." },
  do: { form: "pastSimple", sentence: "They ____ all the work before lunch." },
  draw: { form: "pastParticiple", sentence: "The artist has ____ a portrait of her grandmother." },
  drink: { form: "base", sentence: "Remember to ____ plenty of water today." },
  drive: { form: "pastSimple", sentence: "Sam ____ through the night to reach the coast." },
  eat: { form: "pastParticiple", sentence: "The children have ____ all the strawberries." },
  fall: { form: "base", sentence: "Temperatures may ____ below zero tonight." },
  feed: { form: "pastSimple", sentence: "Nora ____ the horses early this morning." },
  feel: { form: "pastParticiple", sentence: "I have ____ much better since the weekend." },
  fight: { form: "base", sentence: "The two armies continued to ____ for control of the city." },
  find: { form: "pastSimple", sentence: "We ____ your keys under the sofa." },
  flee: { form: "pastParticiple", sentence: "Many residents had ____ before the storm arrived." },
  fling: { form: "base", sentence: "Please don't ____ your coat onto the floor." },
  fly: { form: "pastSimple", sentence: "The geese ____ south at the end of summer." },
  forbid: { form: "pastParticiple", sentence: "The school has ____ phones during examinations." },
  forget: { form: "base", sentence: "Do not ____ to lock the back door." },
  forgive: { form: "pastSimple", sentence: "She ____ him after he apologized sincerely." },
  freeze: { form: "pastParticiple", sentence: "The lake has ____ completely overnight." },
  get: { form: "base", sentence: "I need to ____ some milk on the way home." },
  give: { form: "pastSimple", sentence: "Our teacher ____ us extra time to finish." },
  go: { form: "pastParticiple", sentence: "The last train has already ____." },
  grind: { form: "base", sentence: "Use this machine to ____ the coffee beans." },
  grow: { form: "pastSimple", sentence: "The children ____ very quickly last year." },
  have: { form: "pastParticiple", sentence: "We have ____ several chances to discuss the plan." },
  hear: { form: "base", sentence: "You can ____ the sea from our balcony." },
  hide: { form: "pastSimple", sentence: "The child ____ behind the curtains." },
  hit: { form: "pastParticiple", sentence: "The storm has ____ the northern coast badly." },
  hold: { form: "base", sentence: "Could you ____ the door open for me?" },
  hurt: { form: "pastSimple", sentence: "I ____ my shoulder while lifting the box." },
  input: { form: "pastParticiple", sentence: "The technician has ____ all the customer data." },
  keep: { form: "base", sentence: "Please ____ this information confidential." },
  know: { form: "pastSimple", sentence: "I ____ the answer as soon as I saw the question." },
  lay: { form: "pastParticiple", sentence: "The workers have ____ new tiles in the kitchen." },
  lead: { form: "base", sentence: "This narrow path will ____ us back to the village." },
  leave: { form: "pastSimple", sentence: "They ____ their umbrellas at the restaurant." },
  lend: { form: "pastParticiple", sentence: "My sister has ____ me her bicycle for the week." },
  let: { form: "base", sentence: "Please ____ me know when you arrive." },
  lie: { form: "pastSimple", sentence: "The cat ____ in the sun all afternoon." },
  light: { form: "pastParticiple", sentence: "Someone has ____ a fire in the fireplace." },
  lose: { form: "base", sentence: "Be careful not to ____ your passport." },
  make: { form: "pastSimple", sentence: "Amir ____ a delicious soup for dinner." },
  mean: { form: "pastParticiple", sentence: "This symbol has always ____ good luck." },
  meet: { form: "base", sentence: "We plan to ____ outside the station at noon." },
  mistake: { form: "pastSimple", sentence: "I ____ his brother for him in the crowd." },
  pay: { form: "pastParticiple", sentence: "She has already ____ the electricity bill." },
  prove: { form: "base", sentence: "The evidence may ____ that he was elsewhere." },
  put: { form: "pastSimple", sentence: "I ____ your package on the kitchen table." },
  quit: { form: "pastParticiple", sentence: "He has ____ drinking coffee in the evening." },
  read: { form: "base", sentence: "I like to ____ for an hour before bed." },
  rid: { form: "pastSimple", sentence: "They ____ the garden of weeds last weekend." },
  ride: { form: "pastParticiple", sentence: "She has ____ a horse only once." },
  ring: { form: "base", sentence: "I'll ____ the bell when everyone is ready." },
  rise: { form: "pastSimple", sentence: "The river ____ rapidly after the heavy rain." },
  run: { form: "pastParticiple", sentence: "He has ____ three marathons this year." },
  say: { form: "base", sentence: "What should I ____ when they ask about the delay?" },
  see: { form: "pastSimple", sentence: "We ____ dolphins near the boat." },
  seek: { form: "pastParticiple", sentence: "The company has ____ advice from several experts." },
  sell: { form: "base", sentence: "They hope to ____ their old apartment soon." },
  send: { form: "pastSimple", sentence: "I ____ the documents by email yesterday." },
  set: { form: "pastParticiple", sentence: "They have ____ a date for the wedding." },
  shake: { form: "base", sentence: "You should ____ the bottle before opening it." },
  shave: { form: "pastSimple", sentence: "He ____ his beard before the interview." },
  shed: { form: "pastParticiple", sentence: "The old tree has ____ most of its leaves." },
  shine: { form: "base", sentence: "The stars ____ brightly on clear nights." },
  shoot: { form: "pastSimple", sentence: "The photographer ____ hundreds of pictures at the event." },
  show: { form: "pastParticiple", sentence: "The results have ____ a clear improvement." },
  shrink: { form: "base", sentence: "This sweater may ____ if you wash it in hot water." },
  shut: { form: "pastSimple", sentence: "She ____ all the windows before the storm." },
  sing: { form: "pastParticiple", sentence: "They have ____ together since they were children." },
  sink: { form: "base", sentence: "Heavy stones ____ quickly in deep water." },
  sit: { form: "pastSimple", sentence: "We ____ beside the lake and watched the sunset." },
  slay: { form: "pastParticiple", sentence: "The hero had ____ the dragon before dawn." },
  sleep: { form: "base", sentence: "Most adults need to ____ for seven or eight hours." },
  slide: { form: "pastSimple", sentence: "The glass ____ off the tray and broke." },
  sling: { form: "pastParticiple", sentence: "He had ____ his jacket over one shoulder." },
  slit: { form: "base", sentence: "Use a sharp knife to ____ the envelope open." },
  sow: { form: "pastSimple", sentence: "The farmers ____ wheat in the eastern field." },
  speak: { form: "pastParticiple", sentence: "I have ____ to the manager about the issue." },
  speed: { form: "base", sentence: "Drivers who ____ through the village risk a fine." },
  spell: { form: "pastSimple", sentence: "She ____ my surname correctly on the first try." },
  spend: { form: "pastParticiple", sentence: "We have ____ too much money this month." },
  spin: { form: "base", sentence: "The wheels ____ faster as the bicycle goes downhill." },
  spit: { form: "pastSimple", sentence: "The baby ____ out the medicine immediately." },
  split: { form: "pastParticiple", sentence: "They have ____ the class into four groups." },
  spread: { form: "base", sentence: "Please ____ the map across the table." },
  spring: { form: "pastSimple", sentence: "The cat ____ onto the windowsill." },
  stand: { form: "pastParticiple", sentence: "We have ____ in this queue for nearly an hour." },
  steal: { form: "base", sentence: "Someone might ____ the bicycle if you leave it unlocked." },
  stick: { form: "pastSimple", sentence: "I ____ the notice on the office door yesterday." },
  sting: { form: "pastParticiple", sentence: "A bee has ____ me on the hand." },
  stink: { form: "base", sentence: "These old shoes really ____ after a long walk." },
  strike: { form: "pastSimple", sentence: "Lightning ____ the old oak tree during the storm." },
  swear: { form: "pastParticiple", sentence: "He has ____ never to reveal the secret." },
  sweep: { form: "base", sentence: "Could you ____ the kitchen floor after dinner?" },
  swell: { form: "pastSimple", sentence: "Her ankle ____ after the long hike." },
  swim: { form: "pastParticiple", sentence: "They have ____ across the bay several times." },
  swing: { form: "base", sentence: "The doors ____ open when you press this button." },
  take: { form: "pastSimple", sentence: "Mina ____ the children to the science museum." },
  teach: { form: "pastParticiple", sentence: "Mr. Lee has ____ at this school for twenty years." },
  tear: { form: "base", sentence: "Be careful not to ____ the thin paper." },
  tell: { form: "pastSimple", sentence: "She ____ us a funny story on the journey." },
  think: { form: "pastParticiple", sentence: "I have ____ carefully about your proposal." },
  throw: { form: "base", sentence: "Please ____ the ball back to me." },
  thrust: { form: "pastSimple", sentence: "He ____ the letter into my hand and hurried away." },
  wake: { form: "pastParticiple", sentence: "The loud thunder has ____ the baby." },
  wear: { form: "base", sentence: "You should ____ comfortable shoes for the walk." },
  weep: { form: "pastSimple", sentence: "She ____ with relief when she heard the news." },
  win: { form: "pastParticiple", sentence: "Our school has ____ the competition twice." },
  wind: { form: "base", sentence: "You need to ____ the old clock every Sunday." },
  write: { form: "pastSimple", sentence: "I ____ her address on a piece of paper." },
};

export function getVerbContext(verb: IrregularVerb): VerbContext {
  const context = VERB_CONTEXTS[verb.base];
  if (!context) {
    throw new Error(`Missing context sentence for verb: ${verb.base}`);
  }
  return context;
}

export function contextAnswer(verb: IrregularVerb, form: VerbForm): string {
  return verb[form];
}

export function contextFormLabel(form: VerbForm): string {
  switch (form) {
    case "base":
      return "first form";
    case "pastSimple":
      return "second form";
    case "pastParticiple":
      return "third form";
  }
}
