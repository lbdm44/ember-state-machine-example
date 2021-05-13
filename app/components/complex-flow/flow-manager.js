import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { createMachine, interpret } from '@xstate/fsm';

const FLOW_CONFIG = {
  id: 'stateExample',
  initial: 'stateOne',
  states: {
    stateOne: {
      on: {
        NEXT: 'stateTwo',
      },
    },
    stateTwo: {
      on: {
        SELECT_THREE: 'stateThree',
        SELECT_FOUR: 'stateFour',
        SELECT_FIVE: 'stateFive',
        BACK: 'stateOne',
      },
    },
    stateThree: {
      on: {
        BACK: 'stateTwo',
      },
    },
    stateFour: {
      on: {
        BACK: 'stateTwo',
      },
    },
    stateFive: {
      on: {
        BACK: 'stateTwo',
      },
    },
  },
};

export function hasNamedEvent(state, eventName) {
  return !!Object.entries(FLOW_CONFIG.states).find(([k, v]) => {
    if (state.matches(k)) {
      return Object.keys(v.on).includes(eventName);
    }
  });
}

export default class FlowManagerComponent extends Component {
  @tracked
  flowState;

  constructor() {
    super(...arguments);

    this.machine = createMachine(FLOW_CONFIG);

    this.machineService = interpret(this.machine).start();

    this.machineService.subscribe((state) => {
      this.flowState = state;
    });
  }

  @action
  updateFlow(MSG) {
    this.machineService.send(MSG);
  }

  willDestroy() {
    super.willDestroy(...arguments);

    this.machineService.stop();
    this.machine = null;
  }
}
