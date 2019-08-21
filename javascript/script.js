
let todoData = [{
					"taskName" : "Assignment1"
				},{
					"taskName" : "Assignment2"
				},{
					"taskName" : "Assignment3"
				}];

let autoCompleteList= ["ActionScript", "AppleScript","Asp","BASIC", "C", "C++", "Clojure", "COBOL","ColdFusion","Erlang","Fortran","Groovy","Haskell","Java","JavaScript","Lisp","Perl","PHP","Python","Ruby","Scala","Scheme"];

function fillContentData(data){
	if(data == "ToDo")
		document.getElementById("tabContent").innerHTML = prepareTaskContentToBeShown();
	else
		document.getElementById("tabContent").innerHTML = "";
}

function deleteItem(taskName){
		for(let taskIndex in todoData){
			if(todoData[taskIndex]['taskName'] === taskName){
				todoData.splice(taskIndex,1);
			}
		}
		fillContentData("ToDo");
}

function prepareTaskContentToBeShown(data = todoData){
	let arr = data;
	console.log(arr)
		content = `
			<div class="container">
				<div class="containerInput">
					<input type="text" placeholder="Enter a new Task" class="input" id="newItem" onKeyUp="searchItem()">
					<div id="searchDropdown"></div>
				</div>
				<div class="containerButton">
					<input type="button" value="Add Item" class="button" onclick="addItem()">
				</div>
				<div class="containerTable">
					<table border=1>
						<tr>
							<th>Task</th>
							<th>Update</th>
							<th>Delete</th>
						</tr>`;
	let counter = 0;
	for(let tabIndex in arr){
		content += `<tr>
					<td><input type="text" id="input${tabIndex}" value=${arr[tabIndex]['taskName']} disabled></td>
					<td><input type="button" value="Update" onclick="updateItem(${tabIndex})" id="update${tabIndex}"> <input type="button" value="Save" id="save${tabIndex}" style="display: none" onclick="saveItem(${tabIndex})"></td>
					<td><input type="button" value="Delete" onclick=deleteItem("${arr[tabIndex]['taskName']}")></td>
				</tr>`;
	}
	content += "</div></table></div>";
	return content;
}

function addItem(data){
	console.log(data)
	let elem = document.getElementById("newItem");
	console.log(elem);
	if(elem != null){
	let newTask = data || elem.value;
		todoData.push({
			"taskName" : newTask
		});
	}
	console.log(todoData);
	fillContentData("ToDo")			
}

function searchItem(){
	let searchKey = document.getElementById('newItem').value;
	let filteredTasks = autoCompleteList.filter(data => data.includes(searchKey));

	if(searchKey.length == 0 || filteredTasks.length == 0){
		document.getElementById('searchDropdown').style.display = "none";
	}
	else{
		document.getElementById('searchDropdown').style.display = "block";
		let content = "<ul>";

		for(let task of filteredTasks){
			content += `<li><input class=tabs type=button value=${task} onclick=addItem("${task}")></li>`;
		}
		content+= "</ul>";

		document.getElementById('searchDropdown').innerHTML = content;
	}
}	

function updateItem(itemId){
	console.log(itemId);
	document.getElementById('input'+itemId).disabled = false;
	document.getElementById('update'+itemId).style.display = 'none';
	document.getElementById('save'+itemId).style.display = 'block';
}

function saveItem(itemId){
	todoData[itemId]["taskName"] = document.getElementById('input'+itemId).value;
	document.getElementById('input'+itemId).disabled = true;
	document.getElementById('update'+itemId).style.display ='block';
	document.getElementById('save'+itemId).style.display = 'none';
	console.log(todoData)
}
 