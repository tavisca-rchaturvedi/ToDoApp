let todoApp = {
	"data" : [{
				"title" : "Assignment1"
			},{
				"title" : "Assignment2"
			},{
				"title" : "Assignment3"
			}],
	
	"autoCompleteList" : [],

	"autoCompleteApiListPopulate" : function () {
		fetch("https://jsonplaceholder.typicode.com/todos/")
		.then(response => response.json()) 
		.then(responseList => { this.autoCompleteList.push(...responseList)});
	},

}


const tabContent = {
	"class" : "tabContent",
	"fillContentData" : function (data){
		document.getElementById(this.class).innerHTML = "";
		if(data == "ToDo")
			document.getElementById(this.class).appendChild(tabContent.prepareTaskContentToBeShown());
	},
	"deleteItem" : function (title){
		for(let taskIndex in todoApp.data){
			if(todoApp["data"][taskIndex]['title'] === title){
				todoApp.data.splice(taskIndex,1);
				break;
			}
		}
		this.fillContentData("ToDo");
	},
	"prepareTaskContentToBeShown" : function(data = todoApp.data){
		let arr = data;
		let element = [];

		const tabContainer = document.createElement('div');
		tabContainer.setAttribute("class", "container");

		element[0] = document.createElement('div');
		element[0].setAttribute("class", "containerInput");

		let inputElement = dom.createInputElement("text", "", "input", "newItem")
		inputElement.setAttribute("placeholder", "Enter a new Task");
		inputElement.addEventListener("keyup",() => tabContent.searchItem());

		element[0].appendChild(inputElement);

		let divElement = document.createElement("div");
		divElement.setAttribute("id","searchDropdown");

		element[0].appendChild(divElement);

		element[1] = document.createElement("div");
		element[1].setAttribute("class", "containerButton");

		inputElement = dom.createInputElement("button","Add Item", "button", "");
		inputElement.addEventListener("click", () => tabContent.addItem());

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
			inputElement = dom.createInputElement("text", arr[tabIndex]['title'], "", "input"+tabIndex);
			inputElement.setAttribute("value",arr[tabIndex]['title']);
			inputElement.disabled = true;

			column.appendChild(inputElement);
			rows.appendChild(column);

			column = document.createElement("td");
			inputElement = dom.createInputElement("button","Update", "tableButton", "update"+tabIndex);
			inputElement.addEventListener("click", () => tabContent.updateItem(tabIndex));
			column.appendChild(inputElement);

			inputElement = dom.createInputElement("button","Save", "tableButton", "save"+tabIndex);
			inputElement.setAttribute("style","display: none");
			inputElement.addEventListener("click", () => tabContent.saveItem(tabIndex));

			column.appendChild(inputElement);
			rows.appendChild(column);

			column = document.createElement("td");
			inputElement = dom.createInputElement("button","Delete", "tableButton", "");
			inputElement.addEventListener("click", () => tabContent.deleteItem(arr[tabIndex]['title']));
			column.appendChild(inputElement);
			rows.appendChild(column);

			tableElement.appendChild(rows);

		}
		element[2].appendChild(tableElement);
		tabContainer.appendChild(element[0]);
		tabContainer.appendChild(element[1]);
		tabContainer.appendChild(element[2]);
		return tabContainer;
	},
	"addItem" : function (data) {
		let elem = document.getElementById("newItem");
		console.log(elem);
		if(elem != null){
			let inList = false;
			let newTask = data || elem.value;
			if(newTask == "") return;

			for(let tasks of todoApp.data){
				if(tasks['title'] == newTask){
					alert('Already in list');
					inList = true;
				}
			}
			if(!inList){
				todoApp.data.push({
					"title" : newTask
				});
			}
		}
		tabContent.fillContentData("ToDo")	
	},

	"searchItem" : function() {
		let searchKey = document.getElementById('newItem').value;
		let filteredTasks = todoApp.autoCompleteList.filter(data => data["title"].includes(searchKey));
		console.log(filteredTasks)
		if(searchKey.length == 0 || filteredTasks.length == 0){
			document.getElementById('searchDropdown').style.display = "none";
		}
		else{
			document.getElementById('searchDropdown').style.display = "block";
			let listContent = document.createElement("ul");

			for(let task of filteredTasks){
				let listElement = document.createElement("li");
				inputElement = dom.createInputElement("button", task["title"], "tabs", "");
				inputElement.addEventListener("click", () => addItem(task["title"]));

				listElement.appendChild(inputElement);
				listContent.appendChild(listElement);

			}
			document.getElementById('searchDropdown').innerText = "";
			document.getElementById('searchDropdown').appendChild(listContent);
		}
	},

	"updateItem": function(itemId){
		document.getElementById('input'+itemId).disabled = false;
		document.getElementById('update'+itemId).style.display = 'none';
		document.getElementById('save'+itemId).style.display = 'block';
	},
	"saveItem" : function(itemId){
		todoApp["data"][itemId]["title"] = document.getElementById('input'+itemId).value;
		document.getElementById('input'+itemId).disabled = true;
		document.getElementById('update'+itemId).style.display ='block';
		document.getElementById('save'+itemId).style.display = 'none';
	}

}


const dom = {
	"createInputElement" : function (type, value, classOfButton, id) {
		let inputElement = document.createElement("input");

		inputElement.setAttribute("type", type);
		inputElement.setAttribute("id", id);
		inputElement.setAttribute("value",value);
		inputElement.setAttribute("class",classOfButton);

		return inputElement;
	}
}

todoApp.autoCompleteApiListPopulate();


 