from flask import Flask, render_template, request, jsonify, session
import json
import os
from copy import deepcopy

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'change-this-secret-for-prod')

# Load game data once
DATA_PATH = os.path.join(os.path.dirname(__file__), 'game_data', 'decision_nodes.json')
with open(DATA_PATH, 'r', encoding='utf-8') as f:
    GAME_DATA = json.load(f)

# Helper: map nodes by id
NODES = {node['id']: node for node in GAME_DATA.get('nodes', [])}

# Default gauges from the JSON
DEFAULT_GAUGES = GAME_DATA.get('initialGauges', {
    'stability': 50,
    'satisfaction': 50,
    'economy': 50,
    'security': 50,
    'relations': 50
})

# Utility functions (separate logic from Flask handlers)

def clamp_gauges(gauges):
    for k, v in gauges.items():
        if isinstance(v, (int, float)):
            gauges[k] = max(0, min(100, int(v)))
    return gauges


def get_node(node_id):
    return deepcopy(NODES.get(node_id))


def apply_choice_to_state(state, node_id, choice_id):
    """Apply the effects of a choice to the current state.
    Returns (new_state, narrative_text, next_choices)
    """
    node = NODES.get(node_id)
    if not node:
        return state, 'Erreur: nœud introuvable.', []

    # find the choice
    choice = None
    for c in node.get('choices', []):
        if c.get('id') == choice_id:
            choice = c
            break
    if not choice:
        return state, 'Erreur: choix introuvable.', []

    # Apply immediate effects
    effects = choice.get('effects', {})
    for g, delta in effects.items():
        # ignore non-gauge keys
        if g in state['gauges']:
            state['gauges'][g] = state['gauges'].get(g, 0) + delta

    # Apply delayedEffects at a simple level: schedule into state['delayed'] list
    for de in choice.get('delayedEffects', []) or []:
        # store with remaining turns
        entry = deepcopy(de)
        entry['remaining'] = entry.get('afterTurns', 1)
        state.setdefault('delayed', []).append(entry)

    clamp_gauges(state['gauges'])

    # Build narrative from choice.resultText or default
    narrative = choice.get('resultText') or 'Vous prenez la décision.'

    # For this simple prototype, next node selection is naive: move to a random/next node
    # We simply return the same node as next for sequential play, but expose choices from other nodes
    # For a better game, nodes should link explicitly. Here we'll surface a few candidate nodes.
    next_choices = []
    # pick up to 4 available nodes (including current node's choices)
    # first include remaining choices in the same node (if any)
    for c in node.get('choices', []):
        if c.get('id') != choice_id:
            next_choices.append({'id': c['id'], 'text': c['text']})
    # if less than 2 choices, append choices from other nodes
    if len(next_choices) < 2:
        for nid, n in NODES.items():
            if nid == node_id:
                continue
            for c in n.get('choices', []):
                next_choices.append({'id': c['id'], 'text': c['text'], 'node': nid})
                if len(next_choices) >= 4:
                    break
            if len(next_choices) >= 4:
                break

    return state, narrative, next_choices


def process_delayed(state):
    """Decrease remaining counters and apply delayed effects when due."""
    delayed = state.get('delayed', [])
    new_delayed = []
    for entry in delayed:
        entry['remaining'] = entry.get('remaining', entry.get('afterTurns', 1)) - 1
        if entry['remaining'] <= 0:
            # apply effects
            for g, delta in entry.get('effects', {}).items():
                if g in state['gauges']:
                    state['gauges'][g] = state['gauges'].get(g, 0) + delta
        else:
            new_delayed.append(entry)
    state['delayed'] = new_delayed
    clamp_gauges(state['gauges'])


# Flask routes
@app.route('/')
def index():
    return render_template('index.html', title=GAME_DATA['metadata'].get('title', 'Bureau du Secrétaire'))


@app.route('/start')
def start():
    # initialize session state
    session['state'] = {
        'gauges': deepcopy(DEFAULT_GAUGES),
        'turn': 0,
        'delayed': []
    }
    # return intro node
    intro = get_node('intro')
    resp = {
        'text': intro.get('text', ''),
        'choices': [{'id': c['id'], 'text': c['text'], 'node': 'intro'} for c in intro.get('choices', [])],
        'gauges': session['state']['gauges']
    }
    return jsonify(resp)


@app.route('/choice', methods=['POST'])
def choice():
    data = request.get_json() or {}
    choice_id = data.get('choiceId')
    node_id = data.get('nodeId') or 'intro'

    if 'state' not in session:
        return jsonify({'error': 'Session expirée. Rechargez la page.'}), 400

    state = session['state']
    state['turn'] = state.get('turn', 0) + 1

    # Apply choice effects
    new_state, narrative, next_choices = apply_choice_to_state(state, node_id, choice_id)

    # process delayed effects after applying current choice
    process_delayed(new_state)

    session['state'] = new_state

    resp = {
        'text': narrative,
        'choices': next_choices,
        'gauges': new_state['gauges'],
        'turn': new_state['turn']
    }
    return jsonify(resp)


if __name__ == '__main__':
    app.run(debug=True)
