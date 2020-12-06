const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0]; // alert ekleyeceğimiz için seçiyoruz
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners(){  // Tüm event listenerlar
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);
}
function clearAllTodos(e){
    if (confirm("Tümünü silmek istediğinize emin misiniz ?")){
        // Arayüzden todoları temizleme
        // todoList.innerHTML = ""; // Yavaş bir yöntem
        while(todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        
        }
        localStorage.removeItem("todos");
    }
}

function filterTodos(e){
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1){
            listItem.setAttribute("style","display : none !important");
        }
        else {
            listItem.setAttribute("style","display : block");
        }

    });


}

function deleteTodo(e){
    if (e.target.className === "fa fa-remove"){
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Todo başarıyla silindi");
    }
}
function deleteTodoFromStorage(deleteTodo){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo,index){
        if (todo === deleteTodo){
            todos.splice(index,1); // delete item from array 
        }
    });

    localStorage.setItem("todos",JSON.stringify(todos));
}
function loadAllTodosToUI(){
    let todos = getTodosFromStorage();
    todos.forEach(function(todo){
        addTodoToUI(todo);

    })

}
function isExist(newtodo){
    const list = localStorage.getItem("todos");
    return list.includes(newtodo) ? true : false
}

function addTodo(e){
    const newTodo = todoInput.value.trim(); // newTodo ya todoInput değerini atıyoruz
    // let todoCount = $('.list-group-item').filter((i, li) =>{
    //     let text = $(li).text().trim().toLowerCase();
    //     return text.subtsring(0, text.length-1) === item.toLowerCase();
    // }).length;
    // if (todoCount > 0) {
    //     alert("There is allready such a task");
    //     return;
    // }                                  // trim ile başındaki ve sonundaki boşlukları silerek verir
    if (newTodo.length === 0) { // Boş bir newtodo yu eklemeyi engellemek için
        /*<div class="alert alert-danger" role="alert">
                <strong>Oh snap!</strong> Change a few things up and try submitting again.
            </div>
            */
        showAlert("danger","Lütfen bir todo girin");
                // ("type",message);
    }
    else {
        const validation =  isExist(newTodo);

        if(validation) {
            
            showAlert("danger","Girilen todo mevcut")

        }
        else {
            addTodoToUI(newTodo);
            addTodoToStorage(newTodo);
            showAlert("success","Todo başarıyla eklendi");
        }
           
    }
    

    e.preventDefault();
}
function getTodosFromStorage(){ // Storagedan tüm todoları alacak
    let todos;

    if (localStorage.getItem("todos") === null){
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos")); // JSON.parse ile array e çeviriyoruz
    }
    return todos;

}
function addTodoToStorage(newTodo){
    let todos = getTodosFromStorage();

    todos.push(newTodo);
    localStorage.setItem("todos",JSON.stringify(todos)); // array leri string e çevirmek için

}
function showAlert (type,message) {
    const alert = document.createElement("div");

    alert.className = `alert alert-${type}`;

    alert.textContent = message;

    firstCardBody.appendChild(alert);

    // setTimeout

    setTimeout(function(){ // bir saniye sonra alert silinir
        alert.remove();
    }, 1000); // 1000 = 1 sn 2000 = 2 sn
    
}

function addTodoToUI(newTodo){ // String değerini list item olarak UI'ya yani arayüzümüze ekleyecek
//     /*
//     <li class="list-group-item d-flex justify-content-between">
//             Todo 1
//             <a href="a" class="delete-item">
//                 <i class="fa fa-remove"></i>
//             </a>
//         </li> 
//     */
    // List Item Oluşturma
    const listItem = document.createElement("li");
    // Link Oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class='fa fa-remove'></i>";

    listItem.className = "list-group-item d-flex justify-content-between";

    // Text Node Ekleme

    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    // Todo List'e List Item ekleme

    todoList.appendChild(listItem);
    todoInput.value = "";
    
}