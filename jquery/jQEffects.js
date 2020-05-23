//Fade out on click 
$("button").on("click", function(){
	$('div').fadeOut(1000, function(){
		//$(this).remove();//removes divs after fade out
		console.log("Fade Completed!");
	});
})
//Fade in divs
$("button").on("click", function(){
	$('div').fadeIn(1000, function(){
		console.log("Fade In!");
	})
})
//Toggles between fade in and out
$("button").on("click", function(){
	$('div').fadeToggle(500);
});
//Slide down of divs
$("button").on("click", function(){
	$('div').slideDown();
});
//Slide up of divs
$("button").on("click", function(){
	$('div').slideUp();
});
//Slide up and down toggle
$("button").on("click", function(){
	$('div').slideToggle();
});