methods = Array();

function updateAnswer(){
    let newAnswer = ""

    newAnswer += document.getElementById("string-to-crypt").value;

    document.getElementById("encrypted-string").value = newAnswer;
}


// EXPORT - IMPORT
function exportList(){
    // Data as json
    let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(methods));

    // Create temporary element. His purpose is to offer a download function
    let element = document.createElement('a');
    element.setAttribute('href', 'data:' + data);
    element.setAttribute('download', "list.json");

    element.style.display = 'none';
    document.body.appendChild(element);

    // Simulate a click on the element.
    element.click();

    // Remove temporary element
    document.body.removeChild(element);
}


function importList(){

    // Check a file is selected
    if(document.getElementById("input-file").value){

        // Get content
        let fileData = document.getElementById("file-content").textContent;

        let data = JSON.parse(fileData);

        // Add methods from file to list of methods
        for (let i = 0; i < data.length; i++) {

            // Create new method object then push it inside array
            // let newMethod = new Method()
            methods.push(data[i]);
            console.log(data[i]);
        }

        // Reset input file and file data
        document.getElementById("input-file").value = "";
        document.getElementById("custom-file-label").innerText = "Choose file to import";
        document.getElementById("file-content").textContent = "";

        console.log(methods);
    }

    // UPDATE UI
    // updateUI();
}

function addEventListenerInputFile(){
    document.getElementById('input-file').addEventListener('change', handleFileSelect, false);
   
}
  
function handleFileSelect(event){
    const reader = new FileReader()
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0])

    // Change name inside form
    var name = document.getElementById("input-file").files[0].name;
    var nextSibling = event.target.nextElementSibling
    nextSibling.innerText = name
}
  
function handleFileLoad(event){
    console.log(event);
    document.getElementById('file-content').textContent = event.target.result;
}