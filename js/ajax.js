function saveData()
{
	event.preventDefault();
	var sdiv = document.getElementById("success_msg");
	var ename = document.getElementById("ename").value;
	var sal = document.getElementById("salary").value;
	var desg = document.getElementById("desg").value;
	var mobile = document.getElementById("mobile").value;
	
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
	
	obj.open("POST","http://localhost/employee/addemployee.php",true);
	obj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	obj.send("ename="+ename+"&designation="+desg+"&mobile="+mobile+"&salary="+sal);
	
	obj.onreadystatechange = function(){
		if(obj.readyState == 4 && obj.status == 200)
		{
			if(obj.responseText==1)
			{
				sdiv.innerHTML = "Account Created Successfully";
				sdiv.setAttribute("class","alert alert-success");
				document.getElementById("myform").reset();
				getAllEmployees();
			}
			else if(obj.responseText==2)
			{
				
					sdiv.innerHTML = "Sorry! Unable to create an account";
				
				sdiv.setAttribute("class","alert alert-danger");
			}
			else if(obj.responseText==3)
			{
				sdiv.innerHTML = "Sorry! Unable to receive the data";
				sdiv.setAttribute("class","alert alert-danger");
			}
			else
			{
				sdiv.innerHTML = "Something Wrong!!! try again";
				sdiv.setAttribute("class","alert alert-danger");
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
				records += "<td><a href=''><span class='glyphicon glyphicon-pencil text-primary'></span></a> | <a href=''><span class='text-danger glyphicon glyphicon-trash'></span></a></td>"
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








