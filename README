# jQuery Ajax transport plugin for iframe-based file uploads

The jQuery iframe transport builds on the Ajax architecture introduced in
version 1.5 of jQuery to provide support for file uploads through a hidden
iframe.

## Usage

To use this plugin, you simply add a `files` option to an `$.ajax()` call,
where the value of that option is a jQuery object or a list of DOM elements
containing one or more `<input type="file">` elements:

    $("#myform").submit(function() {
        $.ajax(this.action, {
            files: $(":file", this)
        }).complete(function(data) {
            console.log(data);
        });
    });

The plugin will construct a hidden `<iframe>` element containing a copy of the
form the file field belongs to, will disable any form fields not explicitly
included, submit that form, and process the response.

If you want to include other form fields in the form submission, include them
in the `data` option, and set the `processData` option to `false`:

    $("#myform").submit(function() {
        $.ajax(this.action, {
            data: $(":text", this).serializeArray),
            files: $(":file", this),
            processData: false
        }).complete(function(data) {
            console.log(data);
        });
    });

## The Server Side

If the response is not HTML or XML, you (unfortunately) need to apply some
trickery on the server side. To send back a JSON payload, send back an HTML
`<textarea>` element with a `data-type` attribute that contains the MIME type,
and put the actual payload in the textarea:

    <textarea data-type="application/json">
      {"ok": true, "message": "Thanks so much"}
    </textarea>

The iframe transport plugin will detect this and attempt to apply the same
conversions that jQuery applies to regular responses. That means for the
example above you should get a Javascript object as the `data` parameter of
the `complete` callback, with the properties `ok: true` and
`message: "Thanks so much"`.

## Compatibility

This plugin has primarily been tested on Safari 5, Firefox 4, and Internet
Explorer all the way back to version 6. While I haven't found any issues with
it so far, I'm fairly sure it still doesn't work around all the quirks in all
different browsers. But the code is still pretty simple overall, so you should
be able to fix it and contribute a patch :)
