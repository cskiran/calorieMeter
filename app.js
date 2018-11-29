//Item Controller
const ItemCtrl = (function(){
    const Item = function(id,name,calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    const data = {
        items : [
            // {id:0,name:'steak',calories:1200},
            // {id:1,name:'cookie',calories:400},
            // {id:2,name:'egg',calories:300}
        ],
        currentItem:null,
        totalCalorie: 0
    }

    return {
        
        getItems:function(){
            return data.items;
        },
        addItem:function(name,calorie){
            let ID;
            if(data.items.length > 0){
                //console.log(data.items[data.items.length - 1].id);
                ID = data.items[data.items.length - 1].id + 1;   
            }else{  
                ID =0;
            }
            calorie = parseInt(calorie);

            //create new item
             newItem = new Item(ID,name,calorie);
           // console.log(newItem);
            //adding to our array
            data.items.push(newItem);
            //console.log(data);
            return newItem;
        },
        logData: function(){
            return data;
        },
        getTotalCalories : function(){
            let totalCalorie = 0;
            data.items.forEach((item)=>{
                totalCalorie += item.calories;
            });
            return totalCalorie;
        },
        setCurrentItem : function(currentId){
            var selectedItem = null;
            //console.log(currentId);
            data.items.forEach((item)=>{
                // console.log("we");
                // console.log(item.id);
                // console.log("are");
                if(item.id === parseInt(currentId)){
                    console.log(true);
                    selectedItem = item;
                }
            });
            //console.log(selectedItem);
            data.currentItem = selectedItem;

            return data.currentItem;
        },
        UpdateListItemData : function(){
            let found = null;
            let upItem = UICtrl.getItemInput();
            // console.log(".....");
            // console.log(upItem);
            // console.log(".....");
            data.items.forEach((item)=>{
                if(item.id === data.currentItem.id){
                    found = item;
                   item.name = upItem.name;
                   item.calories = upItem.calorie;
                }
            });
            return found;
        },
        delteItemFromList : function(){
            let newList = [];
            data.items.filter((item)=>{
                if(parseInt(item.id) !== data.currentItem.id){
                    newList.push(item);
                }
            });
            data.items = newList;
            return newList;
        }
    }
})();

//UI Controller 
const UICtrl = (function(){
    const uiSelectors = {
        itemcollection : ".item-collection",
        mealBtn : ".meal-btn",
        updateBtn : ".update-btn",
        deleteBtn : ".delete-btn",
        backBtn : ".back-btn",
        itemIn : "#item-in",
        calorieIn : "#calorie-in",
        itemList : '.item-list',
        tCalories : '.calories',
        liList : '.item-collection li'
    }
    return {
        populateItems : function(items){
            let html = '';
            items.forEach((item)=>{
                html +=`
                <li id="item-${item.id}">
                    <span><strong>${item.name}</strong><em>${item.calories} calories</em></span>
                    <a href="#" class="editLink"><i class="edit-item fa fa-pencil"></i></a>
                </li>
                `
            });
            document.querySelector(uiSelectors.itemcollection).innerHTML = html;
        },
        getUiSelectors : function(){
            return uiSelectors;
        },
        getItemInput : function(){
            return {
                name : document.querySelector(uiSelectors.itemIn).value,
                calorie: document.querySelector(uiSelectors.calorieIn).value
            }
        },
        addItemToList : function(newItem){
            document.querySelector(uiSelectors.itemList).style.display = 'block';
            const li = document.createElement('li');
            li.id = `item-${newItem.id}`;
            li.innerHTML = 
            `<span><strong>${newItem.name}</strong><em>${newItem.calories} calories</em></span>
            <a href="#" class="editLink"><i class="edit-item fa fa-pencil"></i></a>`;
            document.querySelector(uiSelectors.itemcollection).insertAdjacentElement('beforeend',li);
        },
        hideList : function(){
            document.querySelector(uiSelectors.itemList).style.display = 'none';
        },
        clearInput : function(){
            //console.log("heeeeeeeeeee");
            document.querySelector(uiSelectors.itemIn).value = "";
            document.querySelector(uiSelectors.calorieIn).value = "";
        },
        updateCalorie:function(totalCalorie){
            document.querySelector(uiSelectors.tCalories).textContent = `Total Calories : ${totalCalorie}`;
        },
        clearButtons : function(){
            document.querySelector(uiSelectors.updateBtn).style.display = 'none';
            document.querySelector(uiSelectors.deleteBtn).style.display = 'none';
            document.querySelector(uiSelectors.backBtn).style.display = 'none';
            document.querySelector(uiSelectors.mealBtn).style.display = 'inline';
        },
        showButtons : function(){
            document.querySelector(uiSelectors.updateBtn).style.display = 'inline';
            document.querySelector(uiSelectors.deleteBtn).style.display = 'inline';
            document.querySelector(uiSelectors.backBtn).style.display = 'inline';
            document.querySelector(uiSelectors.mealBtn).style.display = 'none';
        },
        populateCurrentItem : function(selectedItem){
            console.log(selectedItem);
             document.querySelector(uiSelectors.itemIn).value = selectedItem.name;
             document.querySelector(uiSelectors.calorieIn).value = selectedItem.calories;
        },
        updateToNewList : function(updatedItem){
            //console.log(updatedItem);
            let listOfLi = document.querySelectorAll(uiSelectors.liList);
            listOfLi = Array.from(listOfLi);
            listOfLi.forEach((listItem)=>{
                const listId = listItem.getAttribute('id');
                if(`item-${updatedItem.id}`=== listId){
                    document.querySelector(`#${listId}`).innerHTML = `
                    <span><strong>${updatedItem.name}</strong><em>${updatedItem.calories} calories</em></span>
            <a href="#" class="editLink"><i class="edit-item fa fa-pencil"></i></a>
                    `
                }
            }
            )
        }
    }
})();

//App Controller
const App = (function(ItemCtrl,UICtrl){
    const uiIns = UICtrl.getUiSelectors();
    //load event listners
    const loadEventListner = function(){
        
        document.querySelector(uiIns.mealBtn).addEventListener('click',itemListAdd);
        document.querySelector(uiIns.itemcollection).addEventListener('click',updateItem);
        document.querySelector(uiIns.updateBtn).addEventListener('click',updateListItem);
        document.querySelector(uiIns.backBtn).addEventListener('click',backbtnFunc);
        document.querySelector(uiIns.deleteBtn).addEventListener('click',deleteItem);
    }

    //getting items to add
    const itemListAdd = function(e){
       const inputs = UICtrl.getItemInput();
       if(inputs.name !== '' && inputs.calorie !== ''){
           const newItem = ItemCtrl.addItem(inputs.name,inputs.calorie);

           //Adding to UI
           UICtrl.addItemToList(newItem);
           const totalCalorie = ItemCtrl.getTotalCalories();
           //console.log(totalCalorie);
           UICtrl.updateCalorie(totalCalorie);
           UICtrl.clearInput();
       }

        e.preventDefault();
    };
    const backbtnFunc = function(){
        UICtrl.clearButtons();
        UICtrl.clearInput();
    }
    const updateItem = function(e){
        if(e.target.classList.contains('edit-item')){
           UICtrl.showButtons();
           const listId = e.target.parentNode.parentNode.id;
           const idArr = listId.split('-');
           let selectedItem =  ItemCtrl.setCurrentItem(idArr[1]);
           //console.log(selectedItem);
            UICtrl.populateCurrentItem(selectedItem);
        }
    };
    const deleteItem = function(){
       let newitems = ItemCtrl.delteItemFromList();
       let items = ItemCtrl.getItems()
       console.log(items);
        if(items.length === 0){
            UICtrl.hideList();
           }else{
            UICtrl.populateItems(items);
           }
           const totalCalorie = ItemCtrl.getTotalCalories();
           //console.log(totalCalorie);
           UICtrl.updateCalorie(totalCalorie);
           UICtrl.clearInput();
            UICtrl.clearButtons();   
    };
    const updateListItem = function(){
        const updated = ItemCtrl.UpdateListItemData();
        UICtrl.updateToNewList(updated);
        UICtrl.clearInput();
        UICtrl.clearButtons();
        const totalCalorie = ItemCtrl.getTotalCalories();
        //console.log(totalCalorie);
        UICtrl.updateCalorie(totalCalorie);
    };
   
    return {
        init : function(){
            UICtrl.clearButtons();
            const items = ItemCtrl.getItems();
           // console.log(items);
           if(items.length === 0){
            UICtrl.hideList();
           }else{
            UICtrl.populateItems(items);
            const totalCalorie = ItemCtrl.getTotalCalories();
           //console.log(totalCalorie);
           UICtrl.updateCalorie(totalCalorie);
           }
            loadEventListner();
            
        }
    }
})(ItemCtrl,UICtrl);

App.init();
