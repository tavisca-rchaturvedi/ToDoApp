 
let todoData = [{
					"title" : "Assignment1"
				},{
					"title" : "Assignment2"
				},{
					"title" : "Assignment3"
				}];

const autoCompleteList= [];
//["ActionScript", "AppleScript","Asp","BASIC", "C", "C++", "Clojure", "COBOL","ColdFusion","Erlang","Fortran","Groovy","Haskell","Java","JavaScript","Lisp","Perl","PHP","Python","Ruby","Scala","Scheme"];


function autocompleteApiData(){
	fetch("https://jsonplaceholder.typicode.com/todos/")
	.then(response => response.json()) 
	.then(responseList => { autoCompleteList.push(...responseList)});
}

autocompleteApiData();

function fillContentData(data){
	document.getElementById("tabContent").innerHTML = "";
	if(data == "ToDo")
		document.getElementById("tabContent").appendChild(prepareTaskContentToBeShown());
}

function deleteItem(title){
	for(let taskIndex in todoData){
		if(todoData[taskIndex]['title'] === title){
			todoData.splice(taskIndex,1);
			break;
		}
	}
	fillContentData("ToDo");
}

function createInputElement(type, value, classOfButton, id){
		
	let inputElement = document.createElement("input");

	inputElement.setAttribute("type", type);
	inputElement.setAttribute("id", id);
	inputElement.setAttribute("value",value);
	inputElement.setAttribute("class",classOfButton);

	return inputElement;
}

function prepareTaskContentToBeShown(data = todoData){
	let arr = data;
	let element = [];

	const tabContainer = document.createElement('div');
	tabContainer.setAttribute("class", "container");

	element[0] = document.createElement('div');
	element[0].setAttribute("class", "containerInput");

	let inputElement = createInputElement("text", "", "input", "newItem")
	inputElement.setAttribute("placeholder", "Enter a new Task");
	inputElement.addEventListener("keyup",() => searchItem());

	element[0].appendChild(inputElement);

	let divElement = document.createElement("div");
	divElement.setAttribute("id","searchDropdown");

	element[0].appendChild(divElement);

	element[1] = document.createElement("div");
	element[1].setAttribute("class", "containerButton");

	inputElement = createInputElement("button","Add Item", "button", "");
	inputElement.addEventListener("click", () => addItem());

	element[1].appendChild(inputElement);

	element[2] = document.createElement("div");
	element[2].setAttribute("class", "containerTable");

	let tableElement = document.createElement("table");
	tableElement.setAttribute("border","1");

	let rows = document.createElement("tr");
	let column = document.createElement("th");
	column.innerText = "Task";
	rows.appendChild(column);

	column = document.createElement("th");
	column.innerText = "Update";
	rows.appendChild(column);

	column = document.createElement("th");
	column.innerText = "Delete";
	rows.appendChild(column);

	tableElement.appendChild(rows);


	for(let tabIndex in arr){

		rows = document.createElement("tr");
		column = document.createElement("td");
		inputElement = createInputElement("text", arr[tabIndex]['title'], "", "input"+tabIndex);
		inputElement.setAttribute("value",arr[tabIndex]['title']);
		inputElement.disabled = true;

		column.appendChild(inputElement);
		rows.appendChild(column);

		column = document.createElement("td");
		inputElement = createInputElement("button","Update", "tableButton", "update"+tabIndex);
		inputElement.addEventListener("click", () => updateItem(tabIndex));
		column.appendChild(inputElement);

		inputElement = createInputElement("button","Save", "tableButton", "save"+tabIndex);
		inputElement.setAttribute("style","display: none");
		inputElement.addEventListener("click", () => saveItem(tabIndex));

		column.appendChild(inputElement);
		rows.appendChild(column);

		column = document.createElement("td");
		inputElement = createInputElement("button","Delete", "tableButton", "");
		inputElement.addEventListener("click", () => deleteItem(arr[tabIndex]['title']));
		column.appendChild(inputElement);
		rows.appendChild(column);

		tableElement.appendChild(rows);

	}
	element[2].appendChild(tableElement);
	tabContainer.appendChild(element[0]);
	tabContainer.appendChild(element[1]);
	tabContainer.appendChild(element[2]);
	return tabContainer;
}

function addItem(data){
	let elem = document.getElementById("newItem");
	console.log(elem);
	if(elem != null){
		let inList = false;
		let newTask = data || elem.value;
		if(newTask == "") return;

		for(let tasks of todoData){
			if(tasks['title'] == newTask){
				alert('Already in list');
				inList = true;
			}
		}
		if(!inList){
			todoData.push({
				"title" : newTask
			});
		}
	}
	fillContentData("ToDo")			
}

function searchItem(){
	let searchKey = document.getElementById('newItem').value;
	let filteredTasks = autoCompleteList.filter(data => data["title"].includes(searchKey));
	console.log(filteredTasks)
	if(searchKey.length == 0 || filteredTasks.length == 0){
		document.getElementById('searchDropdown').style.display = "none";
	}
	else{
		document.getElementById('searchDropdown').style.display = "block";
		let listContent = document.createElement("ul");

		for(let task of filteredTasks){
			let listElement = document.createElement("li");
			inputElement = createInputElement("button", task["title"], "tabs", "");
			inputElement.addEventListener("click", () => addItem(task["title"]));

			listElement.appendChild(inputElement);
			listContent.appendChild(listElement);

		}
		document.getElementById('searchDropdown').innerText = "";
		document.getElementById('searchDropdown').appendChild(listContent);
	}
}	

function updateItem(itemId){
	document.getElementById('input'+itemId).disabled = false;
	document.getElementById('update'+itemId).style.display = 'none';
	document.getElementById('save'+itemId).style.display = 'block';
}

function saveItem(itemId){
	todoData[itemId]["title"] = document.getElementById('input'+itemId).value;
	document.getElementById('input'+itemId).disabled = true;
	document.getElementById('update'+itemId).style.display ='block';
	document.getElementById('save'+itemId).style.display = 'none';
}
 