// ===============================
// Smart QR Code Generator
// ===============================


// Generate QR Code
function generateQR() {

    let qrType = document.getElementById("qrType").value;

    let text = "";


    // =========================
    // Text / URL
    // =========================

    if (qrType === "text") {

        text = document.getElementById("qrText").value;

        if (text.trim() === "") {

            alert("Please enter text or a URL!");

            return;
        }
    }


    // =========================
    // Email
    // =========================

    else if (qrType === "email") {

        let email =
            document.getElementById("emailAddress").value;

        let subject =
            document.getElementById("emailSubject").value;

        let message =
            document.getElementById("emailMessage").value;


        if (email.trim() === "") {

            alert("Please enter an email address!");

            return;
        }


        text =
            `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    }


    // =========================
    // Wi-Fi
    // =========================

    else if (qrType === "wifi") {

        let wifiName =
            document.getElementById("wifiName").value;

        let wifiPassword =
            document.getElementById("wifiPassword").value;

        let wifiSecurity =
            document.getElementById("wifiSecurity").value;


        if (wifiName.trim() === "") {

            alert("Please enter Wi-Fi name!");

            return;
        }


        // Escape special characters
        wifiName =
            wifiName.replace(/([\\;,:"])/g, "\\$1");

        wifiPassword =
            wifiPassword.replace(/([\\;,:"])/g, "\\$1");


        text =
            `WIFI:T:${wifiSecurity};S:${wifiName};P:${wifiPassword};;`;
    }


    // =========================
    // Contact / vCard
    // =========================

    else if (qrType === "contact") {

        let name =
            document.getElementById("contactName").value;

        let phone =
            document.getElementById("contactPhone").value;

        let email =
            document.getElementById("contactEmail").value;


        if (name.trim() === "") {

            alert("Please enter contact name!");

            return;
        }


        text =
`BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL:${phone}
EMAIL:${email}
END:VCARD`;
    }


    // =========================
    // QR Color & Size
    // =========================

    let color =
        document.getElementById("qrColor").value;

    let size =
        parseInt(
            document.getElementById("qrSize").value
        );


    // Remove old QR
    document.getElementById("qrcode").innerHTML = "";


    // Generate QR
    new QRCode(
        document.getElementById("qrcode"),
        {
            text: text,

            width: size,

            height: size,

            colorDark: color,

            colorLight: "#ffffff",

            correctLevel: QRCode.CorrectLevel.H
        }
    );


    // Show buttons
    document.getElementById("downloadBtn")
        .style.display = "block";

    document.getElementById("copyBtn")
        .style.display = "block";

    document.getElementById("clearBtn")
        .style.display = "block";


    // =========================
    // Save History
    // =========================

    let history =
        JSON.parse(
            localStorage.getItem("qrHistory")
        ) || [];


    history.unshift({

        type: qrType,

        text: text
    });


    // Keep latest 10
    if (history.length > 10) {

        history.pop();
    }


    localStorage.setItem(
        "qrHistory",
        JSON.stringify(history)
    );


    showHistory();
}



// ===============================
// Download QR
// ===============================

function downloadQR() {

    let qrImage =
        document.querySelector("#qrcode img");


    if (!qrImage) {

        alert("Please generate a QR code first!");

        return;
    }


    let link =
        document.createElement("a");


    link.href = qrImage.src;

    link.download = "my-qr-code.png";

    link.click();
}



// ===============================
// Copy QR
// ===============================

function copyQR() {

    let canvas =
        document.querySelector("#qrcode canvas");


    if (!canvas) {

        alert("Please generate a QR code first!");

        return;
    }


    canvas.toBlob(function(blob) {

        if (!blob) {

            alert("Copy failed!");

            return;
        }


        let item =
            new ClipboardItem({
                "image/png": blob
            });


        navigator.clipboard.write([item])

            .then(function() {

                alert("QR code copied!");

            })

            .catch(function() {

                alert(
                    "Copy is not supported in this browser."
                );

            });

    });
}



// ===============================
// Clear QR
// ===============================

function clearQR() {

    document.getElementById("qrText").value = "";

    document.getElementById("emailAddress").value = "";

    document.getElementById("emailSubject").value = "";

    document.getElementById("emailMessage").value = "";

    document.getElementById("wifiName").value = "";

    document.getElementById("wifiPassword").value = "";

    document.getElementById("contactName").value = "";

    document.getElementById("contactPhone").value = "";

    document.getElementById("contactEmail").value = "";


    document.getElementById("qrcode").innerHTML = "";


    document.getElementById("downloadBtn")
        .style.display = "none";

    document.getElementById("copyBtn")
        .style.display = "none";

    document.getElementById("clearBtn")
        .style.display = "none";
}



// ===============================
// Show History
// ===============================

function showHistory() {

    let history =
        JSON.parse(
            localStorage.getItem("qrHistory")
        ) || [];


    let historyList =
        document.getElementById("historyList");


    historyList.innerHTML = "";


    history.forEach(function(item, index) {

        // Support old history format
        let qrText =
            typeof item === "string"
                ? item
                : item.text;


        let div =
            document.createElement("div");


        // QR Preview
        let qrDiv =
            document.createElement("div");


        qrDiv.style.display = "flex";

        qrDiv.style.justifyContent = "center";

        qrDiv.style.marginBottom = "10px";


        new QRCode(
            qrDiv,
            {
                text: qrText,

                width: 120,

                height: 120,

                colorDark: "#000000",

                colorLight: "#ffffff",

                correctLevel: QRCode.CorrectLevel.H
            }
        );


        // Text
        let p =
            document.createElement("p");

        p.textContent = qrText;


        // Generate Again button
        let generateButton =
            document.createElement("button");

        generateButton.textContent =
            "Generate Again";


        generateButton.onclick =
            function() {

                generateAgain(index);

            };


        // Delete button
        let deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "Delete";


        deleteButton.onclick =
            function() {

                deleteHistory(index);

            };


        div.appendChild(qrDiv);

        div.appendChild(p);

        div.appendChild(generateButton);

        div.appendChild(deleteButton);


        historyList.appendChild(div);
    });
}



// ===============================
// Generate Again
// ===============================

function generateAgain(index) {

    let history =
        JSON.parse(
            localStorage.getItem("qrHistory")
        ) || [];


    let item = history[index];


    // Old history format
    if (typeof item === "string") {

        document.getElementById("qrType").value = "text";

        document.getElementById("qrText").value = item;
    }


    // New history format
    else {

        document.getElementById("qrType").value =
            item.type;


        if (item.type === "text") {

            document.getElementById("qrText").value =
                item.text;
        }


        else {

            // Generate directly from saved QR data
            generateSavedQR(item.text);

            return;
        }
    }


    updateFields();

    generateQR();
}



// ===============================
// Generate Saved QR
// ===============================

function generateSavedQR(text) {

    let color =
        document.getElementById("qrColor").value;

    let size =
        parseInt(
            document.getElementById("qrSize").value
        );


    document.getElementById("qrcode").innerHTML = "";


    new QRCode(
        document.getElementById("qrcode"),
        {
            text: text,

            width: size,

            height: size,

            colorDark: color,

            colorLight: "#ffffff",

            correctLevel: QRCode.CorrectLevel.H
        }
    );


    document.getElementById("downloadBtn")
        .style.display = "block";

    document.getElementById("copyBtn")
        .style.display = "block";

    document.getElementById("clearBtn")
        .style.display = "block";
}



// ===============================
// Delete History
// ===============================

function deleteHistory(index) {

    let history =
        JSON.parse(
            localStorage.getItem("qrHistory")
        ) || [];


    history.splice(index, 1);


    localStorage.setItem(
        "qrHistory",
        JSON.stringify(history)
    );


    showHistory();
}



// ===============================
// Clear All History
// ===============================

function clearHistory() {

    localStorage.setItem(
        "qrHistory",
        JSON.stringify([])
    );


    document.getElementById("historyList")
        .innerHTML = "";


    alert("QR history cleared!");
}



// ===============================
// Show / Hide Fields
// ===============================

function updateFields() {

    let type =
        document.getElementById("qrType").value;


    let textFields =
        document.getElementById("textFields");

    let emailFields =
        document.getElementById("emailFields");

    let wifiFields =
        document.getElementById("wifiFields");

    let contactFields =
        document.getElementById("contactFields");


    // Hide all
    textFields.style.display = "none";

    emailFields.style.display = "none";

    wifiFields.style.display = "none";

    contactFields.style.display = "none";


    // Show selected
    if (type === "text") {

        textFields.style.display = "block";
    }


    else if (type === "email") {

        emailFields.style.display = "block";
    }


    else if (type === "wifi") {

        wifiFields.style.display = "block";
    }


    else if (type === "contact") {

        contactFields.style.display = "block";
    }
}



// ===============================
// QR Type Change
// ===============================

document
    .getElementById("qrType")
    .addEventListener(
        "change",
        updateFields
    );



// ===============================
// Load Page
// ===============================

showHistory();

updateFields();