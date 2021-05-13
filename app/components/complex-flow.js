import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { createMachine, interpret } from '@xstate/fsm';

export default class ComplexFlowComponent extends Component {
  @tracked
  toggleState = 'inactive';

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
      this.toggleState = state.value;
    });
  }

  @action
  onToggle() {
    this.toggleService.send('TOGGLE');
  }
}
