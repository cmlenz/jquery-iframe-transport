(function($) {
  "use strict";

  $("form").on("click", "button[type=submit]", function(evt) {
    var form = $(this.form).addClass("loading");
    evt.preventDefault();
    $.ajax(form.prop("action"), {
      data: form.find("textarea").serializeArray(),
      dataType: "json",
      files: form.find(":file"),
      iframe: true,
      processData: false
    }).always(function() {
      form.removeClass("loading");
    }).done(function(data) {
      $.each(data.files, function(idx, file) {
        $("<li><b></b> (<span class='size'></span>, <span class='mime'></span>)" +
          "<p class='comment'></p></li>")
          .find("b").text(file.filename).end()
          .find(".size").text(formatSize(file.length)).end()
          .find(".mime").text(file.mime).end()
          .find(".comment").text(data.comment || "").end()
          .appendTo("#filelist");
      });
      form.find(":file").val("");
    });
  });

  function formatSize(size) {
    var units = ["B", "KB", "MB", "GB"];
    var idx = 0;
    while (size >= 1024) {
      size /= 1024;
      idx++;
    }
    return size.toFixed(0) + " " + units[idx];
  }

})(jQuery);
