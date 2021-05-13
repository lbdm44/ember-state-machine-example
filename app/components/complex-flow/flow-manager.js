import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { createMachine, interpret } from '@xstate/fsm';

export default class FlowManagerComponent extends Component {
  @tracked
  toggleState;

  constructor() {
    super(...arguments);

    this.machine = createMachine({
      id: 'toggle',
      initial: 'inactive',
      states: {
        inactive: { on: { TOGGLE: 'active' } },
        active: { on: { TOGGLE: 'inactive' } },
      },
    });
    this.toggleService = interpret(this.machine).start();

    this.toggleService.subscribe((state) => {
      this.toggleState = state;
    });
  }

  @action
  updateFlow() {
    this.toggleService.send('TOGGLE');
  }
}
