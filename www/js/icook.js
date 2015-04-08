
var currentValue, newValue;
var categories;

$(document).ready(function() {
	updateCategories();
	initPageCss();
	$("header a").removeClass('ui-link ui-btn-left ui-btn ui-shadow ui-corner-all');
	

});
$(document).on("click", '.topImg', function() {

	if ($(this).hasClass("selectedImg")) {
		$(this).removeClass("selectedImg").css({"opacity":"0.4"});
		currentValue = $(".countLike").text();
		newValue = parseInt(currentValue, 10) ;
		 newValue=parseInt(newValue,10)- 1;
		$(".countLike").html(newValue);
	} else {
		$(this).addClass("selectedImg").css({"opacity":"1.0"});
		currentValue = $(".countLike").text();
		newValue = parseInt(currentValue , 10 );
		newValue=parseInt(newValue,10)+ 1;
		
		$(".countLike").html(newValue);
	}
});
$(document).on("click", '.topImgStar', function() {
	if ($(this).hasClass("selectedImgStar")) {
		$(this).removeClass("selectedImgStar").attr("src","img/star.png");
	} else {
		$(this).addClass("selectedImgStar").attr("src","img/yellohStar.png");
	}
})


$(window).resize(function() {
	initPageCss();
});
function search() {
	var word = $("header .search").val();
	console.log(word);
}

function initPageCss() {
	$("[data-role=content]").css("height", window.innerHeight - 52 + "px");
}


$(window).on('hashchange', function(e) {
	console.log(e.originalEvent)//oldURL newURL
	if (e.originalEvent.newURL.indexOf('#recipePage') != -1) {
		//viewRecipe();
	}
	if (e.originalEvent.newURL.indexOf('#registrationPage') != -1) {
		//viewRegistration();
	}
	if (e.originalEvent.newURL.indexOf('#favoritePage') != -1) {
		//viewFavorite();
	}
	if (e.originalEvent.newURL.indexOf('#myRecipesPage') != -1) {
		//viewMyRecipes();
	}
});
$(document).on("click", '[data-role=footer]', function(e) {

});

$(document).on("click", '#nav ', function (e) {
	$("[data-role=panel]").panel( "open")
});

$(function () {
	$("[data-role=panel]").enhanceWithin().panel();
});

$(document).on("pageinit", "[data-role='page']", function (event) {   
    $("[data-role='panel']").on("panelopen", function (event, ui) { 
        console.log("panel open")
        $('html').css("overflow", "hidden")
    });

    $("[data-role='panel']").on("panelclose", function (event, ui) {
        console.log("panel close")
        $('html').css("overflow", "auto")
    });
    
});
function updateCategories(){
	$.ajax({
		//url : "imcook.herokuapp.com/auxiliary/getCategories/?lang=he",
		url : "http://imcook.herokuapp.com/auxiliary/getCategories/?lang=he",
		type : 'GET',
		dataType : 'json',
		success : getCategoriesCallback,
		error : errorCallback
	});
}
function updateRate(){
	var rate=parseInt($('.countLike')[0].innerHTML,10);
	$.ajax({
		//url : "imcook.herokuapp.com/auxiliary/getCategories/?lang=he",
		url : "http://imcook.herokuapp.com/icook/updateRate",
		type : 'post',
		data:{rate:rate,recipeId:recipeId},
		dataType : 'json',
		success : setRateCallback,
		error : errorCallback
	});
}
function updateFavorites(){
	$.ajax({
		//url : "imcook.herokuapp.com/auxiliary/getCategories/?lang=he",
		url : "http://imcook.herokuapp.com/icook/updateFavorite",
		type : 'post',
		data:{email:user,recipeId:recipeId},
		dataType : 'json',
		success : setFavoriteCallback,
		error : errorCallback
	});
}
var recipeId=123;
var user="guest@gmail.com";
function viewRecipe() {
	console.log("viewRecipe")
	$.ajax({
		url : "http://imcook.herokuapp.com/icook/getRecipeById",
		type : 'post',
		data:{recipeId:recipeId},
		contantType:"application/json",
		dataType : 'json',
		success : viewRecipeCallback,
		error : errorCallback
	});
};

function viewFavorite(){
	console.log();
	$.ajax({
		url : "jsons/file.json",
		type : 'post',
		data:{recipeId:recipeId},
		contantType:"application/json",
		dataType : 'json',
		success : viewFavoriteCallback,
		error : errorCallback
	});
}
function viewMyRecipes(){
		console.log();
	$.ajax({
		url : "jsons/file.json",
		type : 'post',
		data:{recipeId:recipeId},
		contantType:"application/json",
		dataType : 'json',
		success : viewMyRecipesCallback,
		error : errorCallback
	});
}
function setFavoriteCallback(data){
	console.log(data)
}
function setRateCallback(data){
	console.log(data)
}
function getCategoriesCallback(data){
	categories=data.info;
	console.log("categories",categories)
	//viewRecipe();
	//viewFavorite();
	viewMyRecipes();
}
function viewRecipeCallback(app) {
	if(app.status==0)return;
	app=app.info;
	console.log(app)
	var r;
	var page = $("#recipePage #content");
	var container = $("<div>");
	//like Image
	
	container.append($("<img>").attr('src','img/star.png').addClass('topImgStar'));
	container.append($("<img>").attr('src','img/smalLike.png').addClass('topImg').css({"opacity":"0.4"}));
	//who much likes
	container.append("<span class='countLike'>" + app.rate + "</span>");
	//add recipe name
	container.append("<h2 class='recipeName'>" + app.name + "</h2>");
	container.append("<h4 class='recipeDes'>" + app.description + "</h4>");
	
	container.append("<p class='subTitle'> הועלה על ידי- " + /*app.userName*/"haimyy" + " </p>");
	
	var img = $('<img class="imgRecipe">');
	img.attr('src', app.images[0]);
	container.append(img);
	//check if kosher
	r=$.grep(categories.kosher.res, function(e){ return e.id == app.kosher; });
	container.append("<p class='subTitle'>" + r[0].key + " </p>");

	//check if as specialPopulations
	$.each(app.specialPopulations,function(index, val){
		r=$.grep(categories.specialPopulations.res, function(e){ return e.id == val; });
		container.append("<p class='subTitle'> "  +r[0].key	 + " </p>");
	});
	
	

	//check if dairy
	r=$.grep(categories.dairy.res, function(e){ return e.id == app.dairy; });
	container.append("<p class='subTitle'> "  +r[0].key	 + " </p>");
	
	
	container.append("</br>")
	
	
	var forWho=$("<ul>")
	$.each(app.forWho,function(index, val){
		r=$.grep(categories.forWho.res, function(e){ return e.id == val; });
		console.log(r[0])
		forWho.append("<li class='subTitle'> "  +r[0].key	 + " </li>");
		
	});
	
	forWho.append("<li class='subTitle'>:)</li>")
	container.append(forWho);
	
	//commodities
	var secCommodities = $("<section class='napkin commodities'> ");
	secCommodities.append("<h3 class=title>מצרכים</h3>");
	r=$.grep(categories.accessories.res, function(e){ return e.id == app.accessories; });
	secCommodities.append("<p class='subTitleTime'> אביזרים: "+r[0].key+"</p>")
	$.each(app.commodities, function(index, val) {
		secCommodities.append(val.name + " " + val.amount + " </br>");
	});
	container.append(secCommodities);
	
	//preparation
	var secPreparation = $("<section class='napkin preparation'> ")
	r=$.grep(categories.user.res, function(e){ return e.id == app.user; });
	secPreparation.append("<aside class=userLabal> *רמת קושי "+r[0].key+"</aside>")
	secPreparation.append("<h3 class=title>אופן הכנה</h3>");
	secPreparation.append("<p class='subTitleTime'> זמן הכנה משוער: "+app.time+" דקות </p>")
	$.each(app.preparation, function(index, val) {
		console.log(val);
		secPreparation.append((index + 1) + "." + val + " </br>");
	});
	var label=("<p>ובתאבון..</p>");
	secPreparation.append(label);
	container.append(secPreparation);
	
	//commentes
	/*var commentSection = "<section class='SecComment'> ";
	commendSection+=("<h2 class=titleComment>תגובות</h2>");
	commendSection+=("<img src='img/iconComment.png' class=imgComment></section>");
	container.append(commentSection);
	
	var commentsList =$("<section class='napkin comments'> ")
	var ul = $("<ul class='listComment'>");
	$.each(app.comments, function(index, val) {
		ul.append("<li>"+val.email+": "+val.comment+"</li>");
	});
	commentsList.append(ul);
	container.append(commentsList);
	
	var form=$("<form>").attr({"method":"post","action":"#","id":"commentform"}).addClass("formcomment");
	var inputComment=$('<input>').attr({"name":"comments","type":"text"}).addClass("inputComment");
	var inputSubmit=$('<input>').attr({"type":"submit","value":"שלח"}).addClass("inputSubmit");
	form.append(inputComment);
	form.append(inputSubmit);
	
	container.append(form);*/
	
	page.append(container);
}
$("#commentform").submit(function(e){
	e.preventDefault();
});
//Registration page
function viewPageRegistration(){
	console.log("register")
	var page = $("#registrationPage #content");
	var container = $("<div>");
	var logoImg=$("<img>").attr("src","img/logo.png");
	container.append(logoImg);
	/*var regDiv=$("<div>").addClass("regDiv");
	regDiv.append("<h3>הירשם</h3>");
	container.append(regDiv);
	var userRegDiv=$("<div>").addClass("regDiv");
	userRegDiv.append("<h3>משתמש רשום</h3>");
	container.append(userRegDiv);*/
	page.append(container);
}

function viewFavoriteCallback(data){
	console.log("favoritePage" + data.name);
	
	var recipeList=[data,data,data,data,data]
	
	var page = $("#favoritePage #content");
	var container = $("<div>");
	container.append("<h2 class=titleFavorite>המועדפים שלי</h2>")
	ulFavor=("<ul>");
	var li;
	var img;
	var div;
	var str;
	$.each(recipeList,function( index,val){
		li=("<li class='napkin listFavorite'>");
		li+=("<img src='"+ val.images[0]+ "'>");
		li+=("<div calss=recipeListName>"+val.name+"</br>"+ func(val.forWho)+"</div>");
		
		li+="</li>"
		ulFavor+=(li);
	});
	container.append(ulFavor);

	page.append(container);
}
//myRecipesPage
function viewMyRecipesCallback(data){
	console.log("MyRecipesPage" + data.name);
	
	var recipeList=[data,data,data,data,data]
	
	var page = $("#myRecipesPage #content");
	var container = $("<div>");
	container.append("<h2 class=titleFavorite>המתכונים שלי</h2>")
	ulFavor=("<ul>");
	var li;
	var img;
	var div;
	var str;
	$.each(recipeList,function( index,val){
		li=("<li class='napkin listFavorite'>");
		li+=("<img src='"+ val.images[0]+ "'>");
		li+=("<div calss=recipeListName>"+val.name+"</br>"+ func(val.forWho)+"</div>");
		
		li+="</li>"
		ulFavor+=(li);
	});
	container.append(ulFavor);

	page.append(container);
}

function func(app){
	var forWho=("<ul>");
	$.each(app,function(index, val){
		r=$.grep(categories.forWho.res, function(e){ return e.id == val; });
		console.log(r[0].key)
		forWho+=("<li class='subTitleFavorite'> "  +r[0].key	 + " </li>");
		
	});
	forWho+=("</ul>")
	console.log(forWho);
	return forWho;
} 
function errorCallback(errortype) {
	console.log(errortype)
}
