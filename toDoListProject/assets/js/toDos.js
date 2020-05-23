//check off specific todos by clicking
// $("li").click(function(){
// 	//if li is gray
// 	if($(this).css("color") === "rgb(128, 128, 128)"){
// 		//turn it black
// 		$(this).css({
// 		color: "black",
// 		textDecoration: "none"
// 	});
// 	}
		
// 	//else
// 	else{
// 	//turn it gray
// 		$(this).css({
// 		color: "gray",
// 		textDecoration: "line-through"
// 	});

// 	}
		
// 	// $(this).css("color", "red");
// 	// $(this).css("text-decoration", "line-through");
// 	//******the bottom code can be used also to do the same, "-" cannot be used for property names**********
	
// });
//Check Off specific Todos by clicking
$("ul").on("click", "li", function(){
	$(this).toggleClass("completed");
})
//Click on X TO DELETE tODO
$("ul").on("click", "span", function(event){
	$(this).parent().fadeOut(500, function(){
		$(this).remove();
	});//removes entire li
	event.stopPropagation();//stops event bubbling up to other elements

})

$("input[type='text']").keypress(function(event){
	if(event.which === 13){
		//grabbing new todo text from input
		var todoText = $(this).val();
		$(this).val("");
		//create a new li and add to ul
		$("ul").append("<li><span><i class='fa fa-trash'></i></span> " + todoText + "</li>")
	}
})

$(".fa-pen-fancy").click(function(){
	$("input[type='text']").fadeToggle();/*Or fadeOut*/
})