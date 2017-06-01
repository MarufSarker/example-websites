$(document).ready(function() {
  var availBox, userBox, aiBox, userSymbol, aiSymbol, turn, gameEnded, runGame, gameStarted, gamePaused, uWin, aiWin;

  $(window).load(function() {
    $("#winContainer").hide();
    $(".symX").removeClass("btn-default");
    $(".symX").addClass("btn-primary active");
    userSymbol = "X";
    aiSymbol = "O";
    $(".mdE").removeClass("btn-default");
    $(".mdE").addClass("btn-primary active");
    runGame = "normalMode";
    $(".uPS").text(userSymbol);
    $(".aPS").text(aiSymbol);
    $(".uGW").text("00");
    $(".aGW").text("00");
    availBox = {};
    userBox = {};
    aiBox = {};
    turn = 0;
    uWin = 0;
    aiWin = 0;
    gameStarted = 0;
    gamePaused = 0;
    gameEnded = 0;
    newGame();
  });
  // end of window load()

  $(".selectedSymbol").click(function() {
    if (gamePaused === 0 && (gameStarted === 0 || gameEnded === 1)) {
      if ($(this).attr("value") === "O") {
        userSymbol = "O";
        aiSymbol = "X";
      } else if ($(this).attr("value") === "X") {
        userSymbol = "X";
        aiSymbol = "O";
      }
      $(".uPS").text(userSymbol);
      $(".aPS").text(aiSymbol);
      $(this).removeClass("btn-default");
      $(this).addClass("btn-primary active");
      if ($(this).hasClass("symX")) {
        $(".symO").removeClass("btn-primary active");
        $(".symO").addClass("btn-default");
      } else if ($(this).hasClass("symO")) {
        $(".symX").removeClass("btn-primary active");
        $(".symX").addClass("btn-default");
      }
    }
  });
  // end of selectedSymbol click()

  $(".selectedMode").click(function() {
    if (gamePaused === 0 && (gameStarted === 0 || gameEnded === 1)) {
      if ($(this).attr("value") === "normalMode") {
        runGame = "normalMode";
      } else if ($(this).attr("value") === "expertMode") {
        runGame = "expertMode";
      }
      $(this).removeClass("btn-default");
      $(this).addClass("btn-primary active");
      if ($(this).hasClass("mdE")) {
        $(".mdN").removeClass("btn-primary active");
        $(".mdN").addClass("btn-default");
      } else if ($(this).hasClass("mdN")) {
        $(".mdE").removeClass("btn-primary active");
        $(".mdE").addClass("btn-default");
      }
    }
  });
  // end of selectedMode click()

  function newGame () {
    availBox = {};
    userBox = {};
    aiBox = {};
    turn = 0;
    gameStarted = 0;
    gamePaused = 0;
    gameEnded = 0;
    $(".boardBox").empty();
  }
  // end of newGame()

  function doesWin (name, clickedBoxes, putSymbol) {
    var winGroups = [["0", "1", "2"], ["3", "4", "5"], ["6", "7", "8"], ["0", "3", "6"], ["1", "4", "7"], ["2", "5", "8"], ["0", "4", "8"], ["2", "4", "6"]];
    var winDiag;
    if (name === "You") {
      winDiag = "You Win!!!";
    } else {
      winDiag = "AI Wins!!!";
    }
    for (var winI = 0; winI < winGroups.length; winI++) {
      if ((clickedBoxes[winGroups[winI][0]] === putSymbol) && (clickedBoxes[winGroups[winI][1]] === putSymbol) && (clickedBoxes[winGroups[winI][2]] === putSymbol)) {
        gameEnded = 1;
        gameStarted = 0;
        gamePaused = 0;
        winCounter(name);
        $("#winMessage").html(winDiag);
        showMessage();
      }
    }
  }
  // end of doesWin()

  function showMessage () {
    $("#winContainer").show();
    gamePaused = 1;
  }
  // end of showMessage()

  $("#winClose").click(function() {
    $("#winContainer").hide();
    gamePaused = 0;
    if (gameEnded === 1) {
      newGame();
    }
  });
  // end of winClose click()

  function winCounter (who) {console.log(who);
    var tempWin;
    if (who === "You") {
      uWin++;
      tempWin = addZero(uWin);
      $(".uGW").text(tempWin);
    } else {
      aiWin++;
      tempWin = addZero(aiWin);
      $(".aGW").text(tempWin);
    }
  }

  function addZero (number) {
    number = number+"";
    if (number.length === 1) {
      number = "0" + number;
    }
    return number;
  }

  function aiNormTurn () {
    var ran = Math.floor(Math.random()*10);
    if ((!availBox[ran]) && (ran < 9) && (gameEnded === 0)) {
      aiBox[ran] = aiSymbol;
      availBox[ran] = aiSymbol;
      var selectorID = ".boardBox[value= " + ran + "]";
      $(selectorID).text(aiSymbol);
      $(selectorID).css("color","#FFFF4D");
      doesWin ("AI", aiBox, aiSymbol);
      turn++;
    } else if (gameEnded === 0) {
      aiNormTurn();
    }
  }
  // end of aiNormTurn()

  function aiAdd (prop) {
    aiBox[prop] = aiSymbol;
    availBox[prop] = aiSymbol;
    var selectorID = ".boardBox[value= " + prop + "]";
    $(selectorID).text(aiSymbol);
    $(selectorID).css("color","#FFFF4D");
    turn++;
    doesWin("AI", aiBox, aiSymbol);
  }
  // end of aiAdd()

  function aiExpTurn () {
    if (!aiBox[0] &&
        ( (userBox[1] && userBox[2]) ||
          (userBox[3] && userBox[6]) ||
          (userBox[4] && userBox[8]) ) ) {
      aiAdd(0);
    } else if (!aiBox[2] &&
        ( (userBox[1] && userBox[0]) ||
          (userBox[5] && userBox[8]) ||
          (userBox[4] && userBox[6]) ) ) {
      aiAdd(2);
    } else if (!aiBox[8] &&
        ( (userBox[7] && userBox[6]) ||
          (userBox[5] && userBox[2]) ||
          (userBox[4] && userBox[0]) ) ) {
      aiAdd(8);
    } else if (!aiBox[6] &&
        ( (userBox[3] && userBox[0]) ||
          (userBox[7] && userBox[8]) ||
          (userBox[4] && userBox[2]) ) ) {
      aiAdd(6);
    } else if (!aiBox[1] &&
        ( (userBox[0] && userBox[2]) ||
          (userBox[4] && userBox[7]) ) ) {
      aiAdd(1);
    } else if (!aiBox[3] &&
        ( (userBox[0] && userBox[6]) ||
          (userBox[4] && userBox[5]) ) ) {
      aiAdd(3);
    } else if (!aiBox[4] &&
        ( (userBox[3] && userBox[5]) ||
          (userBox[1] && userBox[7]) ||
          (userBox[0] && userBox[8]) ||
          (userBox[2] && userBox[6]) ) ) {
      aiAdd(4);
    } else if (!aiBox[5] &&
        ( (userBox[2] && userBox[8]) ||
          (userBox[4] && userBox[3]) ) ) {
      aiAdd(5);
    } else if (!aiBox[7] &&
        ( (userBox[6] && userBox[8]) ||
          (userBox[4] && userBox[1]) ) ) {
      aiAdd(7);
    } else {
      var ran;
      function ranGen () {
        ran = Math.floor(Math.random()*8) + 1;
        if (!availBox[ran]) {
          aiAdd(ran);
        } else {
          ranGen();
        }
      }
      ranGen();
    }
  }
  // end of aiExpTurn()

  $(".boardBox").click(function() {
    if (gamePaused === 0 && (turn > 8 || gameEnded === 1)) {
      $("#winMessage").text("GameEnded!");
      showMessage();
    } else if (gamePaused === 0 && turn % 2 === 0) {
      var boxNumber = $(this).attr("value");
      if (!availBox.hasOwnProperty(boxNumber)) {
        gameStarted = 1;
        userBox[boxNumber] = userSymbol;
        availBox[boxNumber] = userSymbol;
        $(this).text(userSymbol);
        $(this).css("color","#FF6666");
        doesWin ("You", userBox, userSymbol);
        turn++;
      } else {
        $("#winMessage").text("Checked!");
        showMessage();
      }
      if (gamePaused === 0 && (turn % 2 === 1 && gameEnded === 0)) {
        if (runGame === "normalMode" && turn < 8) {
          aiNormTurn()
        } else if (runGame === "expertMode"  && turn < 8) {
          aiExpTurn();
        }
      }
      if (gamePaused === 0 && (turn === 9 && gameEnded === 0)) {
        gameEnded = 1;
        $("#winMessage").text("Game Tied!");
        showMessage();
      }
    }
    // end of if (turn % 2 === 0)
  });
  // end of boardBox click()

});
// end of ready()
