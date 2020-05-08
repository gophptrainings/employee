<?php 
if(isset($_REQUEST['empid']))
{
	$id = $_REQUEST['empid'];
	$con = mysqli_connect("localhost","root","","10amjs") or die("Sorry! Unable to connect");
	mysqli_query($con,"delete from employee where id=$id");
	if(mysqli_affected_rows($con))
	{
		echo 1;
	}
	else
	{
		echo 2;
	}
}
else
{
	echo 3;
}

?>