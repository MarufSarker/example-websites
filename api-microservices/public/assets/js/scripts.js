function sizeHandler (size) {
  var sizeTag;
  size = size / 1000;
  if (size > 1000) {
    size = size / 1000;
    if (size > 1000) {
      sizeTag = "GB";
    } else {
      sizeTag = "MB";
    }
  } else {
    sizeTag = "KB";
  }
  size = size + "";
  size = size.split('');
  if (size.indexOf('.') !== -1) {
    size.splice(size.indexOf('.') + 3, size.length);
    size = size.join('');
  } else {
    size = size.join('');
  }
  size = size + " " + sizeTag;
  return size;
}

$(document).ready(function () {
  $('#timestampForm').on('submit', function(e) {
    e.preventDefault();
    var $form = $(this);
    var term = $form.find( "input[name='timestamp']" ).val();

    var posting = $.post('/api/time/post', {
      timestamp: term
    });
    posting.done(function (data) {
      data = JSON.parse(data)
      var unixDiv = document.createElement('div');
      var naturalDiv = document.createElement('div');
      unixDiv.innerHTML = "<strong>Unix: </strong>" + data.unix;
      naturalDiv.innerHTML = "<strong>Natural: </strong>" + data.natural;
      $('#jsonData').empty().append(unixDiv, naturalDiv);
    });
  });


  $('#fileUpload').on('submit', function(e) {
    e.stopPropagation();
    e.preventDefault();
    var data = new FormData();
    data.append('uploadedFile', $('#fileContainer')[0].files[0]);

    $.ajax({
      url: window.location.origin + '/upload/',
      type: 'POST',
      data: data,
      cache: false,
      processData: false,
      contentType: false,
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('ERRORS: Something went wrong');
      },
      success: function(data) {
        var nameDiv = document.createElement('div');
        var sizeDiv = document.createElement('div');
        var typeDiv = document.createElement('div');
        nameDiv.innerHTML = "<strong>File-name: </strong>" + data.name;
        sizeDiv.innerHTML = "<strong>File-size: </strong>" + sizeHandler(data.size) + " (" + data.size + " bytes)";
        typeDiv.innerHTML = "<strong>File-type: </strong>" + data.type;
        $('#fileJsonData').empty().append(nameDiv, sizeDiv, typeDiv);
      }
    });

  });
});

$(document).ready(function () {
  $('.dropdownMain').change(function(){
    var selectedItem = $(this).val();
    if (selectedItem === 'none') {
      $('.iTem').hide();
    } else {
      var toBeHidden = '.iTem:not(#' + selectedItem + ')';
      var toBeShow = '#' + selectedItem;
      $(toBeHidden).hide();
      $(toBeShow).show();
    }
  });
});
