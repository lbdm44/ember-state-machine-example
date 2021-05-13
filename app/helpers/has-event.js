import { helper } from '@ember/component/helper';
import { hasNamedEvent } from '../components/complex-flow/flow-manager';

export default helper(function hasEvent([flowState, eventName]) {
  return hasNamedEvent(flowState, eventName);
});
