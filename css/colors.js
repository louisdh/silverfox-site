var changecolors = function(){
	
		
var random =  Math.floor(Math.random()*6);
	
// random = 0;

if (random === 0){
	
	document.getElementById('Background_layer').style.background = '#ebcca6';
	// document.getElementById('header').style.background = '#a53c30';
   document.body.style.background = '#a53c30';
	document.getElementById('AppBar').style.background = '#c45043';
	document.getElementById('Footer_real').style.background = '#a53c30';


}

if (random === 1){
	
	document.getElementById('Background_layer').style.background = '#ebcca6';
	// document.getElementById('header').style.background = '#a53c30';
   document.body.style.background = '#a53c30';
	document.getElementById('AppBar').style.background = '#c45043';
	document.getElementById('Footer_real').style.background = '#a53c30';
}

if (random === 2){
	
	document.getElementById('Background_layer').style.background = '#ebcca6';
	// document.getElementById('header').style.background = '#a53c30';
   document.body.style.background = '#a53c30';
	document.getElementById('AppBar').style.background = '#c45043';
	document.getElementById('Footer_real').style.background = '#a53c30';

}

if (random === 3){
	
	document.getElementById('Background_layer').style.background = '#d8e8ed';
	// document.getElementById('header').style.background = '#abc7cb';
   document.body.style.background = '#abc7cb';
	document.getElementById('AppBar').style.background = '#abc7cb';
	document.getElementById('Footer_real').style.background = '#abc7cb';

}

if (random === 4){

	document.getElementById('Background_layer').style.background = '#ebcda2';
	document.getElementById('header').style.background = '#ac4500';
   document.body.style.background = '#ac4500';
	document.getElementById('AppBar').style.background = '#ac4500';
	document.getElementById('Footer_real').style.background = '#ac4500';

}

if (random === 5){

	document.getElementById('Background_layer').style.background = '#936031';
	// document.getElementById('header').style.background = '#c89569';
   document.body.style.background = '#c89569';
	document.getElementById('AppBar').style.background = '#c89569';
	document.getElementById('Footer_real').style.background = '#c89569';

}



console.log(random);

}


window.onload=function() {

	changecolors();
	

}

