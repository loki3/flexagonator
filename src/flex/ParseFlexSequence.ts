namespace Flexagonator {

  export function parseFlexSequence(sequence: string): FlexName[] {
    const track = new TrackState(sequence);
    for (let c of sequence) {
      track.step(c);
    }
    track.done();
    return track.getNames();
  }

  // track a (nested sequence) when we recurse
  class SequenceState {
    index: number;
    start: number = -1;
    lookingForNumber = false;
    number = "";
    names: FlexName[] = [];

    constructor(index: number) { this.index = index; }

    // expand (AB)x2 into ABAB
    getFlexes(): FlexName[] {
      const flexes: FlexName[] = [];
      const count = Number.parseInt(this.number);
      for (let i = 0; i < count; i++) {
        for (const flex of this.names) {
          flexes.push(flex);
        }
      }
      return flexes;
    }
  }

  // parse & track the state as we recurse through a flex sequence
  class TrackState {
    private readonly sequence: string;
    private states: SequenceState[] = [];

    constructor(sequence: string) {
      this.sequence = sequence;
      this.states.push(new SequenceState(0));
    }

    getNames(): FlexName[] {
      const state = this.states[this.states.length - 1];
      return state.names;
    }

    step(c: string) {
      let state = this.states[this.states.length - 1];
      if (c == '(') {
        state = this.endFlex(state);
        state = new SequenceState(state.index);
        this.states.push(state);
      } else if (c == ')') {
        state = this.endFlex(state);
        state.lookingForNumber = true;
      } else if (state.lookingForNumber && ('0' <= c && c <= '9')) {
        state.number += c;
      }
      else if (c === '>' || c === '<' || c === '^' || ('A' <= c && c <= 'Z')) {
        // we're starting a new flex, so end the previous one
        state = this.endFlex(state);
        state.start = state.index;
      }

      state.index++;
    }

    done() {
      for (let i = 0, len = this.states.length; i < len; i++) {
        this.endFlex(this.states[this.states.length - 1]);
      }
    }

    private endFlex(state: SequenceState): SequenceState {
      if (state.lookingForNumber) {
        const flexes = state.getFlexes();
        const laststate = state;
        this.states.pop();
        state = this.states[this.states.length - 1];
        for (const flex of flexes) {
          state.names.push(flex);
        }
        state.index = laststate.index;
        state.start = laststate.index;
      } else {
        this.addFlex(state);
      }
      return state;
    }

    private addFlex(state: SequenceState) {
      if (state.start != -1) {
        const substr = this.sequence.substring(state.start, state.index).trim();
        if (substr.length > 0) {
          state.names.push(makeFlexName(substr));
        }
      }
    }

  }

}
