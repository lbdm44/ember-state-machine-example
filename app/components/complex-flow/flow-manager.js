import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { createMachine, interpret } from '@xstate/fsm';

import StateConfig from '../../utils/state-config';
import { StateTwoConfig } from './flow-states/state-two';

class StateOneConfig extends StateConfig {
  on = {
    NEXT: 'stateTwo',
  };
}

class StateThreeConfig extends StateConfig {
  on = {
    BACK: 'stateTwo',
  };
}

class StateFourConfig extends StateConfig {
  on = {
    NEXT: 'stateFive',
    BACK: 'stateTwo',
  };

  exit(ctx) {
    ctx.whereFrom = 'stateFour';
  }
}

class StateFiveConfig extends StateConfig {
  on = {
    BACK: [
      {
        target: 'stateTwo',
        cond: (context) => {
          return context.whereFrom === 'stateTwo';
        },
      },
      {
        target: 'stateFour',
      },
    ],
  };
}

const FLOW_CONFIG = {
  id: 'stateExample',
  initial: 'stateOne',
  context: {
    whereFrom: '',
  },
  states: {
    stateOne: new StateOneConfig(),
    stateTwo: new StateTwoConfig(),
    stateThree: new StateThreeConfig(),
    stateFour: new StateFourConfig(),
    stateFive: new StateFiveConfig(),
  },
};

function getStateConfig(currentState) {
  return FLOW_CONFIG.states[currentState.value];
}

export function validateTransition(currentState, MSG, context) {
  const stateConfig = getStateConfig(currentState);

  return stateConfig?.validate(MSG, context);
}

export function hasNamedEvent(currentState, MSG) {
  const stateConfig = getStateConfig(currentState);

  if (!stateConfig) {
    return false;
  }

  return stateConfig.hasEventHandler(MSG);
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
  updateFlow(MSG, ctx) {
    const validation = validateTransition(this.flowState, MSG, ctx);

    if (!validation.isValid) {
      alert(`Invalid transition!: ${validation.error}`);
      return;
    }

    this.machineService.send(MSG);
  }

  willDestroy() {
    super.willDestroy(...arguments);

    this.machineService.stop();
    this.machine = null;
  }
}
