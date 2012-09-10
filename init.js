var CSSLint = require('csslint').CSSLint;

function buildTitle(documentName, errorCount) {
  return errorCount + ' errors in ' + documentName;
}

var window;

Hooks.addMenuItem("Actions/CSS/CSSLint document", "cmd-ctrl-alt-c", function () {

    var doc = Document.current(),
        result = CSSLint.verify(doc.text);
    
    // Only show the window if we have errors.
    if (result.messages) {
      var messages = result.messages;

      if (typeof window === 'undefined') {
        window = new Window();
        window.htmlPath = 'index.html';
        window.buttons = ["OK"];
        window.onButtonClick = function() { window.close(); }
        window.size = {width: 250, height: 300};

        window.onMessage = function (name, arguments) {
          if (name === 'goToLine') {
            var lineNum = arguments[0];

            Recipe.run(function (recipe) {
              // Line number is 0 indexed in chocolat.
              // Don't need to verify if lineNum is 0 since it should never be.
              var range = recipe.characterRangeForLineIndexes(new Range(lineNum - 1,0));
              recipe.selection = range;
            });
          }
        };
      }

      window.title = buildTitle(doc.filename(), messages.length);
      window.run();
      window.applyFunction('hinted', [result.messages]);

    } else {
      Alert.show("No errors", "Awesome work!", ["OK"]);
    }
});