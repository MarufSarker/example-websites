$(document).ready(function() {
  //first preview
  buttonPressed();
  var twitterShareLink;

  //function for getting next ayah
  function buttonPressed () {
    var quoteAPI = "http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=?";
    $.ajax({
      url: quoteAPI,
      method: "GET",
      dataType: "jsonp",
      success: function(quoteData) {
        var quote = quoteData.quoteText;
        var author = quoteData.quoteAuthor;
        $('#quote').text(quote);
        $('#writer').text(author);
        quote = (quote.length > 110)?(quote.slice(0,109) + "..."):quote;
        twitterShareLink= "https://twitter.com/intent/tweet?text=" + quote + "-" + author + " @iMARUF";
        $(".twitter-share-button").attr("href", twitterShareLink);
      },
      timeout: 10000,
      error: function() {
        $('#writer').text("...");
        $('#quote').text("Something is Wrong!!!");
      },
      beforeSend: function() {
        $('#writer').text("...");
        $('#quote').text("Loading...");
      }
    });
  }
  // end of buttonPressed

  //action if button pressed
  $('#nextButton').click(function() {
    buttonPressed();
  });

  $(".twitter-share-button").click(function() {
    window.open(twitterShareLink, "popupWindow", "width=600, height=400, left=300, top=150, scrollbars=yes");
  });
});
