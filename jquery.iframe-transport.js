/*!
 * jQuery Iframe Transport
 * http://github.com/cmlenz/jquery-iframe-transport
 *
 * Copyright 2011, Christopher Lenz
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function($, undefined) {

  // Register an iframe transport, independent of requested data type. It will
  // only activate when the "files" option has been set to non-empty list of
  // enabled file inputs
  $.ajaxTransport("+*", function(options, origOptions, jqXHR) {
    var form = null,
        iframe = null,
        origAction = null,
        origTarget = null,
        origEnctype = null,
        addedFields = [],
        disabledFields = [],
        files = $(options.files).filter(":file:enabled");

    // This function gets called after a successful submission or an abortion
    // and should revert all changes made to the page to enable the
    // submission via this transport
    function cleanUp() {
      $(addedFields).remove();
      $(disabledFields).each(function() {
        this.disabled = false;
      });
      form.attr("action", origAction || "")
          .attr("target", origTarget || "")
          .attr("enctype", origEnctype || "");
      iframe.attr("src", "javascript:false;").remove();
    }

    if (files.length) {
      // Determine the form the file fields belong to, and make sure they all
      // actually belong to the same form
      files.each(function() {
        if (form !== null && this.form !== form) {
          jQuery.error("All file fields must belong to the same form");
        }
        form = this.form;
      });
      form = $(form);

      // Store the original form attributes that we'll be replacing temporarily
      origAction = form.attr("action");
      origTarget = form.attr("target");
      origEnctype = form.attr("enctype");

      // We need to disable all other inputs in the form so that they don't get
      // included in the submitted data unexpectedly
      form.find(":input:not(:submit)").each(function() {
        if (!this.disabled && (this.type != "file" || files.index(this) < 0)) {
          this.disabled = true;
          disabledFields.push(this);
        }
      });

      // If there is any additional data specified via the "data" option,
      // we add it as hidden fields to the form. This (currently) requires
      // the "processData" option to be set to false so that the data doesn't
      // get serialized to a string.
      if (typeof(options.data) === "string" && options.data.length > 0) {
        jQuery.error("data must not be serialized");
      }
      $.each(options.data || {}, function(name, value) {
        if ($.isPlainObject(value)) {
          name = value.name;
          value = value.value;
        }
        addedFields.push($("<input type='hidden'>").attr("name", name)
          .attr("value", value).appendTo(form));
      });
      addedFields.push($("<input type='hidden' name='X-Requested-With'>")
        .attr("value", "IFrame").appendTo(form));

      return {

        send: function(headers, completeCallback) {
          iframe = $("<iframe src='javascript:false;' name='iframe-" + $.now()
            + "' style='display:none'></iframe>");

          // The first load event gets fired after the iframe has been injected
          // into the DOM, and is used to prepare the actual submission
          iframe.bind("load", function() {

            // The second load event gets fired when the response to the form
            // submission is received
            iframe.unbind("load").bind("load", function() {
              var doc = this.contentWindow ? this.contentWindow.document :
                (this.contentDocument ? this.contentDocument : this.document),
                root = doc.documentElement ? doc.documentElement : doc.body,
                textarea = root.getElementsByTagName("textarea")[0],
                dataType = textarea ? textarea.getAttribute("data-type") : null,
                headers = {},
                contents = {};
              if (dataType) {
                headers = "Content-Type: " + dataType;
                contents.text = textarea.value;
              } else {
                headers = "Content-Type: text/html";
                contents.text = root ? root.innerHTML : null;
              }
              completeCallback(200, "OK", contents, headers);
              setTimeout(cleanUp, 50);
            });

            // Now that the load handler has been set up, reconfigure and
            // submit the form 
            form.attr("action", options.url)
              .attr("target", iframe.attr("name"))
              .attr("enctype", "multipart/form-data")
              .get(0).submit();
          });

          // After everything has been set up correctly, the iframe gets
          // injected into the DOM so that the submission can be initiated
          iframe.insertAfter(form);
        },

        abort: function() {
          if (iframe !== null) {
            iframe.unbind("load").attr("src", "javascript:false;");
            cleanUp();
          }
        }

      };
    }
  });

})(jQuery);
