import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { createMachine, interpret } from '@xstate/fsm';

// TODO: co-locate state configs

class StateConfig {
  get on() {
    throw new Error('You must create an `on` field');
  }

  hasEventHandler(MSG) {
    return Object.keys(this.on).includes(MSG);
  }

  validate() {
    return { isValid: true };
  }
}

class StateOneConfig extends StateConfig {
  on = {
    NEXT: 'stateTwo',
  };
}

class StateTwoConfig extends StateConfig {
  on = {
    SELECT_THREE: 'stateThree',
    SELECT_FOUR: 'stateFour',
    SELECT_FIVE: 'stateFive',
    BACK: 'stateOne',
  };

  validate(MSG, context) {
    const validation = {
      isValid: !!MSG,
    };

    // If we are going from two to three, do not validate.
    if (MSG === 'SELECT_THREE') {
      if (context === '') {
        validation.isValid = false;
        validation.error = 'Please provide a title!';
      } else if (context.length < 3) {
        validation.isValid = false;
        validation.error = 'Title must be three characters or longer!';
      }
    }

    return validation;
  }
}

class StateThreeConfig extends StateConfig {
  on = {
    BACK: 'stateTwo',
  };
}

class StateFourConfig extends StateConfig {
  on = {
    BACK: 'stateTwo',
  };
}

class StateFiveConfig extends StateConfig {
  on = {
    BACK: 'stateTwo',
  };
}

/** @type {import('@xstate/fsm').StateMachine.Config} */
const FLOW_CONFIG = {
  id: 'stateExample',
  initial: 'stateOne',
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
