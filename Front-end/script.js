
let root = document.getElementById("root");
let editArea = document.getElementById("editArea");

let listDocs = document.createElement("div");
listDocs.setAttribute("id", "entirList");

// Startpage

let headerTemplate = `<div id="header"><h1> Välkommen!</h1></div><div><button id="logOutbtn">Logga ut</button></div>`;
let inputfield = `<div Id="logIn" class="logIn"><input type="text" placeholder="Användarnamn" id="userName"><input type="text" placeholder="Lösenord" id="passWord"> <button id="btn">Logga in</button></div>`;
let error = `<div class="error"><p>Fel användarnamn eller lösenord! Försök igen.</p></div>`;

root.insertAdjacentHTML("afterbegin", inputfield);
root.insertAdjacentHTML("beforebegin", headerTemplate);
document.getElementById("editArea").hidden = true;
document.getElementById("logOutbtn").hidden = true;
// document.getElementById("heading").hidden = true;
// login function

btn.addEventListener("click", function () {
    if (userName.value == "janne" && passWord.value == "test") {
        localStorage.setItem("userName", "janne");
        console.log("inloggad");
        loggedInPage()
        return false;

    } else {
        root.insertAdjacentHTML("afterbegin", error);
        return false;
    }

});

// Page when logged in

function loggedInPage() {

    let loggedInContent = `<div id="newDoc">
    <div><h1> Välkommen, du är nu inloggad</h1></div>
    <div><button id="newDocBtn">Skapa nytt dokument</button></div>
    <div><h2> Dina skapade dokument</h2></div>
    </div>`;


    root.insertAdjacentHTML("afterbegin", loggedInContent);
    document.getElementById("header").hidden = true;
    document.getElementById("logIn").hidden = true;
    document.getElementById("logOutbtn").hidden = false;


    newDocBtn.addEventListener("click", function () {
        newDocPage()
    });


    // Fetch data of documents from databas
    fetch("http://localhost:3010/users/data")
        .then(response => response.json())
        .then(function (result) {
            console.log(result);
            showDoc(result)
        })


}

// Show created documents 

function showDoc(result) {

    for (data in result) {
        console.log(result[data].heading);
        let id = result[data].id;
        let text = result[data].mainText;
        console.log(result[data].mainText);

        listDocs = `<div id="list"><li>` + result[data].heading + `<button value="` + result[data].id + `" id="showBtn">Visa dokument</button></li></div>`;
        root.insertAdjacentHTML("afterend", listDocs);
        console.log(id);

        document.getElementById("showBtn").addEventListener("click", function (evt) {
            console.log("click");
            console.log(evt.target.value);
            document.getElementById("list").hidden = true;
            let id = evt.target.value;
            editDocPage(id);
        })
    }
}

// fetch and show content of documents

function editDocPage(id, text) {
    document.getElementById("newDoc").hidden = true;
    let editBtn =`<div><button id="editBtn">Redigera</button></div>`;
    root.insertAdjacentHTML("beforebegin", editBtn);


    console.log("id" + id);
    fetch("http://localhost:3010/users/check", {
        method: "post",
        headers: {
            "content-Type": "application/json"
        },
        body: JSON.stringify({
            id
        })
    }).then((res) => res.json())
        .then(function (result) {
            console.log(result);
            console.log(result[0].mainText.toString());
            let showingDoc = `<div class ="showDoc">` + result[0].mainText.toString() + `</div>`;
            let doc = result[0].mainText.toString();
            let documentId = result[0].id.toString();
            let heading = result[0].heading.toString()
            root.insertAdjacentHTML("beforebegin", showingDoc);

            document.getElementById("editBtn").addEventListener("click", function(){
                console.log("click");
                updateDocumentPage(doc, documentId , heading);
         
             })
        })

       
     
}

function updateDocumentPage(doc, documentId, heading){

    console.log(doc);
    console.log(documentId);
    console.log(heading);
    document.getElementById("editArea").hidden = false;
    document.getElementById("logOutbtn").hidden = false;
    document.getElementById("newDoc").hidden = true;
    document.getElementById("editBtn").hidden = true;

    tinymce.init({
        selector: "#textContent",

        setup: function (editor) {
            editor.on("change", function () {
                editor.save();
            })
        }
    })

    document.getElementById("textContent").value= doc;
    head.value += heading;


    // click on save to update document
    document.getElementById("saveBtn").addEventListener("click", function() {
        console.log(document.getElementById("textContent").value);
        document.getElementById("textResult").innerHTML = document.getElementById("textContent").value;
        updateMainText = textContent.value;
        console.log(updateMainText);
        
        updateDocumentPage(documentId)
        console.log(documentId);

    
        let updateHeading = head.value;
        console.log(updateHeading);

        fetch("http://localhost:3010/users/update", {
            method: "post",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                updateMainText,
                updateHeading, 
                documentId
            })
        }).then((res) => res.json())
            .then(function (data) {
                console.log(data);

                if (data == "saved") {
                    root.insertAdjacentHTML(`afterend`, `<div class="savedText" id="savedText"><p>Dokument sparat</p></div>`);
                }
            })
    })
}

// create new document page

function newDocPage() {

    let backBtn = `<div id="backBtn"><button id="goBackBtn">Tillbaka</button></div>`;
    // let heading = `<div id="heading"><input id="head">Namn på dokument</input></div>`
    root.insertAdjacentHTML("beforebegin", backBtn);

    document.getElementById("editArea").hidden = false;
    document.getElementById("logOutbtn").hidden = false;
    document.getElementById("newDoc").hidden = true;

    goBackBtn.addEventListener("click", function () {
        loggedInPage()
    });

    tinymce.init({
        selector: "#textContent",

        setup: function (editor) {
            editor.on("change", function () {
                editor.save();
            })
        }
    })

    // click on save to create document
    document.getElementById("saveBtn").addEventListener("click", function () {
        console.log(document.getElementById("textContent").value);
        document.getElementById("textResult").innerHTML = document.getElementById("textContent").value;
        mainText = textContent.value;
        console.log(mainText);

        let heading = document.getElementById("head").value;

        fetch("http://localhost:3010/users/new", {
            method: "post",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                mainText,
                heading
            })
        }).then((res) => res.json())
            .then(function (data) {
                console.log(data);

                if (data == "saved") {
                    root.insertAdjacentHTML(`afterend`, `<div class="savedText" id="savedText"><p>Dokument sparat</p></div>`);
                }
            })
    })
}


// logout button
logOutbtn.addEventListener("click", function () {
    console.log("klickad");
    document.location.href = "index.html";
});