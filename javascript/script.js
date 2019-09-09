let todoApp = {
	"data" : []
}

let autoCompleteData = {
	"autoCompleteList" : [],

	"autoCompleteApiListPopulate" : function () {
		fetch("https://jsonplaceholder.typicode.com/todos/")
		.then(response => response.json()) 
		.then(responseList => { this.autoCompleteList.push(...responseList)});
	}
}


const tabContent = {
	"class" : "tabContent",
	"fillContentData" : function (data){
		document.getElementById(this.class).innerHTML = "";
		if(data == "ToDo")
			document.getElementById(this.class).appendChild(tabContent.prepareTaskContentToBeShown());
	},
	"deleteItem" : function (name){
		for(let taskIndex in todoApp.data){
			if(todoApp["data"][taskIndex]['name'] === name){
				todoApp.data.splice(taskIndex,1);
				apiRequests.deleteData(name);
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
			inputElement = dom.createInputElement("text", arr[tabIndex]['name'], "", "input"+tabIndex);
			inputElement.setAttribute("value",arr[tabIndex]['name']);
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
			inputElement.addEventListener("click", () => tabContent.deleteItem(arr[tabIndex]['name']));
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
				if(tasks['name'] == newTask){
					alert('Already in list');
					inList = true;
				}
			}
			if(!inList){
				todoApp.data.push({
					"name" : newTask
				});
				apiRequests.addData(newTask.toString());
				tabContent.prepareTaskContentToBeShown();
			}
		}
		tabContent.fillContentData("ToDo")	
	},

	"searchItem" : function() {
		let searchKey = document.getElementById('newItem').value;
		let filteredTasks = autoCompleteData.autoCompleteList.filter(data => data["name"].includes(searchKey));
		console.log(filteredTasks)
		if(searchKey.length == 0 || filteredTasks.length == 0){
			document.getElementById('searchDropdown').style.display = "none";
		}
		else{
			document.getElementById('searchDropdown').style.display = "block";
			let listContent = document.createElement("ul");

			for(let task of filteredTasks){
				let listElement = document.createElement("li");
				inputElement = dom.createInputElement("button", task["name"], "tabs", "");
				inputElement.addEventListener("click", () => addItem(task["name"]));

				listElement.appendChild(inputElement);
				listContent.appendChild(listElement);

			}
			document.getElementById('searchDropdown').innerText = "";
			document.getElementById('searchDropdown').appendChild(listContent);
		}
	},

	updateHelper : {},

	"updateItem": function(itemId){
		document.getElementById('input'+itemId).disabled = false;
		document.getElementById('update'+itemId).style.display = 'none';
		document.getElementById('save'+itemId).style.display = 'block';
		this.updateHelper['previousName'] = todoApp["data"][itemId]["name"];
	},
	"saveItem" : function(itemId){
		todoApp["data"][itemId]["name"] = document.getElementById('input'+itemId).value;
		document.getElementById('input'+itemId).disabled = true;
		document.getElementById('update'+itemId).style.display ='block';
		document.getElementById('save'+itemId).style.display = 'none';
		this.updateHelper['updatedName'] = todoApp["data"][itemId]["name"];

		apiRequests.updateData(this.updateHelper);
		this.updateHelper = {};
	}

}


let apiRequests = {
	"getData" : function() {	
		let xhr = new XMLHttpRequest();
		xhr.open("GET", "http://localhost:8080/api/v1/tasks/");
		xhr.send(null);
		xhr.onreadystatechange = function() {
			todoApp.data = JSON.parse(xhr.responseText);
			tabContent.prepareTaskContentToBeShown();
			console.log(todoApp)
		}
	},
	"addData" : function(data) {
		let xhr = new XMLHttpRequest();
		xhr.open("PUT", "http://localhost:8080/api/v1/tasks/add/");
		xhr.setRequestHeader("Content-Type", "text/json");
		let payload = {
			"name" : data
		};
		xhr.send(JSON.stringify(payload));

		xhr.onreadystatechange = function() {
			tabContent.fillContentData("ToDo");
		}
		
	},
	"deleteData" : function(data) {
		let xhr = new XMLHttpRequest();
		xhr.open("DELETE", "http://localhost:8080/api/v1/tasks/delete");
		xhr.setRequestHeader("Content-Type", "text/json");
		let payload = {
			"name" : data
		};
		xhr.send(JSON.stringify(payload));

		xhr.onreadystatechange = function() {
			todoApp.data = JSON.parse(xhr.responseText);
			tabContent.prepareTaskContentToBeShown();
			console.log(todoApp)
		}
	},
	"updateData" : function(data){
		let xhr = new XMLHttpRequest();
		xhr.open("PATCH", "http://localhost:8080/api/v1/tasks/update");
		xhr.setRequestHeader("Content-Type", "text/json");
		let payload = {
			"previousName" : data.previousName,
			"updatedName" : data.updatedName
		};
		xhr.send(JSON.stringify(payload));

		xhr.onreadystatechange = function() {
			todoApp.data = JSON.parse(xhr.responseText);
			tabContent.prepareTaskContentToBeShown();
			console.log(todoApp)
		}
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

autoCompleteData.autoCompleteApiListPopulate();
apiRequests.getData()


 