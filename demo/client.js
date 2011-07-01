(function($) {
  $("form :file").change(function() {
    var form = $(this.form);
    form.addClass("loading");
    $.ajax(form.prop("action"), {
      files: form.find(":file")
    }).complete(function() {
      form.removeClass("loading");
    }).success(function(data) {
      $.each(data.files, function(idx, file) {
        $("<li><b></b> (<span class='size'></span>, <span class='mime'></span>)</li>")
          .find("b").text(file.filename).end()
          .find(".size").text(formatSize(file.length)).end()
          .find(".mime").text(file.mime).end()
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
