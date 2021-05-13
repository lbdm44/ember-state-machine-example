import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import StateConfig from '../../../utils/state-config';

function validate(title) {
  const validation = {
    isValid: true,
  };

  if (title === '') {
    validation.isValid = false;
    validation.error = 'Please provide a title!';
  } else if (title.length < 3) {
    validation.isValid = false;
    validation.error = 'Title must be three characters or longer!';
  }

  return validation;
}

export class StateTwoConfig extends StateConfig {
  on = {
    SELECT_THREE: 'stateThree',
    SELECT_FOUR: 'stateFour',
    SELECT_FIVE: 'stateFive',
    BACK: 'stateOne',
  };

  exit(ctx) {
    ctx.whereFrom = 'stateTwo';
  }

  validate(MSG, context) {
    let validation = {
      isValid: !!MSG,
    };

    // If we are going from two to three, validate that we have a valid title.
    if (MSG === 'SELECT_THREE') {
      validation = validate(context);
    }

    return validation;
  }
}

export default class StateTwoComponent extends Component {
  @tracked
  title = '';

  get error() {
    return validate(this.title).error;
  }
}
