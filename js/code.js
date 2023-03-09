const urlBase = 'http://projectreich.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	var hash = md5( password );

	console.log(login);
	console.log(password);
	
	document.getElementById("loginResult").innerHTML = "";

	if (login == "" || password =="") {
		document.getElementById('loginResult').innerHTML = "Please fill out all the required fields.";
        document.getElementById('loginResult').style.color = "red";
        return;
	}

	let tmp = {login:login,password:hash};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	console.log(xhr);
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err);
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}


// COLOR.HTML PAGE

function toggleContact() {
	let slider = document.getElementById("toggle-slider-contact");
	let buttonVal = document.getElementById("toggle-button");


	document.getElementById("addContactResult").innerHTML = "";
	
	// When slider is open, then close it
	if (slider.classList.contains("open")) {
		slider.style.display = "none";
		slider.classList.remove("open");
		buttonVal.innerHTML = "Add Contact";
		//slider.style.height = "0px";
		console.log("Closing");
	} 
	else {
		slider.style.display = "block";
		slider.classList.add("open");
		
		buttonVal.innerHTML = "Close";
		//slider.style.height = "250px";
		console.log("Opening");
	}
}

function addContact() {
	let first = document.getElementById("contactname").value;
	let last = document.getElementById("contactlastname").value;
	let email = document.getElementById("contactemail").value;
	let phone = document.getElementById("contactphone").value;

	

	document.getElementById("addContactResult").innerHTML = "";

	if (first == "" || last == "" || email == "" || phone == "") {
		document.getElementById("addContactResult").innerHTML = "Please complete all fields";
		document.getElementById("addContactResult").style.color = '#DE2C2C';
		return;
	}

	let contact = {FirstName: first, LastName: last, Email: email, PhoneNumber: phone};
	console.log(contact);

	let jsonPayload = JSON.stringify(contact);

	let url = urlBase + '/AddContact' + extension;

	let xhr = new XMLHttpRequest();
  	xhr.open("POST", url, true);
  	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  	try
  	{
		console.log(xhr);
  		xhr.onreadystatechange = function()
  		{
  			if (this.readyState == 4 && this.status == 200)
  			{
				document.getElementById("addContactResult").innerHTML = "Contact successfully added!";
				document.getElementById("addContactResult").style.color = 'green';
				
				
			}
		};
		xhr.send(jsonPayload);
  	}
  	catch(err)
  	{
  		document.getElementById("addContactResult").innerHTML = err.message;
  	}
	console.log(xhr);
}

// Loading contacts into the table from database

let contactList = [];
let index = 0;


function addRow(contactList, i) {
	
	var fullName = contactList[i]["FirstName"] + contactList[i]["LastName"];

	var phone = contactList[i]["PhoneNumber"];
	formated_phone = "("+phoneNumber.substring(0,3)+")"+phoneNumber.substring(3,6)+"-"+phoneNumber.substring(6,11);

	var email = contactList[i]["Email"];

	var edit = "<td>"+
					"<label for='editContact'>"+
						"<svg class='iconTable' onclick='editClicked(" + contactList[i].ID + ");'>"+
						"<use xlink:href='#icon-edit'></use>"+
					"</label>"+
					"<label> </label>"+
					"<label for='deleteContact'>"+
						"<svg class='iconTable' href = '#' onclick='deleteContact(" + contactList[i].ID + ");'>"+
						"<use xlink:href='#icon-delete'></use>"+
					"</label>"+
				"</td>";

	var row = "";
	row += '<tr><td>' + fullName + '</td><td>' + formated_phone + '</td><td>' + email + '</td><td>' + edit;

	return row;

}

function loadContacts(contactList) {
	var html = document.getElementById("contactTable").innerHTML;

	for (let i = 0; i < contactList.length; i++) {
		row = appendRow(contactList, i);

		html += row;
	}
	return html;
}


function searchContact() {
	let search = document.getElementById("search-bar").innerHTML;

	
}


