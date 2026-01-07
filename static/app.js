// Front-end logic: fetch scenes and update UI

async function startGame(){
  const res = await fetch('/start');
  if(!res.ok) return showError('Impossible de démarrer la partie');
  const data = await res.json();
  updateNarrative(data.text);
  updateChoices(data.choices);
  updateGauges(data.gauges);
  pushJournal('Démarrage de la session');
}

function showError(msg){
  updateNarrative(msg);
}

function updateNarrative(text){
  const el = document.getElementById('narrative');
  el.textContent = text;
}

function clearChoices(){
  const c = document.getElementById('choices');
  c.innerHTML = '';
}

function updateChoices(choices){
  clearChoices();
  const container = document.getElementById('choices');
  choices.forEach(ch => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = ch.text;
    // attach metadata
    btn.dataset.choiceId = ch.id;
    btn.dataset.nodeId = ch.node || 'intro';
    btn.addEventListener('click', onChoice);
    container.appendChild(btn);
  });
}

async function onChoice(e){
  const btn = e.currentTarget;
  const choiceId = btn.dataset.choiceId;
  const nodeId = btn.dataset.nodeId || 'intro';
  // optimistic UI
  pushJournal('Décision: ' + btn.textContent);

  const res = await fetch('/choice', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({choiceId: choiceId, nodeId: nodeId})
  });
  if(!res.ok){
    const txt = await res.text();
    showError('Erreur serveur: ' + txt);
    return;
  }
  const data = await res.json();
  updateNarrative(data.text);
  updateGauges(data.gauges);
  // convert next choices to expected format if necessary
  const choices = (data.choices || []).map(c => ({id: c.id, text: c.text, node: c.node || nodeId}));
  updateChoices(choices);
}

function updateGauges(g){
  if(!g) return;
  ['stability','satisfaction','economy','security','relations'].forEach(k => {
    const val = g[k] || 0;
    const fill = document.getElementById('g-' + k);
    const num = document.getElementById('n-' + k);
    if(fill) fill.style.width = Math.max(0,Math.min(100,val)) + '%';
    if(num) num.textContent = val;
  });
}

function pushJournal(msg){
  const ul = document.getElementById('journal-list');
  const li = document.createElement('li');
  li.textContent = '['+ new Date().toLocaleTimeString() +'] ' + msg;
  ul.prepend(li);
  // trim
  while(ul.children.length > 8) ul.removeChild(ul.lastChild);
}

// Fetch the initial game state when the page loads
window.addEventListener('DOMContentLoaded', () => {
    fetch('/start')
        .then(response => response.json())
        .then(data => updateGameState(data));
});

// Function to update the game state dynamically
function updateGameState(data) {
    // Update narrative
    const narrativeDiv = document.getElementById('narrative');
    narrativeDiv.textContent = data.narrative;

    // Update gauges
    const gauges = data.gauges;
    document.querySelector('#party-stability progress').value = gauges.party_stability;
    document.querySelector('#public-satisfaction progress').value = gauges.public_satisfaction;
    document.querySelector('#planned-economy progress').value = gauges.planned_economy;
    document.querySelector('#internal-security progress').value = gauges.internal_security;
    document.querySelector('#international-relations progress').value = gauges.international_relations;

    // Update choices
    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
    data.choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice.text;
        button.addEventListener('click', () => makeChoice(choice.id));
        choicesDiv.appendChild(button);
    });

    // Update journal (optional, if history is provided)
    if (data.history) {
        const historyList = document.getElementById('history');
        historyList.innerHTML = '';
        data.history.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.textContent = entry;
            historyList.appendChild(listItem);
        });
    }
}

// Function to handle player choices
function makeChoice(choiceId) {
    fetch('/choice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ choice_id: choiceId })
    })
        .then(response => response.json())
        .then(data => updateGameState(data));
}
