$( document ).ready(function() {

  console.log( "Profile ready!" );

  $("input[name='name']").val('');

  $("button.edit-name").click(function(event) {
    event.preventDefault();

    $("button.edit-name").addClass("hide-name");
    $(".show-name").removeClass("hide-name");
  })

  $("button.update-name").click(function(event) {
    event.preventDefault();

    let fieldName = $('form').find("input[name='name']").val();

    let $error = $('<p>');
    $("#error-message-name").html($error);

    if (!fieldName) {
      $error.text("To update, please fill the empty fields.");
      $("#error-message-name").slideDown().addClass('show_error_msg');
    } else if (fieldName.length >= 25) {
      $error.text("Maximum number of characters reached.");
      $("#error-message-name").slideDown().addClass('show_error_msg');
    } else if (fieldName.indexOf(" ") !== -1) {
      $error.text("Remove spaces.");
      $("#error-message-name").slideDown().addClass('show_error_msg');
    } else {

      $.ajax({
        type: "POST",
        url: "/profile",
        data: {
          name: fieldName
        },
        success: (data) => {console.log("Retrieved new name!", data)}
        // ,
        // dataType: dataType
      });

      $(".show-name").addClass("hide-name");
      $("button.edit-name").removeClass("hide-name");

      $(".name-wrapper span").text(fieldName);
      $("input[name='name']").val('');
    }
  })

  $("button.edit-phone").click(function(event) {
    event.preventDefault();

    $("button.edit-phone").addClass("hide-phone");
    $(".show-phone").removeClass("hide-phone");
  })

  $("button.update-phone").click(function(event) {
    event.preventDefault();

    let fieldPhone = $('form').find("input[name='phone']").val();
    let $error = $('<p>');
    $("#error-message-phone").html($error);

    if (!fieldPhone) {
      $error.text("To update, please fill the empty fields.");
      $("#error-message-phone").slideDown().addClass('show_error_msg');
    } else if (fieldPhone.length >= 25) {
      $error.text("Maximum number of characters reached.");
      $("#error-message-phone").slideDown().addClass('show_error_msg');
    } else {

      $.ajax({
        type: "POST",
        url: "/profile",
        data: {
          phone: fieldPhone
        },
        success: (data) => {console.log("Retrieved new phone!", data)}
        // ,
        // dataType: dataType
      });

      $(".show-phone").addClass("hide-phone");
      $("button.edit-phone").removeClass("hide-phone");

      $(".phone-wrapper span").text(fieldPhone);
      $("input[name='phone']").val('');
    }
  })

});
