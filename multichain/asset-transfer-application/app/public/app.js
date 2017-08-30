

$(document).ready(function(){
    
    $("#getBalance").click(function(){
         $.get("/balance", function(data, status){
            console.log(data)
            alert(data.balance)
        });
        
    })
    
    
    $("#transfer").click(function(){
         $.ajax({
          url: "/transfer",
          type: "get", //send it through get method
          data: { 
            toAddress: $("#to-address").val(), 
            quantity: $("#quantity").val()
          },
          success: function(response) {
              console.log(response)
              alert(response.txid)
          },
          error: function(xhr) {
            console.log(xhr)
            alert("Some error occured")
          }
        });
    })
    
    
});

/*

$("#to-address").val(), $("quantity").val()

*/


/*$( document ).ready(function() {
    console.log( "ready!" );
    $.get("/hello", function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
    });
});*/



    