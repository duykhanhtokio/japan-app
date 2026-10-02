import fs from 'node:fs';
const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const sidecar=JSON.parse(fs.readFileSync('src/data/dialogue-content/player-hints.json','utf8'));
let players=0,ruby=0;const coverage=Object.fromEntries(locales.map(locale=>[locale,0]));
for(const file of fs.readdirSync('src/data/generated/dialogues').filter(name=>name.endsWith('.json'))){
 const data=JSON.parse(fs.readFileSync(`src/data/generated/dialogues/${file}`,'utf8'));
 const turns=Array.isArray(data)?data:data.shared??data.N5??[];
 for(const turn of turns){if(!turn.player)continue;players++;
  const hint=sidecar[turn.id];
  if(hint&&hint.answerJa!==turn.player.recommendedAnswerJa)throw Error(`Stale hint ${turn.id}`);
  const segments=hint?.recommendedAnswerRuby??turn.player.recommendedAnswerRuby;
  if(segments){if(segments.map(part=>part.text).join('')!==turn.player.recommendedAnswerJa)throw Error(`Ruby text mismatch ${turn.id}`);for(const part of segments){if(part.reading&&!/^[ぁ-ゖー]+$/.test(part.reading))throw Error(`Invalid reading ${turn.id}`)}ruby++;}
  const translations=hint?.hintTranslations??turn.player.hintTranslations??{};
  for(const locale of locales)if(translations[locale]?.trim())coverage[locale]++;
 }
}
console.log(JSON.stringify({selectedPackage:'shared or N5',playerTurns:players,alignedRuby:ruby,hintCoverage:coverage,complete:ruby===players&&Object.values(coverage).every(count=>count===players)},null,2));
