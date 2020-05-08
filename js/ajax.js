function saveData()
{
	event.preventDefault();
	var sdiv = document.getElementById("success_msg");
	sdiv.style.display = "block";
	var ename = document.getElementById("ename").value;
	var sal = document.getElementById("salary").value;
	var desg = document.getElementById("desg").value;
	var mobile = document.getElementById("mobile").value;
	var action = document.getElementById("form_action").value;
	if(action == 'edit')
	{
		var empid = document.getElementById("empid").value;
	}
	
	
	//name validation
	if(ename.trim() != "")
	{
		if(ename.length <= 3)
		{
			alert("Employee name should contains at least 4 chars");
			return;
		}
	}
	else
	{
		alert("Enter Employee Name");
		return false;
	}
	//Mobile Validation
	if(mobile.trim() != "")
	{
		var mobpat = /^\d{10}$/;
		if(!mobile.match(mobpat))
		{
			alert("Please enter a 10 digit mobile number");
			return false;
		}
	}
	else
	{
		alert("Enter MObile NUmber");
		return false;
	}
	//Salalry Validation
	if(sal.trim() != "")
	{
		var salpat = /^\d{4,6}$/;
		if(!sal.match(salpat))
		{
			alert("Please enter a valid salary in digits");
			return false;
		}
	}
	else
	{
		alert("Enter Salalry");
		return false;
	}
	if(desg == "")
	{
		alert("Select Designation");
		return false;
	}
	
	// Send data to server
	var obj;
	if(window.XMLHttpRequest)
	{
		obj = new XMLHttpRequest();
	}
	else
	{
		obj = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	if(action == 'add')
	{
		obj.open("POST","http://localhost/employee/addemployee.php",true);
		obj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		obj.send("ename="+ename+"&designation="+desg+"&mobile="+mobile+"&salary="+sal);
	}
	else
	{
		obj.open("POST","http://localhost/employee/editemployee.php",true);
		obj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		obj.send("empid="+empid+"&ename="+ename+"&designation="+desg+"&mobile="+mobile+"&salary="+sal);
	}
	
	obj.onreadystatechange = function(){
		if(obj.readyState == 4 && obj.status == 200)
		{
			if(obj.responseText==1)
			{
				if(action == "add")
				{
					sdiv.innerHTML = "Account Created Successfully";
				}
				else
				{
					sdiv.innerHTML = "Employee updated Successfully";
					
					document.getElementById("action_title").innerHTML = 'Add Employee';
					document.getElementById("save").value = 'Save';
					document.getElementById("form_action").value = 'add';
					document.getElementById("empid").value = '';
					
				}
				sdiv.setAttribute("class","alert alert-success");
				document.getElementById("myform").reset();
				getAllEmployees();
				setTimeout(hideMsg,3000);
			}
			else if(obj.responseText==2)
			{
				if(action == "add")
				{
					sdiv.innerHTML = "Sorry! Unable to create an account";
				}
				else
				{
					sdiv.innerHTML = "Sorry! Unable to update the record";
				}
				sdiv.setAttribute("class","alert alert-danger");
				setTimeout(hideMsg,3000);
			}
			else if(obj.responseText==3)
			{
				sdiv.innerHTML = "Sorry! Unable to receive the data";
				sdiv.setAttribute("class","alert alert-danger");
				setTimeout(hideMsg,3000);
			}
			else
			{
				sdiv.innerHTML = "Something Wrong!!! try again";
				sdiv.setAttribute("class","alert alert-danger");
				setTimeout(hideMsg,3000);
			}
		}
	}
	
}

/*Create a function to read the data from database by using ajax*/
getAllEmployees();
function getAllEmployees()
{
	var obj;
	if(window.XMLHttpRequest)
	{
		obj = new XMLHttpRequest();
	}
	else
	{
		obj = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	obj.open("GET","http://localhost/employee/viewemployees.php",true)
	obj.send();
	
	obj.onreadystatechange = function(){
		if(obj.readyState == 4 && obj.status==200)
		{
			var data = JSON.parse(obj.responseText);
			document.getElementById("empinfo").innerHTML = genarateTable(data);
		}
	}
	
}

function genarateTable(data)
{
	var records = "";
	if(data.length > 0)
	{
		var cols = Object.keys(data[0]);
		records += "<tr>";
		for(var i = 0; i< cols.length; i++)
		{
			records += "<th>"+cols[i].toUpperCase()+"</th>";
		}
		records += "<th>ACTION</th>";
		records += "</tr>";
		
		for(var j = 0; j < data.length; j++)
		{
			records += "<tr>";
				for(var k = 0; k < cols.length; k++)
				{
					records += "<td>"+data[j][cols[k]]+"</td>";
				}
				records += "<td><a href='javascript:void(0)' onclick='editRecord("+data[j].id+")'><span class='glyphicon glyphicon-pencil text-primary'></span></a> | <a href='javascript:void(0)' onclick = 'deleteRecord("+data[j].id+")'><span class='text-danger glyphicon glyphicon-trash'></span></a></td>"
			records += "</tr>";
			records += "</tr>";
		}
	
		
	}
	else
	{
		records += "Sorry! No records Found";
	}
	
	
	return records;
}

function editRecord(id)
{
	document.getElementById("action_title").innerHTML = 'Edit Employee';
	document.getElementById("save").value = 'Update Employee';
	document.getElementById("form_action").value = 'edit';
	
	var obj;
	if(window.XMLHttpRequest)
	{
		obj = new XMLHttpRequest();
	}
	else
	{
		obj = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	obj.open("GET","http://localhost/employee/getemp.php?key="+id,true)
	obj.send();
	
	obj.onreadystatechange = function()
	{
		if(obj.readyState == 4 && obj.status == 200)
		{
			var data = JSON.parse(obj.responseText);
			document.getElementById("ename").value = data.name;
			document.getElementById("salary").value = data.salary;
			document.getElementById("desg").value = data.designation;
			document.getElementById("mobile").value = data.mobile;
			document.getElementById("empid").value = data.id;
		}
	}
	
}

//delete record

function deleteRecord(id)
{
	var con = confirm("Do you want to Delete?");
	if(con==true)
	{
		var obj;
		if(window.XMLHttpRequest)
		{
			obj = new XMLHttpRequest();
		}
		else
		{
			obj = new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		obj.open("GET","http://localhost/employee/deleteemployee.php?empid="+id,true)
		obj.send();
		
		obj.onreadystatechange = function(){
			if(obj.readyState == 4 && obj.status == 200)
			{
				var sdiv = document.getElementById("success_msg");
				sdiv.style.display = "block";
				if(obj.responseText == 1)
				{
					sdiv.innerHTML = "Employee Deleted successfully";
					sdiv.setAttribute("class","alert alert-success");
					setTimeout(hideMsg,3000);
				}
				else if(obj.responseText == 1)
				{
					sdiv.innerHTML = "Unable to delete an employee";
					sdiv.setAttribute("class","alert alert-danger");
					setTimeout(hideMsg,3000);
				}
				else
				{
					sdiv.innerHTML = "Inavlid request sent to server";
					sdiv.setAttribute("class","alert alert-danger");
					setTimeout(hideMsg,3000);
				}
				getAllEmployees();
			}
		}
	}
}

function hideMsg()
{
	document.getElementById("success_msg").style.display = "none";
}



