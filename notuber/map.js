var myLat = 0;
var myLng = 0;
var map;
var marker;
var me;
var array = [];
var min = 0;


function init(){
	me = new google.maps.LatLng(myLat, myLng);
	var myOptions = {
	zoom: 15, // The larger the zoom number, the bigger the zoom
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map"), myOptions);
	getMyLocation();
}

function getMyLocation() {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			data();

			
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
	}
}
function data(){
	var http = new XMLHttpRequest();
	var url = "https://glacial-wave-55792.herokuapp.com/rides";
	var params = "username=A1QsWYKl5U&lat="+myLat+"&lng="+myLng;
	http.open("POST", url, true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	alert(http.responseText);
	http.onreadystatechange = function() {
    	if(http.readyState == 4 && http.status == 200) {
        	str = JSON.parse(http.responseText);
        	if(str.passengers == undefined)
        	{	
        		ride(str.vehicles,0); 
        	}
        	else{
        		ride(str.passengers,1);
       		}
        	getmin(array);
        	renderMe(myLat,myLng);
    	}
	}
	http.send(params);	
}

function getmin(array){
	min = array[0]
	for (i = 1; i < array.length; i++)
	{
		if(array[i] < min)
			min = array[i];
	}
}
function ride(marray,bool){
	for(i = 0; i < marray.length;i++){
		newlat = marray[i].lat;
		newlng = marray[i].lng;
		name = marray[i].username;
		array[i] = renderP(newlat,newlng,name,bool);
	}
}

function renderMe(myLat, myLng) {
	me = new google.maps.LatLng(myLat, myLng);
	map.panTo(me);
	min = min * 0.621371
	marker = new google.maps.Marker({
		position: me,
		title: "Username: A1QsWYKl5U, "+ min.toFixed(2)+" miles"
	});
	marker.setMap(map);
	var infowindow = new google.maps.InfoWindow();	

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(this.title);
		infowindow.open(map, this);
	});
}




function renderP(pLat, pLng,username,bool) {
	
	p = new google.maps.LatLng(pLat, pLng);
	map.panTo(p);
	distance = calculate(pLat,pLng, myLat,myLng);
	distance = distance * 0.621371
	if(bool==1){
		marker = new google.maps.Marker({
			icon:{
				url:"bo.png",
				scaledSize: new google.maps.Size(35,35),
			},
			position: p,
			title: username +", "+ distance.toFixed(2)+"miles"
		});
	}
	if(bool==0)
	{
		marker = new google.maps.Marker({
			icon:{
				url:"car.png",
				scaledSize: new google.maps.Size(15,35),
			},
			position: p,
			title: username +", "+ distance.toFixed(2)+"m"
		});
	}

	marker.setMap(map);
	var infowindow = new google.maps.InfoWindow();	
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(this.title);
		infowindow.open(map, this);
	});
	return distance;
}



function calculate(lat1,lon1,lat2,lon2){
	Number.prototype.toRad = function() {
   	return this * Math.PI / 180;
	}
	var R = 6371; // km 

	var x1 = lat2-lat1;
	var dLat = x1.toRad();  
	var x2 = lon2-lon1;
	var dLon = x2.toRad();  
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; 
	return d
}




	

