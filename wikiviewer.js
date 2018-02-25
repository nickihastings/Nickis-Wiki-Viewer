$(document).ready(function(){
  /*when the search field has focus expand it, and contract it. */
  $('.form-control').focus(function(){
    $(this).animate({
      width:"100%"}, 200);
  });
  $('.form-control').focusout(function(){
    $(this).animate({
      width:"190px"}, 200);
  });
  
  /* function to get the position of the results and scroll
  them up the page */
  /*need to add the function to the jquery prototype.*/
  $.fn.ScrollUp = function(){ 
    return this.each(function () {
      $('html, body').animate({
        scrollTop: $(this).offset().top
      }, 1000);
    });
  }
  /*declare the search variable which holds the user search phrase*/
  var search = '';
  
  /*listen for a click on the search button and record the search phrase*/
  $('#find').click(function(){
    search = $('#searchme').val();
    if(search.length > 1){
      getResults();
    }
  });
  /*listen for enter/return key press to trigger getResults*/
  $('#searchme').keypress(function(e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
      e.preventDefault();
      search = $('#searchme').val();
      if(search.length > 1){
        getResults();
      }
    }
});
  
  /*call the api to get the results*/
  function getResults(){
    var wikiurl = "https://en.wikipedia.org/w/api.php?action=opensearch&limit=20&origin=*&search=" + encodeURIComponent(search);
  
    $.ajax( {
      type: "GET",
      url: wikiurl,
      dataType: 'json',
      headers: {'Api-User-Agent': 'Nicki-Wiki'},
      success: function(data) {
        var datalength = data[1].length; /*stores number of results*/
        var count = 0; /*counts the number of iterations*/
        var addhtml = ''; /*collect the html output*/
        var col1html = ''; /*store col1 html*/
        var col2html = ''; /*store col2 html*/
        /*iterate over each array for title, excerpt and link, until the count matches the number of results*/
        while(count < datalength){
          for(var i = 1; i < data.length; i++){
            if(i===1){ //if it's a title
              addhtml += '<h3>' + data[i][count] + '</h3>';

            }
            else if(i===2){ //if it's an excerpt
              addhtml += '<p>' + data[i][count] + '</p>';
            }
            else{ //if it's a link
              addhtml += '<p><a href="' + data[i][count] + '">Read more...</a>';
              /*check whether the html should be added to column 1 or column 2*/
              if(count % 2 === 1){
                col1html += addhtml;
              }
              else {
                col2html += addhtml;
              }
              count++;
              addhtml = '';
            }

          } /*end for*/
        } /*end while*/
        
        //update the page with the results
        $('#col1 .fadebg').html(col1html).css("background-color", "rgba(255, 255, 255, 0.5)");
        $('#col2 .fadebg').html(col2html).css("background-color", "rgba(255, 255, 255, 0.5)");
        //scroll the page up to display the results
        $('#text-display').ScrollUp();
      },
      error: function(err) { console.log("Failure!..."); console.log(err); }
  } );
  }
  
  
});