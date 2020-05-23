//click event listener for alerting
$("h1").click(function(){
	alert("You clicked Me!");
})
//click event for changing background color of button
$("button").click(function(){
	$(this).css("background", "pink");
})
//loging clicked text to console
$("button").click(function(){
	var text = $(this).text();
	console.log("Hey, You clicked! " + text);
})
//keypress loged to console from input
$("input").keypress(function(){
	console.log("You Pressed a Key!");
})
//make a to do list and clear input when "enter" is hit
//"event"can also be called "e"
$("input").keypress(function(event){
	if(event.which === 13){
		alert("YOU HIT ENTER!");
	}
});
//****************On() Methods*************************************
//On() is an alternative to addEventListener
$("h1").on("click",function(){
	$(this).css("color", "purple");
})

$("input").on("keypress", function(){
	console.log("Keypressed!");
})
$("button").on("mouseenter", function(){
	$(this).css("font-weight", "bold");
	console.log("MOUSE ENTER!");
})
$("button").on("mouseleave",function(){
	$(this).css("font-weight", "normal");
	console.log("MOUSE LEAVE!");
})