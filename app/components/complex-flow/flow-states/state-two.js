import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { validateTransition } from '../flow-manager';

export default class StateTwoComponent extends Component {
  @tracked
  title = '';

  get error() {
    const validation = validateTransition(
      this.args.flowState,
      'SELECT_THREE',
      this.title
    );

    return validation.error;
  }
}
