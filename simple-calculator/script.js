$(document).ready(function() {
  var input = "";
  var sign = "";
  var previousInput = "";
  var dotL = 0;
  var eq = 0;

  function signActivity (sign) {
    input = parseFloat(input);
    if (sign === "+") {
      if(!isNaN(input)) {previousInput += input;}
    } else if (sign === "-") {
      if(!isNaN(input)) {previousInput -= input;}
    } else if (sign === "*") {
      if(!isNaN(input)) {previousInput *= input;}
    } else if (sign === "/") {
      if(!isNaN(input)) {previousInput /= input;}
    } else if (sign === "=") {
      if (eq === 1) {
        previousInput = input;
        eq = 0;
      }
      if (!isNaN(previousInput)) {previousInput = previousInput;}
    } else {
      previousInput = input;
    }
    dotL = 0;
  }
  // end of signActivity()

  $(".btn").click(function(){
    var value = $(this).attr("value");
    var regularEx = /(\d)|(\.)/;
    if (regularEx.test(value)) {
      if (sign === "=") {
        eq = 1;
      }
      if (value === ".") {
        if (dotL === 0) {
          input = input + "" + value;
          dotL = 1;
        }
      } else {
        input = input + "" + value;
      }
      input = input.slice(0,10);
      $("#display").val(input);
    } else {
      if (typeof(input) === "string" || typeof(previousInput) === "number") {
        if (value === "AC") {
          previousInput = "";
          sign = "";
          input = "";
          dotL = 0;
          $("#display").val(previousInput);
        } else if (value === "CE") {
          input = "";
          dotL = 0;
          $("#display").val(input);
        } else if (value === "percent") {
          input = (input / 100) * previousInput;
          $("#display").val(input);
        } else {
          signActivity(sign);
          if (!isNaN(previousInput)) {
            $("#display").val(previousInput);
          }
          sign = value;
          input = "";
        }
      }
    }
  });
});
// end of ready()
