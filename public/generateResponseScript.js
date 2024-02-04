import { GoogleGenerativeAI } from '@google/generative-ai';


const MDEditor = function(options) {
    
    this.options = options;
    this.EditorDivs = document.querySelectorAll(this.options.div);

    const render = () => {

      this.EditorDivs.forEach((el) => {

        let html = el.innerHTML;
        let htmlcpy = html;

        html = html.replace(/(\*\*\*(.+)\*\*\*)/g , "<strong><i>$2</i></strong>");
        html = html.replace(/(\*\*(.+)\*\*)/g , "<strong>$2</strong>");
        html = html.replace(/(\*(.+)\*)/g , "<i>$2</i>");

        html = html.replace(/(\_\_\_(.+)\_\_\_)/g , "<strong><i>$2</i></strong>");
        html = html.replace(/(\_\_(.+)\_\_)/g , "<strong>$2</strong>");
        html = html.replace(/(\_(.+)\_)/g , "<i>$2</i>");

        html = functions.headingTags(html);
        html = functions.backQuote(html);
        html = functions.codeTag(html);
        html = functions.horizontalRule(html);
        html = functions.imageTag(html);
        html = functions.linkTag(html);
        html = functions.ulList(html);
        html = functions.markTag(html);

        if(html === htmlcpy) return;
        el.innerHTML = html
      });
    }

    let getHTML = () => {

        let htmlArray = [];
        this.EditorDivs.forEach((el) => {

            render();
            let html = el.innerHTML;
            htmlArray.push(html);

          });

          return htmlArray;
    }


    const functions = {

        makeEditable : () => {
            this.EditorDivs.forEach((el) => {
                el.contentEditable = true;
            });
        },

        headingTags : (html) => {

            if(this.options.headings === false) return html;

            html = html.replace(/\#\#\#\#\#\#\#\# (.+)/g , "<h8>$1</h8>");
            html = html.replace(/\#\#\#\#\#\#\# (.+)/g , "<h7>$1</h7>");
            html = html.replace(/\#\#\#\#\#\# (.+)/g , "<h6>$1</h6>");
            html = html.replace(/\#\#\#\#\# (.+)/g , "<h5>$1</h5>");
            html = html.replace(/\#\#\#\# (.+)/g , "<h4>$1</h4>");
            html = html.replace(/\#\#\# (.+)/g , "<h3>$1</h3>");
            html = html.replace(/\#\# (.+)/g , "<h2>$1</h2>");
            html = html.replace(/\# (.+)/g , "<h1>$1</h1>");
            html = html.replace(/\<br\>/, "");

            return html;
        },

        backQuote : (html) => {
            if(this.options.quote === false) return html

            html = html.replace(/\;/, "")
            html = html.replace(/\&gt (.+)/g, "<blockquote>$1</blockquote>");
            html = html.replace(/\<br\>/, "")

            return html;
        },

        codeTag : (html) => {
            if(this.options.code === false) return html;

            html = html.replace(/\`(.+)\`/g, "<code>$1</code>");
            return html
        },

        horizontalRule : (html) => {
            if(this.options.horizontalRule === false) return html;

            html = html.replace(/\-\-\-/g, "<hr>");
            return html;
        },

        linkTag : (html) => {
            if(this.options.links === false) return html;

            html = html.replace(/\[(.+)\]\((.+)\)/g, `<a href = "$2">$1</a>`);
            return html;
        },

        imageTag : (html) => {
            if(this.options.images === false) return html;

            html = html.replace(/\!\[(.+)\]\((.+)\)/g, `<img src="$2" alt="$1"></img>`);
            return html;
        },

        ulList : (html) => {
            if(this.options.ulList === false) return html;

            html = html.replace(/(\- )/mg, "&#8226 ");
            return html;
        },

        markTag : (html) => {
            if(this.options.mark === false) return html;

            html = html.replace(/\=\=(.+)\=\=/ , "<mark>$1</mark>");
            return html;
        },

    }


    this.options.editable ? functions.makeEditable() : "";
    this.render = render;
    this.getHTML = getHTML;
}

//CONSTANTS
// const API_KEY = 'AIzaSyBQLUoLVcHBj9of9egVZi1IKKsejApwjM0';

//FUNCS
document.addEventListener('DOMContentLoaded', function () {
    const apiKeyHandler = document.getElementById("APIKEY");
    const promptHandler = document.getElementById("prompt");
    const btn = document.getElementById("submit");
    const zeroMdResponseHandler = document.getElementById("response");
    const errorLabel = document.getElementById("API_KEY_validation_error");

    apiKeyHandler.addEventListener('input', function handleApiKeyInput(event) {
        const API_KEY = event.target.value;
        promptHandler.disabled = !(API_KEY.length >= 39);
        btn.disabled = !(API_KEY.length >= 39);

        const genAI = new GoogleGenerativeAI(API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-pro"
        });

        model.generateContent("Hi")
            .then()
            .then()
            .catch(error => {
                let err = error.toString();
                if (err.includes("API key not valid")) {
                    errorLabel.style.display = 'contents';
                } else {
                    errorLabel.style.display = 'none';
                }
            });
    });

    btn.addEventListener("click", function handlerPressed() {
        const prompt = promptHandler.value;
        const API_KEY = apiKeyHandler.value;

        const genAI = new GoogleGenerativeAI(API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-pro"
        });

        model.generateContent(prompt)
            .then(result => result.response.text())
            .then(text => {
                console.log(text);
                
                zeroMdResponseHandler.value = text;
                autoResizeTextarea(zeroMdResponseHandler);
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .then(() => {
                let box = new MDEditor({
                    div: '#response',
                })
            });
    });

    function autoResizeTextarea(textarea) {
        textarea.style.height = "auto";
        textarea.style.height = (textarea.scrollHeight + 2) + "px";
    }
});



// document.addEventListener('DOMContentLoaded', function () {

//     const apiKeyHandler = document.getElementById("APIKEY");

//     apiKeyHandler.addEventListener('input', function handleApiKeyInput(event) {
//         const API_KEY = event.target.value;
//         promptHandler.disabled = !(API_KEY.length >= 39);
//         btn.disabled = !(API_KEY.length >= 39);

//         const errorLable = document.getElementById("API_KEY_validation_error")

//         const genAI = new GoogleGenerativeAI(API_KEY);

//         const model = genAI.getGenerativeModel({
//             model: "gemini-pro"
//         });

//         model.generateContent("Hi")
//             .catch(error => {
//                 let err = error.toString();
//                 if (err.includes("API key not valid")) {
//                     errorLable.style.display = 'contents';
//                     err = "";
//                 } // if (!(err.includes("API key not valid")))
//                 else {
//                     errorLable.style.display = 'none';
//                 }
//             });
//     });


//     const promptHandler = document.getElementById("prompt");

//     promptHandler.addEventListener('input', function handleChange(event) {
//         // console.log(event.target.value);
//         const prompt = event.target.value;
//     });

//     const btn = document.getElementById("submit");
//     btn.addEventListener("click", function handlerPressed() {
//         // const responseHandler = document.getElementById("response");
//         const responseHandler = document.querySelector("zero-md").shadowRoot.getElementById("response");


//         const prompt = document.getElementById("prompt").value;
//         const API_KEY = document.getElementById("APIKEY").value;

//         const genAI = new GoogleGenerativeAI(API_KEY);

//         const model = genAI.getGenerativeModel({
//             model: "gemini-pro"
//         });

//         model.generateContent(prompt)
//             .then(result => result.response.text())
//             .then(text => {
//                 console.log(text);
//                 // responseHandler.value = text;
//                 responseHandler.innerHTML = text;
//                 // autoResizeTextarea(responseHandler);
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//             });
//     });

//     function autoResizeTextarea(textarea) {
//         textarea.style.height = "auto";
//         textarea.style.height = (textarea.scrollHeight + 2) + "px";
//     }

// });


// document.addEventListener('DOMContentLoaded', function () {

//     const promptHandler = document.getElementById("prompt");
//     promptHandler.addEventListener('input', function handleChange(event) {
//         console.log(event.target.value);
//         const prompt = event.target.value;
//     });

//     const btn = document.getElementById("submit");
//     btn.addEventListener("click", function handlerPressed() {
//         const responseHandler = document.getElementById("response");
//         const prompt = document.getElementById("prompt").value;

//         model.generateContent(prompt)
//             .then(result => result.response.text())
//             .then(text => {
//                 responseHandler.value = text;
//                 autoResizeTextarea(responseHandler);
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//             });
//     });

//     function autoResizeTextarea(textarea) {
//         textarea.style.height = "auto"; // Сначала устанавливаем высоту в "auto"
//         textarea.style.transition = "ease 0.2s";
//         textarea.style.height = (textarea.scrollHeight + 2) + "px"; // Устанавливаем высоту равной высоте содержимого textarea
//     }

// });