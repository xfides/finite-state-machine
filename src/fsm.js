class FSM {
  /**
   * Creates new FSM instance.
   * @param config
   */
  constructor(config) {

    if (!config) {
      error();
    }

    this.states = config.states;
    this._initState = config.initial;
    this.curState = this._initState;
    this.history = [];
    this.historyIndex = 0;

  }

  /**
   * Returns active state.
   * @returns {String}
   */
  getState() {
    return this.curState;
  }

  /**
   * Goes to specified state.
   * @param state
   */
  changeState(state) {

    let stateNames = Object.keys(this.states);
    if (stateNames.indexOf(state) === -1) {
      error();
    }

    // ---
    if (this.history.length === 0) {
      this.history.push(this.curState);
    }

    if (state === this.curState) {
      return;
    }

    this.history.push(state);

    this.historyIndex = this.historyIndex + 1;

    // ---
    this.curState = state;

  }

  /**
   * Changes state according to event transition rules.
   * @param event
   */
  trigger(event) {

    let curTransitions = this.states[this.curState].transitions;

    if (!curTransitions[event]) {
      error();
    }

    // ---

    if (this.history.length === 0) {
      this.history.push(this.curState);
    }

    if (
        !(this.historyIndex === this.history.length - 2
        &&
        curTransitions[event] === this.history[this.history.length - 1])
    ) {
      this.history.push(curTransitions[event]);
    }

    this.historyIndex = this.historyIndex + 1;

    // ---
    this.curState = curTransitions[event];

  }

  /**
   * Resets FSM state to initial.
   */
  reset() {
    this.curState = this._initState;
    this.history.push(this._initState);
  }

  /**
   * Returns an array of states for which there are specified event transition
   * rules. Returns all states if argument is undefined.
   * @param event
   * @returns {Array}
   */
  getStates(event) {

    let allStates = Object.keys(this.states);

    if (event === undefined) {
      return allStates
    }

    // ---

    let allObjTransition = [];
    for (let state in this.states) {
      allObjTransition.push(this.states[state].transitions);
    }

    let allTransitionsDirty = [];

    allObjTransition.forEach(function (objTransition) {
      allTransitionsDirty.push(...Object.keys(objTransition));
    });

    let allTransitionsClean = [... new Set(allTransitionsDirty)];

    if (allTransitionsClean.indexOf(event) === -1) {
      return [];
    }

    // ---

    let needStates = [];

    for (let state in this.states) {

      if (this.states[state].transitions[event]) {
        needStates.push(state);
      }

    }

    return needStates;

  }

  /**
   * Goes back to previous state.
   * Returns false if undo is not available.
   * @returns {Boolean}
   */
  undo() {

    let history = this.history;
    let curHistoryIndex = this.historyIndex;
    let newHistoryIndex = curHistoryIndex - 1;

    if (history.length === 0) {
      return false;
    }

    if (newHistoryIndex < 0) {
      return false;
    }

    this.historyIndex = newHistoryIndex;
    this.curState = history[newHistoryIndex];

    return true;

  }

  /**
   * Goes redo to state.
   * Returns false if redo is not available.
   * @returns {Boolean}
   */
  redo() {

    let history = this.history;
    let curHistoryIndex = this.historyIndex;
    let newHistoryIndex = curHistoryIndex + 1;

    if (history.length === 0) {
      return false;
    }

    if (newHistoryIndex >= history.length) {
      return false;
    }

    this.historyIndex = newHistoryIndex;
    this.curState = history[newHistoryIndex];

    return true;

  }

  /**
   * Clears transition history
   */
  clearHistory() {
    this.history = [];
  }
}

function error() {
  throw new Error();
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
