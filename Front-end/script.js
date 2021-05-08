
let root = document.getElementById("root");
let editArea = document.getElementById("editArea");

let listDocs = document.createElement("div");
listDocs.setAttribute("id", "entirList");

// Startpage

let headerTemplate = `<div class="header" id="header"><h1> Välkommen!</h1></div><div><button class ="logOutbtn" id="logOutbtn">Logga ut</button></div>`;
let inputfield = `<div Id="logIn" class="logIn"><input class="loginfield" type="text" placeholder="Användarnamn" id="userName"><input class="loginfield" type="password" placeholder="Lösenord" id="passWord"> <button class ="loginbtn" id="btn">Logga in</button></div>`;
let error = `<div class="error"><p>Fel användarnamn eller lösenord! Försök igen.</p></div>`;
let backBtn = `<div id="backBtn"><button class ="goBackBtn" id="goBackBtn">Tillbaka</button></div>`;

root.insertAdjacentHTML("afterbegin", inputfield);
root.insertAdjacentHTML("beforebegin", headerTemplate);
document.getElementById("editArea").hidden = true;
document.getElementById("logOutbtn").hidden = true;
root.insertAdjacentHTML("beforebegin", backBtn);

document.getElementById("backBtn").hidden = true;
// login function

btn.addEventListener("click", function () {
    if (userName.value == "admin" && passWord.value == "admin") {
        console.log("inloggad");
        loggedInPage()
        localStorage.setItem('loggedin', "true");
        localStorage.setItem('loggedinuser', userName.value);
    } else {
        root.insertAdjacentHTML("afterbegin", error);
        return false;
    }
});

// Page when logged in, startpage

function loggedInPage() {

    let loggedInContent = `<div id="newDoc">
    <div><h1> Välkommen, du är nu inloggad!</h1></div>
    <div><button class="newdDocBtn" id="newDocBtn">Skapa nytt dokument</button></div>
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

// Print heading of created documents

function showDoc(result) {
    for (data in result) {
        console.log(result[data].heading);
        let id = result[data].id;
        let text = result[data].mainText;
        console.log(result[data].mainText);
        listDocs = `<div class="listdiv" id="list">`
        listDocs += `<ul id="docList" ><li class="listli">` + result[data].heading + `<button class="listBtn" value="` + result[data].id + `" id="showBtn">Visa dokument</button></li></ul>`;
        listDocs += `</div>`
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
    let editBtn = `<div><button class="editBtn" id="editBtn">Redigera</button></div>`;
    root.insertAdjacentHTML("beforebegin", editBtn);
    document.getElementById("backBtn").hidden = false;


    goBack();

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
            let showingDoc = `<div id="showDoc" class="showDoc">` + result[0].mainText.toString() + `</div>`;
            let doc = result[0].mainText.toString();
            let documentId = result[0].id.toString();
            let heading = result[0].heading.toString()
            root.insertAdjacentHTML("beforebegin", showingDoc);

            document.getElementById("editBtn").addEventListener("click", function () {
                console.log("click");
                updateDocumentPage(doc, documentId, heading);

            })
        })
}

// Update/edit documents page
function updateDocumentPage(doc, documentId, heading) {

    console.log(doc);
    console.log(documentId);
    console.log(heading);
    document.getElementById("editArea").hidden = false;
    document.getElementById("logOutbtn").hidden = false;
    document.getElementById("newDoc").hidden = true;
    document.getElementById("editBtn").hidden = true;
    document.getElementById("backBtn").hidden = false;
    document.getElementById("list").hidden = true;


    goBack();

    tinymce.init({
        selector: "#textContent",

        setup: function (editor) {
            editor.on("change", function () {
                editor.save();
            })
        }
    })

    document.getElementById("textContent").value = doc;
    if (heading != undefined) {
        head.value += heading;
    };

    // click on save to update document
    document.getElementById("saveBtn").addEventListener("click", function () {
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
                if (data = "Updated") {
                    root.insertAdjacentHTML(`afterbegin`, `<div class="savedText" id="savedText"><p>Dokument uppdaterat och sparat</p></div>`);
                    document.getElementById("showDoc").hidden = true;
                }
            })
    })
}

// create new document page
function newDocPage() {
    document.getElementById("editArea").hidden = false;
    document.getElementById("logOutbtn").hidden = false;
    document.getElementById("newDoc").hidden = true;
    document.getElementById("backBtn").hidden = false;
    document.getElementById("list").hidden = true;

    goBack();

    tinymce.init({
        selector: "#textContent",
        plugins: "code",
        toolbar: "undo redo | styleselect |  bold italic | alignleft alignright | code",


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

function goBack() {
    goBackBtn.addEventListener("click", function () {
        console.log("click");
        location.reload();
    });
}

// Local storage
if (localStorage.getItem("loggedin") === "true") {
    loggedInPage(localStorage.getItem('loggedinuser'));
};

// logout button
logOutbtn.addEventListener("click", function () {
    console.log("klickad");
    localStorage.setItem("loggedin", "false");
    localStorage.setItem("loggedinuser", "");
    document.location.href = "index.html";
});


