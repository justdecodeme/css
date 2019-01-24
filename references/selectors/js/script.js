function htmlencode(str) {
    return str.replace(/[&<>"']/g, function ($0) {
        return "&" + {
            "&": "amp",
            "<": "lt",
            ">": "gt",
            '"': "quot",
            "'": "#39"
        } [$0] + ";";
    });
}

function titleCase(str) {
    // var splitStr = str.toLowerCase().split(' ');
    var splitStr = str.split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

var ul = document.getElementById('selectorsListing');
var inner = '';

/************************/
/* loop for updating css and html - NORMAL order*/
/************************/
for (var key in contentObj) {
  if (contentObj.hasOwnProperty(key)) {
    inner +=
      `
      <li id="${key}">
        <h2>${contentObj[key]['heading']}</h2>
        <div class="content">
          <div class="css">
            <textarea>${contentObj[key]['css']}</textarea>              
          </div>
          <div class="html">
            <textarea>${htmlencode(contentObj[key]['html'])}</textarea>               
            </div>
          <div class="output">
            <iframe frameborder="0"></iframe>
          </div>
        </div>       
      </li> 
    `;
  }
}
ul.innerHTML = inner;

var li = ul.querySelectorAll('li');
for(var i = 0; i < li.length; i++) {

    var textareaCSS = li[i].querySelector('.css textarea');
    let codemirrorCSS = CodeMirror.fromTextArea(textareaCSS, {
        lineNumbers     : true,
        lineWrapping    : true,
        mode            : "css",
        htmlMode        : true,
        theme           : "twilight",
        tabSize         : 4,
        indentUnit      : 4
    });    

    var textareaHTML = li[i].querySelector('.html textarea');
    let codemirrorHTML = CodeMirror.fromTextArea(textareaHTML, {
        lineNumbers     : true,
        lineWrapping    : true,
        mode            : "htmlmixed",
        htmlMode        : true,
        theme           : "twilight",
        tabSize         : 4,
        indentUnit      : 4
    });    

}


/************************/
/* loop for updating css and html - REVERSE order*/
/************************/
// f is a function that has the obj as 'this' and the property name as first parameter
// function reverseForIn(obj, f) {
//     var arr = [];
//     for (var key in obj) {
//         // add hasOwnPropertyCheck if needed
//         arr.push(key);
//     }
//     for (var i = arr.length - 1; i >= 0; i--) {
//         f.call(obj, arr[i]);
//     }
//     ul.innerHTML = inner;
// }

//USAGE
// reverseForIn(contentObj, function (key) {
//     inner +=
//         `
//       <li id="${key}">
//         <h2>${titleCase(this[key]['heading'])}</h2>
//         <div class="content">
//           <div class="css">
//             <pre><code class="language-css">${this[key]['css']}</code></pre>              
//           </div>
//           <div class="html">
//             <pre><code class="language-html">${htmlencode(this[key]['html'])}</code></pre>               
//             </div>
//           <div class="output">
//             <iframe frameborder="0"></iframe>
//           </div>
//         </div>       
//       </li> 
//     `;
// });

/************************/
/* loop for updating iframe */
/************************/
for (var key in contentObj) {
    if (contentObj.hasOwnProperty(key)) {

        var iframe = document.getElementById(key).querySelector('iframe');
        var frameDoc = iframe.document;
        if (iframe.contentWindow)
            frameDoc = iframe.contentWindow.document; // IE
        // Write into iframe
        frameDoc.open();
        frameDoc.writeln(
            "<style>" +
            contentObj[key]['css'] +
            "</style>" +
            contentObj[key]['html']
        );
        frameDoc.close();
    }
}