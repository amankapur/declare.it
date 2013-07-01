$(function(){

  $("select").change(function () {
    var str = "";
    $("select option:selected").each(function () {
      str = $(this).text();
    });
    conc = str.split(':')[1];
    if (conc.indexOf('Computing') > -1){
      conc = 'computing';}
    else if(conc.indexOf('Bio') > -1){
      conc = 'bio';}
    else if(conc.indexOf('Sys') > -1){
      conc = 'systems';}
    else if (conc.indexOf('Mater') > -1){
      conc = 'matsci';}
    else {conc = '';}
    
    $.post('/autoFill', {conc: conc}, function(data){
      $("#courses").find("input[type=text], textarea").val("");
      $("#courses").autofill(data);
    });
  })

  $("#pushToAutofill").click(function (){
      console.log("We're in the javascripties!!!")
      $.post('/autoFillWholeForm', function(data){
        console.log("The data we're getting back is: ", data);
        $("#toAutofill").autofill(data);
      })
  })

})