import fs from 'fs';

// Read the original challenger demo report
const originalContent = fs.readFileSync('challenger-demo-report.html', 'utf8');

// Step 1: Basic text replacements
let sentinelContent = originalContent
  .replace(/The Challenger 9/g, 'The Sentinel 8')
  .replace(/Challenger 9/g, 'Sentinel 8')
  .replace(/challenger 9/g, 'sentinel 8')
  .replace(/The Challenger/g, 'The Sentinel')
  .replace(/Challenger/g, 'Sentinel')
  .replace(/challenger/g, 'sentinel');

// Step 2: Replace specific personality patterns
sentinelContent = sentinelContent
  .replace(/wired for control, strength, and protection/g, 'driven by self-reliance, control, and independence')
  .replace(/You step forward when others step back, but secretly feel exhausted/g, 'You stand alone and strong, but secretly feel isolated')
  .replace(/Your 9 influence craves harmony, yet you seem to attract conflict/g, 'Your 8 intensity drives justice, yet you struggle with vulnerability')
  .replace(/power and peace-seeking/g, 'power and self-reliance')
  .replace(/conflict avoidance/g, 'independence focus')
  .replace(/harmony/g, 'justice')
  .replace(/exhausted/g, 'isolated')
  .replace(/peace-seeking/g, 'self-reliant')
  .replace(/avoid conflict/g, 'maintain control')
  .replace(/step back from confrontation/g, 'stand firm in authority')
  .replace(/merging with others/g, 'protecting independence')
  .replace(/losing yourself in relationships/g, 'losing control over situations')
  .replace(/procrastination/g, 'over-control')
  .replace(/stubbornness/g, 'domination')
  .replace(/avoiding important decisions/g, 'forcing decisions on others')
  .replace(/inner laziness/g, 'inner vulnerability')
  .replace(/spiritual sloth/g, 'emotional blindness')
  .replace(/inertia/g, 'aggression')
  .replace(/comfortable routine/g, 'protective boundaries')
  .replace(/peaceful mediator/g, 'powerful protector')
  .replace(/diplomatic/g, 'direct')
  .replace(/steady presence/g, 'commanding presence')
  .replace(/bringing people together/g, 'taking charge of situations')
  .replace(/creating harmony/g, 'enforcing justice')
  .replace(/patient listener/g, 'decisive leader')
  .replace(/calming influence/g, 'protective strength')
  .replace(/seeing all sides/g, 'cutting through confusion')
  .replace(/bridge-builder/g, 'barrier-breaker')
  .replace(/consensus-maker/g, 'decision-maker');

// Step 3: Update brain-heart disconnect message
sentinelContent = sentinelContent
  .replace(/PROCRASTINATION PARALYSIS DETECTED/g, 'CONTROL DEPENDENCY DETECTED')
  .replace(/Your brain wants to act, but your heart fears disrupting the peace/g, 'Your brain wants to trust, but your heart fears losing control')
  .replace(/This creates the challenger's paradox: enormous power held back by the desire for harmony/g, 'This creates the sentinel\'s paradox: enormous strength isolated by the need for self-protection');

// Step 4: Update hero title
sentinelContent = sentinelContent
  .replace(/The Challenger's Journey to Integrated Power/g, 'The Sentinel\'s Journey to Vulnerable Strength')
  .replace(/From Conflict to Harmony/g, 'From Control to Connection');

// Save the result
fs.writeFileSync('sentinel-8-challenger-copy.html', sentinelContent);
console.log('✅ Sentinel 8 copy created successfully');
console.log('📄 File saved as: sentinel-8-challenger-copy.html');
console.log(`📊 Length: ${sentinelContent.length} characters`);