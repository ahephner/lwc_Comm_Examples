import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import COUNT_UPDATED_CHANNEL from '@salesforce/messageChannel/Count_Updated__c';

export default class MyTest extends LightningElement {
    subscription = null; 
    listen; 

    @wire(MessageContext)
    messageContext; 

    subscribeToMessageChannel(){
        this.subscription = subscribe(
            this.messageContext,
            COUNT_UPDATED_CHANNEL,
            (message)=>this.handleMessage(message)
        );
    }

    handleMessage(message){
        if(message){ 
        this.listen = message.connector
    }
}

    connectedCallback(){
        this.subscribeToMessageChannel();
    }
}