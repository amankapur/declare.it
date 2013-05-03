$(function(){

	$("select").change(function () {
  var str = "";
  $("select option:selected").each(function () {
            str = $(this).text();
  });
  conc = str.split(':')[1];
  $.post('/autoFill', {conc: conc}, function(data){
  		$("#courses").autoFill(data);
	  });
	})
	.change();

})