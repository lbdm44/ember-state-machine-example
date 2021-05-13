export default class StateConfig {
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
