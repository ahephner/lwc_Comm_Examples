import { LightningElement, api, wire } from 'lwc';
import searchProduct from '@salesforce/apex/appProduct.searchProduct'
//button examples. Note the buttons on the table don't really update the values in the table in real time. 
const columnsList = [
    {type: 'button', typeAttributes:{
        label: 'Add',
        name: 'Add',
        title: 'Add',
        disabled: false,
        value: 'add',
        variant: 'neutral'
    }, 
    cellAttributes: {
        class:{fieldName: 'selectColor', 
        style: 'transform: scale(0.75)'}
    }},{type: 'button', typeAttributes:{
        label: 'Remove',
        name: 'Remove',
        title: 'Remove',
        disabled: false,
        value: 'remove',
        variant: 'destructive'
    }, 
    cellAttributes: {
        style: 'transform: scale(0.75); visibility: hidden;'
    }},
    {label: 'Name', fieldName:'Product_Name__c'},
    {label: 'Code', fieldName:'Name'},
    {label: 'Status', fieldName:'Product_Status__c'},
    {label: 'Avg Cost', fieldName:'Average_Cost__c'},
]
export default class AppProductList extends LightningElement {
    //api need to be lower case to pass from parent
    // @api searchkey; 
    // @api prodfam; 
    // @api category; 
    loaded = false
    columnsList = columnsList; 
    prod; 
    selection = [];
    selectedRows = [];
    allSelection = [];
    newCount; 
    pageChanged; 
    startCount = -1; 
    initialLoad = true; 
    pageChanged; 

    //Cool way to add values to a table like styling based on other table values
    @wire(searchProduct)
     wiredProduct({error, data}){
     if(data){
         this.loaded = true; 
         this.prod = data.map(item=>{
             let selectColor = item.Average_Cost__c < 10 ? 'none':"slds-theme_success"
             return  {...item, 'select': false, 'selectColor':selectColor }
         }); 
         this.copy = data; 
         console.log(this.prod); 
        }
     }
   
    // @api
    // searchProd(searchKey, prodFam, category){
    //   console.log(searchKey, prodFam, category);
    //       searchKey = searchKey.toLowerCase()
    //         this.prod = this.prod.filter((x)=> {
    //           console.log(1,searchKey);              
    //            x.Product_Name__c.toLowerCase().includes(searchKey)
    //            console.log(x.Product_Name__c.toLowerCase(), typeof x.Product_Name__c);
               
    //       })
          
      
    // }    
     @api
     searchProd(searchKey, pf, cat){
         
         this.prod = this.copy;
         //console.log('==search selection '+ this.selection);
         //this.selectedRows= this.selection; 
         searchKey = searchKey.toLowerCase();
         if(searchKey === '' && pf === 'All' && cat ==='All'){
            this.prod = this.copy;
         }else if(searchKey != '' && pf === 'All' && cat ==='All'){
         this.prod = this.prod.filter(x=> x.Product_Name__c.toLowerCase().includes(searchKey) || x.Name.toLowerCase().includes(searchKey))
         }else if(searchKey === '' && pf != 'All' || cat != 'All'){
             this.prod = this.prod.filter(x => x.Product_Family__c === pf || x.Subcategory__c === cat)
         }   
        }
//on row select is a sf feature. Problem is it gives you all the rows at once so makes parsing it out very difficult
//it also does not add them to an array in order. I was trying to figure out how to make selected values persist. It works
//on selection but figuring out a way to remove them when deselected didn't work because you are not targeting that specific row
        rowSelect(e){
    
                let sr = e.detail.selectedRows;
                console.log('running '+sr.length);

              //Below here works!!!!! Need to figure out how to remove
                let allSelectedRows = this.selection;   
           // adding selected rows to all selected
           
            for(let x=0; x < sr.length; x++){
                    allSelectedRows.push(sr[x].Id);
            }
            
            
            this.selection.push(...allSelectedRows);
            console.log(1, this.selection);
            
           this.selection=[...new Set(this.selection)]
           if(sr.length > 0){
            let b = this.selection.indexOf(sr[sr.length-1].Id);
                if(b>-1){
                    console.log('splicing '+ sr[sr.length-1].Product_Name__c);
                    
                    this.selection.splice(b,1);
                    console.log(2, this.selection);
                    
                }
        }   
        }

        //calling a specific action from a button on a data table. 
        callRowAction( event ) {  
          
            const recId =  event.detail.row.Id;  
            const actionName = event.detail.action.name;
            //this is how you get specific rows 
            //event.detail.row.fieldName
            let fieldRow = event.detail.row.selectColor;
            if(actionName === 'Add'){
                console.log(fieldRow);
                
                fieldRow = 'slds-theme_success'; 
                this.selection.push(recId); 
                console.log(this.selection);
                console.log(fieldRow);
                

            }else if(actionName === 'Remove'){
                fieldRow = ''; 
                let x = this.selection.indexOf(recId);
                this.selection.splice(x, 1);
                console.log(this.selection); 
                console.log(fieldRow)  
            }
            
            
        }
    }
   
        //https://www.linkedin.com/pulse/keep-selected-rows-persistent-lightning-web-component-harsh-patel-