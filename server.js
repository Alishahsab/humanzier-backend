const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.options('*', cors());
app.use(express.json({ limit: '10mb' }));

// In-memory storage
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// ============================================
// EXTREME SYNONYM DATABASE (1000+ variations)
// ============================================
const extremeSynonyms = {
  'important': ['crucial', 'vital', 'essential', 'key', 'significant', 'critical', 'paramount', 'imperative', 'pressing', 'urgent', 'momentous', 'consequential', 'weighty', 'earth-shattering', 'of great consequence', 'high-priority', 'non-negotiable', 'make-or-break'],
  'however': ['but', 'yet', 'though', 'although', 'nevertheless', 'nonetheless', 'still', 'conversely', 'that said', 'on the flip side', 'having said that', 'be that as it may', 'even so', 'despite that', 'with that in mind', 'all the same', 'at the same time'],
  'therefore': ['so', 'thus', 'hence', 'consequently', 'accordingly', 'as a result', 'for that reason', 'ergo', 'that\'s why', 'this means', 'which is why', 'leading to', 'as a direct result', 'in consequence', 'under the circumstances'],
  'furthermore': ['also', 'moreover', 'in addition', 'besides', 'additionally', 'plus', 'what\'s more', 'on top of that', 'further', 'to boot', 'likewise', 'not to mention', 'along the same lines', 'by the same token'],
  'demonstrate': ['show', 'reveal', 'indicate', 'prove', 'exhibit', 'display', 'illustrate', 'highlight', 'underscore', 'point to', 'attest to', 'bear out', 'corroborate', 'give evidence of', 'serve as proof'],
  'utilize': ['use', 'employ', 'apply', 'leverage', 'harness', 'deploy', 'draw on', 'make use of', 'take advantage of', 'put to use', 'bring into play', 'call upon', 'avail oneself of'],
  'implement': ['apply', 'execute', 'perform', 'carry out', 'enact', 'realize', 'put into action', 'bring about', 'effectuate', 'set in motion', 'get rolling', 'put into practice', 'act on'],
  'significant': ['major', 'important', 'substantial', 'considerable', 'remarkable', 'notable', 'striking', 'pronounced', 'weighty', 'sizeable', 'appreciable', 'meaningful', 'consequential', 'far-reaching'],
  'provide': ['give', 'offer', 'supply', 'furnish', 'present', 'deliver', 'provide', 'render', 'afford', 'proffer', 'bestow', 'dispense', 'hand over', 'make available'],
  'obtain': ['get', 'acquire', 'gain', 'secure', 'attain', 'procure', 'come by', 'get hold of', 'land', 'score', 'net', 'bag', 'lock in', 'wrap up'],
  'require': ['need', 'demand', 'necessitate', 'call for', 'entail', 'involve', 'require', 'mandate', 'ask for', 'insist on', 'make necessary', 'leave no choice but'],
  'assist': ['help', 'aid', 'support', 'facilitate', 'lend a hand', 'assist', 'back up', 'boost', 'ease', 'expedite', 'give a leg up', 'pave the way for'],
  'commence': ['start', 'begin', 'initiate', 'launch', 'kick off', 'embark on', 'get going', 'set about', 'open', 'get underway', 'fire away', 'get the ball rolling'],
  'terminate': ['end', 'stop', 'conclude', 'finish', 'cease', 'halt', 'wrap up', 'wind up', 'bring to a close', 'discontinue', 'cut off', 'pull the plug on'],
  'numerous': ['many', 'several', 'countless', 'multiple', 'various', 'abundant', 'plenty of', 'a lot of', 'scores of', 'myriad', 'innumerable', 'a plethora of', 'a multitude of'],
  'subsequently': ['later', 'afterward', 'then', 'next', 'following that', 'thereafter', 'in the aftermath', 'subsequently', 'down the line', 'in due course', 'at a later stage'],
  'approximately': ['about', 'roughly', 'around', 'circa', 'nearly', 'close to', 'in the ballpark of', 'approximately', 'give or take', 'in the neighborhood of', 'or thereabouts'],
  'nevertheless': ['but', 'yet', 'still', 'however', 'nonetheless', 'even so', 'despite that', 'regardless', 'anyway', 'anyhow', 'be that as it may', 'in spite of that'],
  'additionally': ['also', 'plus', 'besides', 'furthermore', 'moreover', 'as well', 'into the bargain', 'to boot', 'likewise', 'along with that', 'coupled with that'],
  'consequently': ['so', 'thus', 'therefore', 'hence', 'as a result', 'accordingly', 'for that reason', 'that\'s why', 'which is why', 'as a consequence', 'by consequence'],
  'particularly': ['especially', 'specifically', 'notably', 'in particular', 'chiefly', 'mainly', 'above all', 'primarily', 'mostly', 'predominantly', 'most importantly'],
  'basically': ['essentially', 'fundamentally', 'at heart', 'in essence', 'primarily', 'at its core', 'in substance', 'by and large', 'for the most part', 'in the main'],
  'actually': ['really', 'truly', 'in fact', 'in reality', 'literally', 'as a matter of fact', 'in truth', 'veritably', 'indeed', 'authentically', 'if truth be told'],
  'completely': ['totally', 'entirely', 'fully', 'wholly', 'absolutely', 'utterly', 'perfectly', 'thoroughly', 'altogether', 'one hundred percent', 'from start to finish'],
  'really': ['truly', 'actually', 'genuinely', 'honestly', 'indeed', 'undoubtedly', 'certainly', 'absolutely', 'positively', 'unquestionably', 'beyond doubt'],
  'very': ['extremely', 'exceedingly', 'immensely', 'remarkably', 'highly', 'exceptionally', 'incredibly', 'tremendously', 'extraordinarily', 'awfully', 'darn'],
  'good': ['great', 'excellent', 'wonderful', 'superb', 'fantastic', 'terrific', 'outstanding', 'marvelous', 'splendid', 'first-rate', 'top-notch', 'stellar', 'bang-up'],
  'bad': ['poor', 'terrible', 'awful', 'dreadful', 'horrible', 'atrocious', 'lousy', 'subpar', 'inferior', 'abysmal', 'god-awful', 'pitiful', 'disappointing'],
  'big': ['large', 'huge', 'enormous', 'massive', 'gigantic', 'immense', 'colossal', 'tremendous', 'vast', 'ginormous', 'humongous', 'monumental', 'epic'],
  'small': ['little', 'tiny', 'minuscule', 'compact', 'petite', 'miniature', 'diminutive', 'microscopic', 'wee', 'undersized', 'pocket-sized', 'itsy-bitsy'],
  'easy': ['simple', 'straightforward', 'effortless', 'uncomplicated', 'painless', 'a breeze', 'a piece of cake', 'no sweat', 'child\'s play', 'easy-peasy'],
  'hard': ['difficult', 'challenging', 'tough', 'arduous', 'demanding', 'laborious', 'strenuous', 'grueling', 'back-breaking', 'hellish', 'a struggle'],
  'fast': ['quick', 'rapid', 'swift', 'speedy', 'brisk', 'hasty', 'fleet', 'expeditious', 'breakneck', 'lightning', 'blistering', 'like greased lightning'],
  'slow': ['sluggish', 'leisurely', 'unhurried', 'gradual', 'ponderous', 'lackadaisical', 'plodding', 'snail-like', 'glacial', 'deliberate', 'languid'],
  'happy': ['glad', 'pleased', 'delighted', 'joyful', 'cheerful', 'content', 'thrilled', 'overjoyed', 'ecstatic', 'elated', 'on cloud nine', 'walking on air'],
  'sad': ['unhappy', 'sorrowful', 'dejected', 'downcast', 'gloomy', 'melancholy', 'somber', 'dismal', 'heartbroken', 'crestfallen', 'despondent', 'bummed out'],
  'new': ['novel', 'fresh', 'innovative', 'cutting-edge', 'modern', 'contemporary', 'recent', 'brand new', 'state-of-the-art', 'groundbreaking', 'revolutionary'],
  'old': ['ancient', 'aged', 'elderly', 'vintage', 'antique', 'timeworn', 'archaic', 'obsolete', 'outdated', 'old-school', 'retro', 'old-fashioned'],
  'best': ['finest', 'greatest', 'top', 'leading', 'premier', 'foremost', 'supreme', 'unrivaled', 'second to none', 'unsurpassed', 'top-tier', 'world-class'],
  'worst': ['poorest', 'lowest', 'inferior', 'bottom', 'least', 'most terrible', 'most awful', 'most dreadful', 'abysmal', 'atrocious', 'god-awful'],
  'think': ['believe', 'reckon', 'suppose', 'assume', 'presume', 'figure', 'guess', 'imagine', 'suspect', 'deem', 'consider', 'be of the opinion'],
  'know': ['understand', 'comprehend', 'realize', 'appreciate', 'grasp', 'fathom', 'see', 'get', 'follow', 'catch on to', 'be aware of'],
  'use': ['employ', 'utilize', 'apply', 'operate', 'work', 'manipulate', 'handle', 'wield', 'ply', 'make use of', 'put to use'],
  'make': ['create', 'produce', 'build', 'construct', 'fashion', 'form', 'manufacture', 'assemble', 'put together', 'craft', 'forge'],
  'get': ['obtain', 'acquire', 'gain', 'secure', 'attain', 'procure', 'come by', 'land', 'score', 'net', 'pick up', 'round up'],
  'see': ['observe', 'notice', 'spot', 'glimpse', 'witness', 'perceive', 'discern', 'make out', 'catch sight of', 'lay eyes on'],
  'say': ['state', 'declare', 'announce', 'mention', 'express', 'voice', 'utter', 'articulate', 'verbalize', 'speak', 'come out with'],
  'find': ['discover', 'locate', 'uncover', 'unearth', 'detect', 'come across', 'stumble upon', 'chance upon', 'happen upon'],
  'tell': ['inform', 'notify', 'advise', 'apprise', 'let know', 'brief', 'fill in', 'clue in', 'update', 'bring up to speed'],
  'look': ['view', 'regard', 'examine', 'inspect', 'scan', 'survey', 'study', 'observe', 'eyeball', 'check out', 'gaze at'],
  'help': ['aid', 'assist', 'support', 'lend a hand', 'give a hand', 'be of service', 'pitch in', 'chip in', 'back up', 'bail out']
};

// ============================================
// EXTREME AI PHRASE DATABASE (200+ phrases)
// ============================================
const extremeAIPhrases = [
  'it is important to note', 'it should be noted', 'it is worth mentioning', 'it is crucial to understand',
  'it is essential to recognize', 'it is significant to highlight', 'it is vital to consider',
  'it is imperative to acknowledge', 'it is necessary to point out', 'it is relevant to mention',
  'as can be seen', 'it can be observed', 'one might argue', 'it is evident that', 'it is clear that',
  'it is obvious that', 'it is apparent that', 'it becomes clear that', 'it is noteworthy that',
  'it is interesting to note', 'it is remarkable that', 'it is striking that', 'it is curious that',
  'in conclusion', 'to conclude', 'to summarize', 'in summary', 'to sum up', 'in closing',
  'in final analysis', 'to recapitulate', 'to encapsulate', 'in a nutshell', 'to put it briefly',
  'overall', 'thus', 'hence', 'therefore', 'thereby', 'consequently', 'accordingly',
  'as a result', 'for this reason', 'on that account', 'as a consequence', 'in consequence',
  'furthermore', 'moreover', 'additionally', 'in addition', 'besides', 'further', 'also',
  'plus', 'what is more', 'not to mention', 'to say nothing of', 'on top of everything else',
  'nevertheless', 'nonetheless', 'however', 'conversely', 'on the contrary', 'in contrast',
  'by contrast', 'on the other hand', 'then again', 'that said', 'even so', 'yet', 'still',
  'firstly', 'secondly', 'thirdly', 'lastly', 'finally', 'first and foremost', 'last but not least',
  'to begin with', 'in the first place', 'for starters', 'as a first point', 'in the second place',
  'as previously mentioned', 'as discussed earlier', 'as noted above', 'as stated before',
  'as indicated previously', 'as outlined earlier', 'as mentioned before', 'as we have seen',
  'for instance', 'for example', 'such as', 'including', 'to illustrate', 'as an illustration',
  'by way of example', 'to give an example', 'as a case in point', 'to demonstrate',
  'due to the fact that', 'owing to the fact that', 'on account of', 'because of the fact that',
  'in light of the fact that', 'considering that', 'given that', 'seeing that',
  'in order to', 'with the purpose of', 'for the purpose of', 'with the intention of',
  'with the aim of', 'so as to', 'with a view to', 'for the sake of',
  'in the event that', 'in the case that', 'under circumstances', 'in the scenario where',
  'should it happen that', 'if it should occur that', 'in the unlikely event that',
  'with respect to', 'in regard to', 'concerning', 'regarding', 'with reference to',
  'as regards', 'in relation to', 'with respect to', 'on the subject of',
  'it can be said that', 'it could be argued that', 'some might say', 'one could claim that',
  'it could be contended that', 'it might be posited that', 'it could be hypothesized that',
  'the fact that', 'the idea that', 'the notion that', 'the concept that', 'the proposition that',
  'this demonstrates that', 'this shows that', 'this indicates that', 'this suggests that',
  'this implies that', 'this proves that', 'this confirms that', 'this validates that',
  'this corroborates that', 'this substantiates that', 'this bears out that',
  'based on the results', 'according to the findings', 'in light of the evidence',
  'on the basis of the data', 'as evidenced by', 'as demonstrated by',
  'the data suggests', 'the results indicate', 'the findings reveal', 'the evidence points to',
  'it has been shown that', 'studies have shown that', 'research indicates that',
  'previous work has demonstrated', 'prior research has established',
  'it is widely accepted that', 'it is generally believed that', 'conventional wisdom holds that',
  'it is commonly understood that', 'it is generally recognized that',
  'in the context of', 'within the framework of', 'from the perspective of',
  'through the lens of', 'against the backdrop of', 'in the setting of',
  'a wide range of', 'a variety of', 'numerous studies', 'a growing body of research',
  'an extensive literature', 'a substantial amount of research', 'a wealth of evidence',
  'it is worth noting that', 'it is interesting to note that', 'significantly',
  'notably', 'importantly', 'critically', 'essentially', 'fundamentally', 'remarkably'
];

// ============================================
// EXTREME CONTRACTIONS
// ============================================
const extremeContractions = [
  [/\bdo not\b/gi, "don't"], [/\bcannot\b/gi, "can't"], [/\bwill not\b/gi, "won't"],
  [/\bwould not\b/gi, "wouldn't"], [/\bcould not\b/gi, "couldn't"], [/\bshould not\b/gi, "shouldn't"],
  [/\bmust not\b/gi, "mustn't"], [/\bhave not\b/gi, "haven't"], [/\bhas not\b/gi, "hasn't"],
  [/\bhad not\b/gi, "hadn't"], [/\bdo not\b/gi, "don't"], [/\bdoes not\b/gi, "doesn't"],
  [/\bdid not\b/gi, "didn't"], [/\bare not\b/gi, "aren't"], [/\bis not\b/gi, "isn't"],
  [/\bwas not\b/gi, "wasn't"], [/\bwere not\b/gi, "weren't"], [/\bI am\b/gi, "I'm"],
  [/\byou are\b/gi, "you're"], [/\bwe are\b/gi, "we're"], [/\bthey are\b/gi, "they're"],
  [/\bhe is\b/gi, "he's"], [/\bshe is\b/gi, "she's"], [/\bit is\b/gi, "it's"],
  [/\bthat is\b/gi, "that's"], [/\bthere is\b/gi, "there's"], [/\bhere is\b/gi, "here's"],
  [/\bwhat is\b/gi, "what's"], [/\bwho is\b/gi, "who's"], [/\bwhere is\b/gi, "where's"],
  [/\bwhen is\b/gi, "when's"], [/\bwhy is\b/gi, "why's"], [/\bhow is\b/gi, "how's"],
  [/\bI have\b/gi, "I've"], [/\byou have\b/gi, "you've"], [/\bwe have\b/gi, "we've"],
  [/\bthey have\b/gi, "they've"], [/\bI will\b/gi, "I'll"], [/\byou will\b/gi, "you'll"],
  [/\bwe will\b/gi, "we'll"], [/\bthey will\b/gi, "they'll"], [/\bhe will\b/gi, "he'll"],
  [/\bshe will\b/gi, "she'll"], [/\bit will\b/gi, "it'll"], [/\bthat will\b/gi, "that'll"],
  [/\bI would\b/gi, "I'd"], [/\byou would\b/gi, "you'd"], [/\bwe would\b/gi, "we'd"],
  [/\bthey would\b/gi, "they'd"], [/\bhe would\b/gi, "he'd"], [/\bshe would\b/gi, "she'd"],
  [/\bit would\b/gi, "it'd"], [/\bthat would\b/gi, "that'd"], [/\bI had\b/gi, "I'd"],
  [/\byou had\b/gi, "you'd"], [/\bwe had\b/gi, "we'd"], [/\bthey had\b/gi, "they'd"],
  [/\blet us\b/gi, "let's"], [/\bgoing to\b/gi, "gonna"], [/\bwant to\b/gi, "wanna"],
  [/\bgot to\b/gi, "gotta"], [/\bkinds of\b/gi, "kinda"], [/\bsort of\b/gi, "sorta"],
  [/\bout of\b/gi, "outta"], [/\ba lot of\b/gi, "alotta"], [/\bwhat are you\b/gi, "whatcha"],
  [/\byou all\b/gi, "y'all"], [/\bgive me\b/gi, "gimme"], [/\bcause\b/gi, "cuz"],
  [/\bsomebody\b/gi, "somebody"], [/\banybody\b/gi, "anybody"], [/\bnobody\b/gi, "nobody"],
  [/\beverybody\b/gi, "everybody"], [/\bsomeone\b/gi, "someone"], [/\banyone\b/gi, "anyone"],
  [/\beveryone\b/gi, "everyone"], [/\bdunno\b/gi, "dunno"], [/\bkind of\b/gi, "kinda"],
  [/\bsort of\b/gi, "sorta"], [/\blots of\b/gi, "lotsa"], [/\bcouple of\b/gi, "coupla"]
];

// ============================================
// HUMAN EXPRESSIONS & FILLERS (EXTREME)
// ============================================
const humanFillers = [
  'You know what?', 'Here\'s the thing.', 'The way I see it,', 'If you ask me,',
  'Truth be told,', 'To be perfectly honest,', 'At the end of the day,',
  'When you really think about it,', 'The thing is,', 'The bottom line is,',
  'What it comes down to is,', 'Here\'s the kicker:', 'And get this:',
  'You won\'t believe this but,', 'Believe it or not,', 'As it turns out,',
  'Come to find out,', 'Long story short,', 'To make a long story short,',
  'The long and short of it is,', 'Plain and simple,', 'In a nutshell,',
  'All things considered,', 'When all is said and done,', 'When you boil it down,',
  'When you strip away everything else,', 'Here\'s the deal:', 'So here\'s the scoop:',
  'Let me level with you,', 'I gotta say,', 'I have to admit,', 'I\'ll be honest,',
  'Between you and me,', 'Off the record,', 'Just between us,',
  'Now get this -', 'Check this out -', 'Guess what?', 'You ready for this?',
  'Wait for it...', 'And then - bam!', 'Next thing you know,', 'Out of nowhere,',
  'All of a sudden,', 'Before you know it,', 'In the blink of an eye,'
];

// ============================================
// CASUAL WORDS & PHRASES
// ============================================
const casualWords = [
  'actually', 'basically', 'honestly', 'literally', 'seriously', 'frankly',
  'pretty much', 'kind of', 'sort of', 'a bit', 'a little', 'like',
  'you know', 'I mean', 'well', 'so', 'anyway', 'anyhow',
  'obviously', 'clearly', 'surely', 'definitely', 'certainly', 'absolutely',
  'probably', 'maybe', 'perhaps', 'possibly', 'likely', 'presumably'
];

// ============================================
// EXTREME CLEANING FUNCTION
// ============================================
const extremeClean = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  let cleaned = text
    .replace(/[-–—―−~@#$%^*_+=\[\]{}|\\\/:;]/g, ' ')
    .replace(/,/g, ' ')
    .replace(/\.{3,}/g, '... ')
    .replace(/\s+/g, ' ')
    .replace(/\s*([.!?])\s*/g, '$1 ')
    .replace(/\.([A-Z])/g, '. $1')
    .trim();
    
  return cleaned;
};

// ============================================
// EXTREME AI PHRASE ELIMINATOR
// ============================================
const extremeEliminateAIPhrases = (text) => {
  let result = text;
  const sortedPhrases = [...extremeAIPhrases].sort((a, b) => b.length - a.length);
  
  sortedPhrases.forEach(phrase => {
    const regex = new RegExp(`\\b${phrase}\\b,?\\s*`, 'gi');
    result = result.replace(regex, '');
    
    const phraseWithComma = phrase + ',';
    const regexComma = new RegExp(`\\b${phraseWithComma}\\b\\s*`, 'gi');
    result = result.replace(regexComma, '');
  });
  
  return result;
};

// ============================================
// EXTREME SYNONYM REPLACEMENT (95% density)
// ============================================
const extremeSynonymReplace = (text, density = 0.95) => {
  const words = text.split(' ');
  const skipWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as'];
  const result = [];
  
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    let cleanWord = word.toLowerCase().replace(/[.,!?;:]$/, '');
    let punctuation = word.match(/[.,!?;:]+$/) ? word.match(/[.,!?;:]+$/)[0] : '';
    
    if (cleanWord.length < 3 || skipWords.includes(cleanWord) || /^\d+$/.test(cleanWord)) {
      result.push(word);
      continue;
    }
    
    if (extremeSynonyms[cleanWord] && Math.random() < density) {
      const synonyms = extremeSynonyms[cleanWord];
      const replacement = synonyms[Math.floor(Math.random() * synonyms.length)];
      
      if (word[0] === word[0].toUpperCase()) {
        word = replacement.charAt(0).toUpperCase() + replacement.slice(1) + punctuation;
      } else {
        word = replacement + punctuation;
      }
    }
    
    result.push(word);
  }
  
  return result.join(' ');
};

// ============================================
// EXTREME SENTENCE RESTRUCTURER
// ============================================
const extremeSentenceRestructurer = (text) => {
  let sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim());
  
  if (sentences.length < 2) return text;
  
  // Dramatic reordering - keep first sentence maybe, but scramble the rest
  const firstSentence = sentences[0];
  const restSentences = sentences.slice(1);
  
  // Shuffle the rest aggressively
  for (let i = restSentences.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [restSentences[i], restSentences[j]] = [restSentences[j], restSentences[i]];
  }
  
  // Maybe put first sentence somewhere else
  if (Math.random() > 0.5) {
    sentences = restSentences;
    if (Math.random() > 0.5) {
      sentences.splice(Math.floor(Math.random() * sentences.length), 0, firstSentence);
    } else {
      sentences.push(firstSentence);
    }
  } else {
    sentences = [firstSentence, ...restSentences];
  }
  
  // Restructure each sentence
  const restructured = sentences.map((sentence, index) => {
    let s = sentence;
    
    // Split long sentences aggressively
    if (s.length > 80 && Math.random() > 0.3) {
      const splitPoints = [',', ' and ', ' but ', ' because ', ' which ', ' that ', ' who ', ' where ', ' when '];
      for (const point of splitPoints) {
        if (s.includes(point)) {
          const parts = s.split(point);
          if (parts.length >= 2) {
            const randomSplit = Math.floor(Math.random() * (parts.length - 1)) + 1;
            s = parts.slice(0, randomSplit).join(point) + '. ' + parts.slice(randomSplit).join(point);
            break;
          }
        }
      }
    }
    
    // Add casual word to sentence opening
    if (index > 0 && Math.random() > 0.4) {
      const casual = casualWords[Math.floor(Math.random() * casualWords.length)];
      s = casual.charAt(0).toUpperCase() + casual.slice(1) + ', ' + s.charAt(0).toLowerCase() + s.slice(1);
    }
    
    // Add filler at beginning
    if (Math.random() > 0.7) {
      const filler = humanFillers[Math.floor(Math.random() * humanFillers.length)];
      s = filler + ' ' + s.charAt(0).toLowerCase() + s.slice(1);
    }
    
    return s;
  });
  
  return restructured.join(' ');
};

// ============================================
// EXTREME BURSTINESS INJECTOR
// ============================================
const extremeBurstinessInjector = (text) => {
  let sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim());
  
  if (sentences.length < 3) return text;
  
  const result = [];
  const shortOnes = [
    'Seriously.', 'No joke.', 'For real.', 'Exactly.', 'Precisely.',
    'Absolutely.', 'Definitely.', 'Obviously.', 'Clearly.', 'Naturally.',
    'Of course.', 'Right?', 'See?', 'Got it?', 'Makes sense.',
    'Right on.', 'You bet.', 'No doubt.', 'For sure.', 'You know?',
    'I mean...', 'Well...', 'So...', 'Anyway...', 'Anyhow...'
  ];
  
  const mediumOnes = [
    'That changes everything.', 'This is actually huge.',
    'You might not expect this.', 'Here comes the interesting part.',
    'Wait until you hear this.', 'This next bit is crucial.',
    'Pay attention to this.', 'Don\'t miss this detail.',
    'This is where it gets good.', 'And here\'s why.',
    'Here\'s what happened next.', 'Then things got wild.',
    'You won\'t believe what happened.', 'This blew my mind.',
    'I couldn\'t believe it.', 'It was incredible.'
  ];
  
  const questions = [
    'You know what I mean?', 'See what I\'m getting at?',
    'Make sense so far?', 'Following me?', 'Get the picture?',
    'Know what I\'m saying?', 'You feel me?', 'Right?',
    'Understand?', 'Catch my drift?', 'You with me?',
    'Does that make sense?', 'Are we on the same page?'
  ];
  
  for (let i = 0; i < sentences.length; i++) {
    result.push(sentences[i]);
    
    // Add very short sentences (more frequently)
    if (Math.random() > 0.6) {
      result.push(shortOnes[Math.floor(Math.random() * shortOnes.length)]);
    }
    
    // Add medium sentences
    if (Math.random() > 0.75 && i < sentences.length - 1) {
      result.push(mediumOnes[Math.floor(Math.random() * mediumOnes.length)]);
    }
    
    // Add questions
    if (Math.random() > 0.8) {
      result.push(questions[Math.floor(Math.random() * questions.length)]);
    }
    
    // Add filler between sentences
    if (Math.random() > 0.7 && i < sentences.length - 1) {
      const filler = humanFillers[Math.floor(Math.random() * humanFillers.length)];
      result.push(filler);
    }
  }
  
  return result.join(' ');
};

// ============================================
// EXTREME CONTRACTION APPLIER
// ============================================
const extremeContractionApplier = (text) => {
  let result = text;
  
  extremeContractions.forEach(([pattern, replacement]) => {
    result = result.replace(pattern, replacement);
  });
  
  // Add extra casual contractions
  result = result.replace(/\bgoing to\b/gi, 'gonna');
  result = result.replace(/\bwant to\b/gi, 'wanna');
  result = result.replace(/\bgive me\b/gi, 'gimme');
  result = result.replace(/\blet me\b/gi, 'lemme');
  result = result.replace(/\ba lot of\b/gi, 'lots of');
  result = result.replace(/\bkinds of\b/gi, 'kinda');
  result = result.replace(/\bsort of\b/gi, 'sorta');
  
  return result;
};

// ============================================
// EXTREME PARAGRAPH CREATOR
// ============================================
const extremeParagraphCreator = (text) => {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim());
  
  if (sentences.length < 4) return text;
  
  const paragraphs = [];
  let currentPara = [];
  
  for (let i = 0; i < sentences.length; i++) {
    currentPara.push(sentences[i]);
    
    // Create very irregular paragraph breaks
    const shouldBreak = (
      (currentPara.length >= 2 && Math.random() > 0.5) ||
      (currentPara.length >= 4 && Math.random() > 0.3) ||
      currentPara.length >= 6 ||
      (i === sentences.length - 1 && currentPara.length > 0)
    );
    
    if (shouldBreak) {
      paragraphs.push(currentPara.join(' '));
      currentPara = [];
    }
  }
  
  if (currentPara.length > 0) {
    paragraphs.push(currentPara.join(' '));
  }
  
  // Add fillers between paragraphs (more frequently)
  for (let i = 0; i < paragraphs.length - 1; i++) {
    if (Math.random() > 0.4) {
      const filler = humanFillers[Math.floor(Math.random() * humanFillers.length)];
      paragraphs.splice(i + 1, 0, filler);
      i++; // Skip the filler we just added
    }
  }
  
  return paragraphs.join('\n\n');
};

// ============================================
// CONTROLLED TYPO INSERTER (very subtle)
// ============================================
const controlledTypoInserter = (text) => {
  const words = text.split(' ');
  const result = [];
  
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    
    // Only add very occasional typos (2% chance)
    if (word.length > 5 && Math.random() < 0.02) {
      // Simple typo: swap two adjacent letters
      const letters = word.split('');
      const pos = Math.floor(Math.random() * (letters.length - 1));
      [letters[pos], letters[pos + 1]] = [letters[pos + 1], letters[pos]];
      word = letters.join('');
    }
    
    result.push(word);
  }
  
  return result.join(' ');
};

// ============================================
// EXTREME 15-STAGE AI DETECTOR BYPASS
// ============================================
const extremeAIDetectorBypass = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  console.log('\n🔥 Starting 15-Stage EXTREME AI Detector Bypass...');
  let result = text;
  
  // STAGE 1: Extreme cleaning
  console.log('📝 STAGE 1/15: Extreme cleaning...');
  result = extremeClean(result);
  
  // STAGE 2: Eliminate all AI phrases
  console.log('🚫 STAGE 2/15: Eliminating AI phrases...');
  result = extremeEliminateAIPhrases(result);
  
  // STAGE 3: Extreme synonym replacement (95% density)
  console.log('📚 STAGE 3/15: Extreme synonym replacement...');
  result = extremeSynonymReplace(result, 0.95);
  
  // STAGE 4: Extreme sentence restructuring
  console.log('🔄 STAGE 4/15: Extreme sentence restructuring...');
  result = extremeSentenceRestructurer(result);
  
  // STAGE 5: Extreme burstiness injection
  console.log('⚡ STAGE 5/15: Extreme burstiness injection...');
  result = extremeBurstinessInjector(result);
  
  // STAGE 6: Apply extreme contractions
  console.log('✂️ STAGE 6/15: Applying extreme contractions...');
  result = extremeContractionApplier(result);
  
  // STAGE 7: Extreme paragraph creation
  console.log('📑 STAGE 7/15: Extreme paragraph creation...');
  result = extremeParagraphCreator(result);
  
  // STAGE 8: Add casual words
  console.log('💬 STAGE 8/15: Adding casual words...');
  const words = result.split(' ');
  for (let i = 0; i < words.length; i += Math.floor(Math.random() * 10) + 5) {
    if (Math.random() > 0.7) {
      const casual = casualWords[Math.floor(Math.random() * casualWords.length)];
      words.splice(i, 0, casual);
    }
  }
  result = words.join(' ');
  
  // STAGE 9: Add human fillers at random positions
  console.log('🎭 STAGE 9/15: Adding human fillers...');
  const fillerPositions = [0.2, 0.4, 0.6, 0.8];
  fillerPositions.forEach(pos => {
    if (Math.random() > 0.5) {
      const filler = humanFillers[Math.floor(Math.random() * humanFillers.length)];
      const insertAt = Math.floor(result.length * pos);
      const before = result.substring(0, insertAt);
      const after = result.substring(insertAt);
      result = before + ' ' + filler + ' ' + after.charAt(0).toLowerCase() + after.slice(1);
    }
  });
  
  // STAGE 10: Add rhetorical questions
  console.log('❓ STAGE 10/15: Adding rhetorical questions...');
  if (Math.random() > 0.4) {
    const questions = [
      ' Right?', ' See what I mean?', ' Know what I\'m saying?',
      ' Makes sense, doesn\'t it?', ' You feel me?', ' Get it?'
    ];
    result += questions[Math.floor(Math.random() * questions.length)];
  }
  
  // STAGE 11: Add parenthetical asides
  console.log('📌 STAGE 11/15: Adding parenthetical asides...');
  if (Math.random() > 0.5) {
    const asides = [
      ' (and this is key)', ' (believe it or not)', ' (no joke)',
      ' (seriously)', ' (I\'m not making this up)', ' (you guessed it)'
    ];
    const aside = asides[Math.floor(Math.random() * asides.length)];
    const insertAt = Math.floor(result.length * 0.7);
    const before = result.substring(0, insertAt);
    const after = result.substring(insertAt);
    result = before + aside + after;
  }
  
  // STAGE 12: Controlled typos (very subtle)
  console.log('🔤 STAGE 12/15: Adding subtle typos...');
  result = controlledTypoInserter(result);
  
  // STAGE 13: Final cleanup
  console.log('🧹 STAGE 13/15: Final cleanup...');
  result = result
    .replace(/\s+/g, ' ')
    .replace(/\s\./g, '.')
    .replace(/\.([A-Z])/g, '. $1')
    .replace(/\s+/g, ' ')
    .trim();
  
  // STAGE 14: Add one more human touch at the end
  console.log('✨ STAGE 14/15: Final human touch...');
  if (Math.random() > 0.3) {
    const closers = [
      ' That\'s what I think anyway.', ' Just my two cents.',
      ' Food for thought.', ' Something to think about.',
      ' Anyway, that\'s the gist of it.', ' So yeah, there you go.'
    ];
    result += closers[Math.floor(Math.random() * closers.length)];
  }
  
  // STAGE 15: One last cleanup
  console.log('✅ STAGE 15/15: Final polish...');
  result = result
    .replace(/\s+/g, ' ')
    .replace(/\s\./g, '.')
    .replace(/\.([A-Z])/g, '. $1')
    .replace(/\s+/g, ' ')
    .trim();
  
  console.log('✅ 15-Stage EXTREME Humanization Complete!\n');
  return result;
};

// ============================================
// ORIGINAL FUNCTIONS (kept for backward compatibility)
// ============================================
const removeAllDashes = (text) => {
  if (!text || typeof text !== 'string') return '';
  if (!text.trim()) return '';
  
  let cleanText = text
    .replace(/[-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s*([,.!?])\s*/g, '$1 ')
    .replace(/\.([A-Z])/g, '. $1')
    .trim();
    
  return cleanText;
};

const simpleHumanize = (text) => {
  if (!text || typeof text !== 'string') return '';
  if (!text.trim()) return '';

  let cleaned = removeAllDashes(text);
  
  cleaned = cleaned
    .replace(/\b(furthermore|moreover|additionally|conversely|nevertheless|however|in addition|beyond that)\b,?/gi, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([,.!?])\s*/g, '$1 ')
    .trim();

  return cleaned;
};

const professionalHumanize = (text) => {
  if (!text || typeof text !== 'string') return '';
  if (!text.trim()) return '';

  let cleanText = removeAllDashes(text);

  const aiPhrases = [
    'furthermore', 'moreover', 'additionally', 'conversely', 
    'in addition', 'beyond that', 'nevertheless', 'however'
  ];
  
  aiPhrases.forEach(phrase => {
    const regex = new RegExp(`\\b${phrase}\\b,?\\s*`, 'gi');
    cleanText = cleanText.replace(regex, '');
  });

  let sentences = cleanText
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (sentences.length === 0) return cleanText;

  let paragraphs = [];
  let currentPara = [];
  
  sentences.forEach((sentence, index) => {
    currentPara.push(sentence);
    
    if (currentPara.length >= 2 && 
        (index === sentences.length - 1 || currentPara.length >= 4 || Math.random() < 0.3)) {
      paragraphs.push(currentPara.join(' '));
      currentPara = [];
    }
  });

  if (currentPara.length > 0) paragraphs.push(currentPara.join(' '));

  let finalText = paragraphs.join('\n\n');
  
  if (finalText.length > 0) {
    finalText = finalText.charAt(0).toUpperCase() + finalText.slice(1);
  }
  
  return finalText;
};

const cnnNewsRephraser = (text) => {
  if (!text || typeof text !== 'string') return '';
  if (!text.trim()) return '';

  let cleanText = removeAllDashes(text);
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim());
  
  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  let article = [
    `CNN Exclusive`,
    `By CNN Digital Network`,
    `Updated ${formattedDate}`,
    '',
    sentences[0] || 'News report pending...',
    '',
    sentences.slice(1, 4).join(' ') || 'More details to follow...',
    '',
    'CNN has reached out to relevant authorities for comment.',
    '',
    'This is a developing story.'
  ];

  return article.join('\n\n');
};

const journalisticHumanize = (text) => {
  if (!text || typeof text !== 'string') return '';
  if (!text.trim()) return '';

  let cleanText = removeAllDashes(text);

  const aiPhrases = [
    'furthermore', 'moreover', 'additionally', 'conversely',
    'nevertheless', 'however', 'in addition', 'beyond that',
    'consequently', 'accordingly', 'thus', 'hence', 'thereafter',
    'subsequently', 'in conclusion', 'to summarize', 'firstly', 'secondly',
    'lastly', 'finally', 'in summary', 'overall', 'therefore'
  ];
  
  aiPhrases.forEach(phrase => {
    const regex = new RegExp(`\\b${phrase}\\b,?\\s*`, 'gi');
    cleanText = cleanText.replace(regex, '');
  });

  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  let article = [
    `News Analysis`,
    '',
    `By Staff Writer`,
    `Updated ${formattedDate}`,
    '',
    cleanText
  ];

  return article.join('\n\n');
};

const enhancedJournalisticHumanize = (text) => {
  if (!text || typeof text !== 'string') return '';
  if (!text.trim()) return '';

  let cleanText = removeAllDashes(text);

  const aiPhrases = [
    'furthermore', 'moreover', 'additionally', 'conversely',
    'nevertheless', 'however', 'in addition', 'beyond that',
    'consequently', 'accordingly', 'thus', 'hence', 'thereafter',
    'subsequently', 'in conclusion', 'to summarize', 'firstly', 'secondly',
    'lastly', 'finally', 'in summary', 'overall', 'therefore'
  ];
  
  aiPhrases.forEach(phrase => {
    const regex = new RegExp(`\\b${phrase}\\b,?\\s*`, 'gi');
    cleanText = cleanText.replace(regex, '');
  });

  const words = cleanText.toLowerCase().split(' ');
  const wordFrequency = {};
  words.forEach(word => {
    const cleanWord = word.replace(/[.,!?;:]/, '');
    if (cleanWord.length > 4) {
      wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
    }
  });
  
  const keywords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(entry => entry[0].charAt(0).toUpperCase() + entry[0].slice(1));
  
  const mainKeyword = keywords[0] || 'News';

  const headlineTemplates = [
    `The ${mainKeyword} Story`,
    `Why ${mainKeyword} Matters Now`,
    `Inside the ${mainKeyword} Strategy`,
    `How ${mainKeyword} Is Changing Everything`
  ];
  
  const headline = headlineTemplates[Math.floor(Math.random() * headlineTemplates.length)];

  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  let article = [
    headline,
    '',
    `By Staff Writer`,
    `Updated ${formattedDate}`,
    '',
    cleanText
  ];

  let finalText = article.join('\n\n');
  
  finalText = finalText.replace(/[-–—]/g, ' ');
  
  finalText = finalText
    .replace(/\s+/g, ' ')
    .replace(/\s\./g, '.')
    .replace(/\.([A-Z])/g, '. $1')
    .trim();
  
  return finalText;
};

const ultraHumanize = (text) => {
  if (!text || typeof text !== 'string') return '';
  if (!text.trim()) return '';

  let result = removeAllDashes(text);
  
  result = result
    .replace(/\b(?:furthermore|moreover|additionally|conversely|nevertheless|however|in addition|beyond that)\b,?/gi, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([,.!?])\s*/g, '$1 ')
    .replace(/\s+([,.!?])/g, '$1')
    .trim();

  return result;
};

const humanizeAppleText = (text) => {
  if (!text || typeof text !== 'string') return '';
  if (!text.trim()) return '';

  let cleanText = removeAllDashes(text);
  
  cleanText = cleanText
    .replace(/\b(?:furthermore|moreover|additionally|conversely|nevertheless|however|in addition|beyond that)\b,?/gi, '')
    .replace(/\s+/g, ' ')
    .replace(/\.([A-Z])/g, '. $1')
    .replace(/\s*([,.!?])\s*/g, '$1 ')
    .trim();

  return cleanText;
};

// ============================================
// API ENDPOINTS
// ============================================

app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: '🔥 EXTREME 15-STAGE AI DETECTOR BYPASS',
    version: '8.0',
    features: [
      '🔥 15-stage processing pipeline',
      '📚 1000+ synonym pairs',
      '🚫 200+ AI phrases eliminated',
      '🔄 Extreme sentence restructuring',
      '⚡ Maximum burstiness injection',
      '💬 Human filler integration',
      '❓ Rhetorical questions',
      '📌 Parenthetical asides',
      '🔤 Subtle typo insertion',
      '✂️ 50+ natural contractions'
    ],
    endpoints: [
      '/api/test - Test connection',
      '/api/ping - Ping test',
      '/api/extreme-bypass - 15-Stage Extreme Bypass (BEST)',
      '/api/ultimate-bypass-10x - 10-Stage Ultimate Bypass',
      '/api/ultimate-bypass - 7-Stage Ultimate Bypass',
      '/api/humanize - Professional humanizer',
      '/api/simple-humanize - Basic humanization',
      '/api/rephrase-news - CNN style news',
      '/api/journalistic-humanize - Basic news style',
      '/api/enhanced-journalistic - Full news articles',
      '/api/ultra-humanize - Maximum humanization',
      '/api/humanize-apple - Apple article style',
      '/api/cuban-article - Cuban news style',
      '/api/users - User management',
      '/api/health - Health check'
    ]
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Extreme 15-Stage Bypass API connected!',
    version: '8.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/ping', (req, res) => {
  res.json({ success: true, message: 'pong' });
});

// EXTREME 15-STAGE BYPASS ENDPOINT
app.post('/api/extreme-bypass', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide text' 
      });
    }

    const humanized = extremeAIDetectorBypass(text);
    
    res.json({
      success: true,
      data: {
        original: text,
        humanized: humanized,
        stats: {
          originalWords: text.split(' ').length,
          humanizedWords: humanized.split(' ').length,
          originalChars: text.length,
          humanizedChars: humanized.length
        }
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// 10-STAGE ULTIMATE BYPASS ENDPOINT
app.post('/api/ultimate-bypass-10x', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide text' 
      });
    }

    const humanized = extremeAIDetectorBypass(text);
    
    res.json({
      success: true,
      data: {
        original: text,
        humanized: humanized,
        stats: {
          originalWords: text.split(' ').length,
          humanizedWords: humanized.split(' ').length
        }
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// 7-STAGE ULTIMATE BYPASS ENDPOINT
app.post('/api/ultimate-bypass', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide text' 
      });
    }

    const humanized = extremeAIDetectorBypass(text);
    
    res.json({
      success: true,
      data: {
        original: text,
        humanized: humanized,
        stats: {
          originalWords: text.split(' ').length,
          humanizedWords: humanized.split(' ').length
        }
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// Professional humanizer endpoint
app.post('/api/humanize', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Please provide text' });
    }
    const humanized = professionalHumanize(text);
    res.json({ success: true, data: { original: text, humanized } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Simple humanizer endpoint
app.post('/api/simple-humanize', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Please provide text' });
    }
    const humanized = simpleHumanize(text);
    res.json({ success: true, data: { original: text, humanized } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CNN news rephraser endpoint
app.post('/api/rephrase-news', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Please provide text' });
    }
    const rephrased = cnnNewsRephraser(text);
    res.json({ success: true, data: { original: text, rephrased } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Journalistic humanizer endpoint
app.post('/api/journalistic-humanize', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Please provide text' });
    }
    const humanized = journalisticHumanize(text);
    res.json({ success: true, data: { original: text, humanized } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Enhanced journalistic humanizer endpoint
app.post('/api/enhanced-journalistic', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Please provide text' });
    }
    const humanized = enhancedJournalisticHumanize(text);
    res.json({ success: true, data: { original: text, humanized } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Ultra humanizer endpoint
app.post('/api/ultra-humanize', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Please provide text' });
    }
    const humanized = ultraHumanize(text);
    res.json({ success: true, data: { original: text, humanized } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Apple article humanizer endpoint
app.post('/api/humanize-apple', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Please provide text' });
    }
    const humanized = humanizeAppleText(text);
    res.json({ success: true, data: { original: text, humanized } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cuban article endpoint
app.post('/api/cuban-article', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Please provide text' });
    }
    const rephrased = enhancedJournalisticHumanize(text);
    res.json({ success: true, data: { original: text, rephrased } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Users routes
app.get('/api/users', (req, res) => {
  res.json({ success: true, data: users });
});

app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, data: user });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ success: false, error: 'Name and email required' });
  }
  const newUser = { id: users.length + 1, name: name.trim(), email: email.trim() };
  users.push(newUser);
  res.status(201).json({ success: true, data: newUser, message: 'User created successfully' });
});

app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) return res.status(404).json({ success: false, error: 'User not found' });
  if (name) users[userIndex].name = name.trim();
  if (email) users[userIndex].email = email.trim();
  res.json({ success: true, data: users[userIndex], message: 'User updated successfully' });
});

app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) return res.status(404).json({ success: false, error: 'User not found' });
  const deletedUser = users.splice(userIndex, 1)[0];
  res.json({ success: true, data: deletedUser, message: 'User deleted successfully' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found',
    requestedUrl: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    error: err.message 
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(90));
  console.log(`🔥 EXTREME 15-STAGE AI DETECTOR BYPASS v8.0`);
  console.log('='.repeat(90));
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log('='.repeat(90));
  console.log(`\n📝 RECOMMENDED ENDPOINT:`);
  console.log(`   POST http://localhost:${PORT}/api/extreme-bypass`);
  console.log('='.repeat(90));
  console.log(`\n✅ 15-STAGE PROCESSING:`);
  console.log(`   1.  Extreme Cleaning`);
  console.log(`   2.  AI Phrase Elimination`);
  console.log(`   3.  Extreme Synonym Replacement (95%)`);
  console.log(`   4.  Extreme Sentence Restructuring`);
  console.log(`   5.  Extreme Burstiness Injection`);
  console.log(`   6.  Extreme Contractions`);
  console.log(`   7.  Extreme Paragraph Creation`);
  console.log(`   8.  Casual Words Integration`);
  console.log(`   9.  Human Fillers`);
  console.log(`   10. Rhetorical Questions`);
  console.log(`   11. Parenthetical Asides`);
  console.log(`   12. Subtle Typos`);
  console.log(`   13. Final Cleanup`);
  console.log(`   14. Human Touch`);
  console.log(`   15. Final Polish`);
  console.log('='.repeat(90));
});