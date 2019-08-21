
let todoData = [{
					"taskName" : "Assignment1"
				},{
					"taskName" : "Assignment2"
				},{
					"taskName" : "Assignment3"
				}];


function fillContentData(data){
	if(data == "ToDo")
		document.getElementById("tabContent").innerHTML = prepareTaskContentToBeShown();
	else
		document.getElementById("tabContent").innerHTML = "";

		console.log(document.getElementById("tabContent").innerHTML)

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

	for(let tabData of arr){
		content += `<tr>
					<td>${tabData['taskName']}</td>
					<td><input type="button" value="Update"></td>
					<td><input type="button" value="Delete"></td>
				</tr>`;
	}
	content += "</div></table></div>";
	return content;
}

function addItem(){
	let elem = document.getElementById("newItem");
	if(elem != null){
	let newTask = elem.value;
		todoData.push({
			"taskName" : newTask
		});
	}
	console.log(todoData);
	fillContentData("ToDo")			
}

function searchItem(){
	let content = `<div class="dropdown">`
	let searchKey = document.getElementById('newItem').value;
	let filteredTasks = todoData.filter(data => data["taskName"].includes(searchKey));
	console.log(filteredTasks)
	if(searchKey.length == 0){
		console.log("Should be none")
		document.getElementById('searchDropdown').style.display = "none";
	}
	else{
		document.getElementById('searchDropdown').style.display = "block";
		let content = "<ul>";

		for(let task of filteredTasks){
			content += `<li><input class=tabs type=button value=${task['taskName']}></li>`;
		}
		content+= "</ul>";

		document.getElementById('searchDropdown').innerHTML = content;
	}

}	

