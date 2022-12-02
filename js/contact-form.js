(function () {
  var contactFormUtils = {
    isValidEmail: function (email) {
      var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      return regex.test(email);
    },
	
	isValidPhone: function (phone) {
	var regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
	return regex.test(phone);
	},
	
	isValidText: function (text) {
	var regex = /^(\w+\S+)$/;
	return regex.test(text);
	}, 

    clearErrors: function () {
      $('#emailAlert').remove();
      $('#feedbackForm .help-block').hide();
      $('#feedbackForm .form-detail').removeClass('has-error');
	  $('#feedbackForm .has-error .fa').removeClass('fa-times').show('slow');
    },
    clearForm: function () {
      $('#feedbackForm .fa').removeClass('fa-times');
      $('#feedbackForm input').val("");
      grecaptcha.reset();
    },
    addError: function ($input) {
      var parentFormGroup = $input.parents('.form-detail');
      parentFormGroup.find('.help-block').show('slow');
      parentFormGroup.addClass('has-error');
	  $('#feedbackForm .fa').removeClass('fa-times');
	 $('#feedbackForm .has-error .fa').addClass('fa-times').show('slow');
    },
    addAjaxMessage: function(msg, isError) {
      $("#feedbackSubmit").after('<div id="emailAlert" class="alert alert-' + (isError ? 'danger' : 'success') + '" style="margin-top: 5px;">' + $('<div/>').text(msg).html() + '</div>');
    }
  };

  $(document).ready(function() {
			
    $("#feedbackSubmit").click(function() {
      var $btn = $(this);
      $btn.button('loading');
      contactFormUtils.clearErrors();

      
      var $form = $("#feedbackForm"),
        hasErrors = false;
      if ($form.validator) {
        hasErrors =  $form.validator('validate').hasErrors;
      } else {
        $('#feedbackForm input').not('.optional').each(function() {
          var $this = $(this);
          if (($this.is(':checkbox') && !$this.is(':checked')) || !$this.val()) {
            hasErrors = true;
            contactFormUtils.addError($(this));
          }
        });
        var $email = $('#email');
        if (!contactFormUtils.isValidEmail($email.val())) {
          hasErrors = true;
          contactFormUtils.addError($email);
        }
		 var $phone = $('#phone');
		if (!contactFormUtils.isValidPhone($phone.val())) {
          hasErrors = true;
          contactFormUtils.addError($phone);
        }
		
        var $text = $('#name');
        if (!contactFormUtils.isValidText($text.val())) {
          hasErrors = true;
          contactFormUtils.addError($text);
        } 
    
      }
      //if there are any errors return without sending e-mail
      if (hasErrors) {
        $btn.button('reset');
        return false;
      }
      //send the feedback e-mail
      $.ajax({
        type: "GET",
        url: "library-old/sendmail.php",
        data: $form.serialize(),
        success: function(data) {
          contactFormUtils.addAjaxMessage(data.message, false);
          contactFormUtils.clearForm();
        },
        error: function(response) {
          contactFormUtils.addAjaxMessage(response.responseJSON.message, true);
        },
        complete: function() {
          $btn.button('reset');
		  $('#emailAlert').delay(5000).fadeOut(400);
        }
     });
      return false;
    });
  });
})();



