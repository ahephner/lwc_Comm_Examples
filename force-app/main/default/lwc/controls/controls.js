import { LightningElement } from 'lwc';

export default class Controls extends LightningElement {
    factors = [0,2,3,4,5,6];
    handleAdd() {
      console.log('controls js')
        this.dispatchEvent(new CustomEvent('add'));
      }
      handleSubtract() {
        this.dispatchEvent(new CustomEvent('subtract'));
      }
      handleMultiply(event) {
        const factor = event.target.dataset.factor;
        console.log('HandleMultiply '+ event.target.dataset)
        this.dispatchEvent(new CustomEvent('multiply', {
          detail: factor
        }));
      }
}