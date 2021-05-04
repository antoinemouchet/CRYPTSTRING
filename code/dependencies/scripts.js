/**
    Copyright 2021 Antoine Mouchet


   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/



/**
 * Class which specifies the CryptoMethod Object, its properties and methods relative to its use
 * @class CryptoMethod
 */
class CryptoMethod {
    /**
     *  Constructor of the CryptoMethod Object
     * @constructor
     * @param {String} name: name of the method
     * @param {Number} nbKeys: number of keys used by the method
     * @param {Array} keyList: list of keys of the method
     * @param {function} methodFunction: function used by the CryptoMethod to encrypt
     * @param {Boolean} status : status of the method (true=active)
     */
    constructor(name, nbKeys, keyList, methodFunction, status) {
        this.name = name;
        this.nbKeys = nbKeys;
        this.keyList = keyList;
        this.methodFunction = methodFunction;
        this.status = status;
    }


    /**
     * Applies the encryption function of the method to the string
     * @param {String} string to encrypt
     */
    encrypt(string) {
        console.assert(string !== "" && string !== null && string.trim() !== "", { string: string, errorMsg: "string can not be empty." });

        return this.methodFunction(string, this.keyList);
    }


    /**
     * Setter for the status of this
     *
     * Actually change it to the opposite status
     */
    changeStatus() {
        // Since it is a boolean just change its value
        this.status = !this.status;
    }

    /**
     * Get the name of method
     * @returns {String} name of this.
     */
    getName() {
        return this.name;
    }

    /**
     * Getter for nbKeys.
     * @returns {Number}: the number of keys of this.
     */
    getNbKeys() {
        return this.nbKeys;
    }

    /**
     * Getter for keyList
     * @returns {Array}: the list of keys of this.
     */
    getKeyList() {
        return this.keyList;
    }

    /**
     * Getter for methodFunction
     * @returns the function used to encrypt with this method.
     */
    getMethodFunction() {
        return this.methodFunction;
    }

    /**
     * Getter for the status of this
     * @returns status of this.
     */
    getStatus() {
        return this.status;
    }

    /**
     * Partial setter for keyList
     * 
     * Replace element of keyList at index by key.
     * 
     * NOTE:  index should be less than this.keyList.length
     * even though it is still possible to do it but it is useless
     * as it will not be considered.
     * @param {String} key: the key to insert in keyList.
     * @param {Number} index: index at which to insert the key.
     */
    addKey(key, index) {
        console.assert(index < this.keyList.length, { index, errorMsg: "addKey - index is greater than length." });
        this.keyList[index] = key;
    }
}

/**
 * Array with all the existing CryptoMethods
 */
let existingMethods = Array();

/**
 * Array with the methods used by the user
 */
let methodsUsed = Array();

/**
 * Function to update the user interface.
 */
function updateUI() {
    // Make sure string to crypt is not empty
    if (document.getElementById("string-to-crypt").value === "") {
        // If it is empty, then empty answer as well
        document.getElementById("encrypted-string").value = "";
    } else {
        console.assert(document.getElementById("string-to-crypt").value != ""
                    && document.getElementById("string-to-crypt").value != null
                    && document.getElementById("string-to-crypt").value.trim() != ""
                    , { string: document.getElementById("string-to-crypt").value,
                        errorMsg:"string to crypt should not be empty."});

        updateAnswer();
    }
    displayMethods();
}

/**
 * Update the value of the answer.
 */
async function updateAnswer() {

    let newAnswer = "";

    newAnswer += document.getElementById("string-to-crypt").value;

    // Apply crypto transformations
    for (const m of methodsUsed) {
        // Check if crypto transfo is active
        if (m.getStatus()) {

            // Check if method needs some keys
            if (m.getNbKeys() === 0) {
                newAnswer = await m.encrypt(newAnswer);
            } else {
                // Check the values of the keys
                if (checkAllKeyValues(m)) {

                    // Get list of keys of method
                    let keyList = m.getKeyList();

                    console.assert(keyList.length > 0, { keyList, errorMsg: "updateAnswer - keyList should not be empty" });
                    //console.log("Key List: " + keyList);


                    let tmpKeyArray = [];
                    
                    // Push every key inside tmpKeyArray so that there is no share problem between methods with same name.
                    for (let index = 0; index < m.getNbKeys(); index++) {
                        // Loop on input cases and add key to the list every time then encrypt.
                        tmpKeyArray.push(keyList[index]);

                        //console.log("tmpkeyarray: " + tmpKeyArray);
                        
                    }
                    console.assert(tmpKeyArray.length === keyList.length, { keyList:keyList, tmpKeyArray: tmpKeyArray,
                        errorMsg: "updateAnswer - keyList and tmpKeyArray should have same length" });

                    newAnswer = await m.encrypt(newAnswer, tmpKeyArray);
                }
            }
            
        }
    }
    console.assert(newAnswer.length > 0, {newAnswer, errorMsg:"updateAnswer - newAnswer should not be empty."});
    console.assert(newAnswer !== "" && newAnswer !== null, {newAnswer, errorMsg: "updateAnswer - newAnswer should not be empty."})

    // Set answer value to computed value
    document.getElementById("encrypted-string").value = newAnswer;
}

/**
 * Returns true if all the keys of method are valid.
 * @param {CryptoMethod} method: method of which we want to check the keys.
 * @returns {Boolean} true if keys of method are valid.
 */
function checkAllKeyValues(method){
    // Get list of keys of method
    let keysList = method.getKeyList();

    //console.log("check keys: " + keysList);
    
    if (keysList.length === 0){
        return false;
    }

    for (let index = 0; index < method.getNbKeys(); index++) {
        // Get value of key
        let keyValue = keysList[index];

        // Key should not be empty or null.
        if (keyValue.trim() === "" || keyValue === null) {
            return false;
        }
        
        // Specific condition for rotation method
        if (method.getName() === "Rotation") {
            // Make key an int
            let keyAsInt = parseInt(keyValue, 10);
            
            // Key should be a number
            if (isNaN(keyAsInt)) {
                window.alert("Key must be a number between 0 and 26 for rotation method.");
                return false;
            }
            // Key must be in [0, 26]
            if (keyAsInt < 0 || keyAsInt > 26) {
                window.alert("Key must be between 0 and 26 for rotation method.");
                return false;
            }
        }

        return true;
    }
}

/**
 * Display used methods on page
 */
function displayMethods() {
    let  displayMeth = document.getElementById("methods");

    // Reset actual display
    displayMeth.innerHTML = "";

    // Create container for the methods
    let methodContainer = document.createElement("div");
    methodContainer.className = "container method-table container-custom";

    // First line
    let firstLine = document.createElement("div");
    firstLine.className = "row custom-row first-row";

    // Column for the status
    let statusCol = document.createElement("div");
    statusCol.className = "col-1";
    statusCol.innerText = "Status";

    // Column for the name
    let nameCol = document.createElement("div");
    nameCol.className = "col-3";
    nameCol.innerText = "Name of the primitive";

    // Column for the keys
    let keyCol = document.createElement("div");
    keyCol.className = "col-7";
    keyCol.innerText = "Keys";

    // Last column
    let lastCol = document.createElement("div");
    lastCol.className = "col-1";

    // Append columns to row
    firstLine.appendChild(statusCol);
    firstLine.appendChild(nameCol);
    firstLine.appendChild(keyCol);
    firstLine.appendChild(lastCol);
    
    // Append row to container
    methodContainer.appendChild(firstLine);

    // Methods
    // Set index at 0
    let i = 0;
    // Loop on all used method
    for (const m of methodsUsed) {
        // Add a <hr> element before each method used
        methodContainer.appendChild(document.createElement("hr"));
        // Append the formatted method to the container
        methodContainer.appendChild(formatMethod(m, i));
        i++;
    }

    displayMeth.appendChild(methodContainer);

}

/**
 * Returns a HTMLDivElement of method to display.
 * @param {CryptoMethod} method: cryptographic method in methodsUsed to format
 * @param {Int} index : index of the method in methodsUsed 
 * @returns {HTMLDivElement} newLine: formatted row of the specified method
 */
function formatMethod(method, index) {
    //console.log("index of method is " + index);
    
    // New line for the method
    let newLine = document.createElement("div");
    newLine.className = "row custom-row";

    // Column for the status
    let statusCol = document.createElement("div");
    statusCol.className = "col-1";

    // Status button
    let statusButton = document.createElement("button");
    statusButton.type = "button";
    statusButton.className = "btn btn-block status-btn-custom";
    statusButton.onclick = () => {method.changeStatus(); updateUI();};

    // Image in status button
    let a = document.createElement("a");
    a.className = (method.status ? " fas fa-toggle-on " : "fas fa-toggle-off");

    statusButton.appendChild(a);
    statusCol.appendChild(statusButton);

    // Column with the name
    let nameCol = document.createElement("div");
    nameCol.className = "col-3";
    nameCol.innerText = method.getName();

    // Column for the keys
    let keyCol = document.createElement("div");
    keyCol.className = "col-7";
    
    // Check if method needs some keys
    if (method.getNbKeys() === 0) {
        //console.log("No key for this method");
        keyCol.innerText = "No key for this method.";
    } else {
        // Get keyList of method
        let keyList = method.getKeyList();
        
        // Create input box for each key.
        for (let keyIndex = 0; keyIndex < method.getNbKeys(); keyIndex++) {
            
            let keyCase = document.createElement("div");
            keyCase.className = "input-group mb-3";

            // Div for the displayed label of the input group
            let keyTitleCase = document.createElement("div");
            keyTitleCase.className = "input-group-prepend";
            
            // Actual label of the input group
            let keyNb = document.createElement("span");
            keyNb.className = "input-group-text";
            keyNb.innerText =  "Key " + (keyIndex + 1);

            // Group for the actual input of the key
            let keyInput = document.createElement("input");
            keyInput.type = "text";
            keyInput.className = "form-control";
            keyInput.placeholder = "Key n°" + (keyIndex + 1);
            // Id based on method name and index of method to differentiate methods with same name
            keyInput.id = method.getName() + index + "key" + keyIndex;
            // When a value is inserted and focus is lost, fire this event
            keyInput.onchange = () => {
                method.addKey(document.getElementById(keyInput.id).value, keyIndex);
                updateUI();}
            // If key already exists, display its value in input field
            if (keyList[keyIndex] !== "") {
                keyInput.value = keyList[keyIndex];
            }

            // Add actual label to label Div
            keyTitleCase.appendChild(keyNb);
            // Add labeldiv to input group
            keyCase.appendChild(keyTitleCase);
            // Add actual input to input group
            keyCase.appendChild(keyInput);
            
            // Add the input group to the column
            keyCol.appendChild(keyCase);
        }
    }

    // Last column
    let lastCol = document.createElement("div");
    lastCol.className = "col-1";

    // Delete method
    let delButton = document.createElement("button");
    delButton.type = "button";
    delButton.className = "btn btn-block btn-danger";
    delButton.onclick = () => {
        methodsUsed.splice(index, 1);
        //console.log(methodsUsed);
        updateUI();}

    // Delete icon
    let trashIcon = document.createElement("a");
    trashIcon.className="fas fa-trash";
    
    // Form the column
    delButton.appendChild(trashIcon);
    lastCol.appendChild(delButton);

    // Form new line with all columns
    newLine.appendChild(statusCol);
    newLine.appendChild(nameCol);
    newLine.appendChild(keyCol);
    newLine.appendChild(lastCol);
        
    
    return newLine;
}

/**
 * Populate the dropdown menu with existing methods
 */
function populateMethodsMenu() {
    let menu = document.getElementById("methods-menu");
    
    // Add a button for each existing method in the menu
    for (const cryptMethod of existingMethods) {

        let button = document.createElement("button");
        button.className = "dropdown-item";
        button.onclick = () => {
            document.getElementById("menu-name").textContent = cryptMethod.getName()};
        // Text of the button is name of the method
        button.innerText = cryptMethod.getName();

        menu.appendChild(button);
    }

    let dropdownDivider = document.createElement("div");
    dropdownDivider.className = "dropdown-divider";

    // Add a button to select no methods
    let lastButton = document.createElement("button");
    lastButton.className = "dropdown-item";
    lastButton.onclick = () => {document.getElementById("menu-name").textContent = "METHODS"};
    lastButton.innerText = "None";

    menu.appendChild(dropdownDivider);
    menu.appendChild(lastButton);
}

/**
 * Add the selected method in the menu to the list of used methods
 */
function addMethod() {
    // Retrieve method name from form
    let methodName = document.getElementById("menu-name").textContent;

    // Check that method selected is not the none one
    if (methodName != "METHODS") {
        // Find selected method among the existing ones.
        let selectedMethod = existingMethods.find(method => method.getName() === methodName);

        // Add a new method to the list of used method based on information of the base in existingMethods
        methodsUsed.push(
            new CryptoMethod(selectedMethod.getName(),
                            selectedMethod.getNbKeys(),
                            // Deep copy list
                            JSON.parse(JSON.stringify(selectedMethod.getKeyList())),
                            selectedMethod.getMethodFunction(),
                            selectedMethod.getStatus()
                            ));
            console.assert(methodsUsed.length > 0, {methodsUsed, errorMsg: "addMethod - methodsUsed length should be greater than 0."});
    } else {
        window.alert("Select a method in the menu before adding it.");
    }

    updateUI();
    //console.log(methodsUsed);
}


/**
 * Hard coded function to populate the existing methods
 */
function populateMethods() {
    // Create CryptoMethods Objects
    let stringToBinMeth = new CryptoMethod("String to binary", 0, [], stringToBin, true);
    let binToStringMeth = new CryptoMethod("Binary to string", 0, [], binToString, true);
    let rot13Meth = new CryptoMethod("Rot13", 0, [], rot13, true);
    let rot47Meth = new CryptoMethod("Rot47", 0, [], rot47, true);
    let sha1Meth = new CryptoMethod("Sha 1", 0, [], sha1, true);
    let sha256Meth = new CryptoMethod("Sha 256", 0, [], sha256, true);
    let sha384Meth = new CryptoMethod("Sha 384", 0, [], sha384, true);
    let sha512Meth = new CryptoMethod("Sha 512", 0, [], sha512, true);
    let rotationMeth = new CryptoMethod("Rotation", 1, Array(1).fill(""), rotation, true);
    let encodeURIMeth = new CryptoMethod("Encode as URI", 0, [], encodeAllURI, true);
    let decodeURIMeth = new CryptoMethod("Decode URI", 0, [], decodeAllURI, true);
    let stringToHexMeth = new CryptoMethod("String to hex", 0, [], stringToHex, true);
    let hexToStringMeth = new CryptoMethod("Hex to string", 0, [], hexToString, true);
    let encodeXORMeth = new CryptoMethod("Encode XOR strings", 1, Array(1).fill(""), encodeXOR, true);
    let decodeXORMeth = new CryptoMethod("Decode XOR strings", 1, Array(1).fill(""), decodeXOR, true);
    let encodeBase64Meth = new CryptoMethod("String to base64", 0, [], encodeBase64, true);
    let decodeBase64Meth = new CryptoMethod("Base64 to string", 0, [], decodeBase64, true);


    // Add them to existing list
    existingMethods.push(stringToBinMeth);
    existingMethods.push(binToStringMeth);
    existingMethods.push(rot13Meth);
    existingMethods.push(rot47Meth);
    existingMethods.push(sha1Meth);
    existingMethods.push(sha256Meth);
    existingMethods.push(sha384Meth);
    existingMethods.push(sha512Meth);
    existingMethods.push(rotationMeth);
    existingMethods.push(encodeURIMeth);
    existingMethods.push(decodeURIMeth);
    existingMethods.push(stringToHexMeth);
    existingMethods.push(hexToStringMeth);
    existingMethods.push(encodeXORMeth);
    existingMethods.push(decodeXORMeth);
    existingMethods.push(encodeBase64Meth);
    existingMethods.push(decodeBase64Meth);

    // Sort the existing methods based on their names.
    existingMethods.sort(compareCryptoMethod);

}


// UTILS

/**
 * Change the input string to Upper case.
 */
function makeUpper() {
    let stringToCrypt = document.getElementById("string-to-crypt").value;
    document.getElementById("string-to-crypt").value = stringToCrypt.toUpperCase();

    updateUI();
}

/**
 * Change the input string to lower case.
 */
function makeLower() {
    let stringToCrypt = document.getElementById("string-to-crypt").value;
    document.getElementById("string-to-crypt").value = stringToCrypt.toLowerCase();

    updateUI();
}

/**
 * Utility function to sort an array of CryptoMethod based on their name
 * @param {CryptoMethod} method1
 * @param {CryptoMethod} method2 
 * @returns {Number} -1 if method1 is lexically before method2, 1 if it is the opposite and 0 otherwise
 */
function compareCryptoMethod(method1, method2) {
    let m1Name = method1.getName().toUpperCase();
    let m2Name = method2.getName().toUpperCase();

    if (m1Name < m2Name) {
        return -1;
    }
    if (m1Name > m2Name) {
        return 1;
    }
    return 0;
}



// Cryptographic methods

/**
 * This is a low level function, it should not be called by the user.
 * It should be used with precaution.
 * 
 * Returns the string in the specified base.
 * @param {String} string: base string
 * @param {Number} base: the base to which we try to transform the string.
 * @returns result: the resulting string
 */
function encodeToBase(string, base) {
    
    // Split every character from the rest
    let result = string.split("")
     // Convert each character to number of specified base
     .map(char => char.charCodeAt(0).toString(base))
     // Make the result a string
     .join(" ");

    return result;
}

/**
 * This is a low level function, it should not be called by the user.
 * It should be used with precaution.
 * 
 * Returns the string converted from the specified base.
 * @param {String} string: base string
 * @param {Number} base: the base from which we try to get the string.
 * @returns result: the resulting string
 */
function decodeFromBase(string, base) {
    // Split on spaces
    let result = string.split(' ')
     // Convert every member of the array from base number to string 
     .map(char => String.fromCharCode(parseInt(char, base)))
     // Make the result a string again
     .join('');

    return result;
 }

/**
 * Returns the input string as a binary string
 * @param {string} string - The string to convert to binary string
 * @return {string} result - Resulting binary string
 */
function stringToBin(string) {
    console.assert(string != null && string.trim() != "", { string:string, errorMsg:"stringToBin, string can not be null." });

    let result = encodeToBase(string, 2);

    console.assert(result != null && result.trim() != "", { result, errorMsg: "stringToBin, result should not be empty." });
    return result;
}


/**
 * Returns the input binary string as a textual string
 * @param {string} binString - The binary string to convert to textual string
 * @return {string} result - Resulting textual string
 */
function binToString(binString) {
    console.assert(binString != null, { string:binString, errorMsg:"binToString, binString can not be null." });

    let result = decodeFromBase(binString, 2);

    console.assert(result != null && result.trim() != "", { result, errorMsg: "binToString, result should not be empty." });
    return result;
}

/**
 * Returns the input string as an hexadecimal string
 * @param {string} string - The string to convert to hexadecimal string
 * @return {string} result - Resulting hexadecimal string
 */
function stringToHex(string){
    console.assert(string != null && string.trim() != "", { string:string, errorMsg:"stringToHex, string can not be null." });

    let result = encodeToBase(string, 16);

    console.assert(result != null && result.trim() != "", { result, errorMsg: "binToString, result should not be empty." });
    return result;
}

/**
 * Returns the input hexadecimal string as a textual string
 * @param {string} hexString - The hexadecimal string to convert to textual string
 * @return {string} result - Resulting textual string
 */
function hexToString(hexString) {
    console.assert(hexString != null, { string:hexString, errorMsg:"hexToString, hexString can not be null." });

    let result = decodeFromBase(hexString, 16);

    console.assert(result != null && result.trim() != "", { result, errorMsg: "binToString, result should not be empty." });
    return result;
}

/**
 * Returns the string where each letter of the alphabet
 * is replaced by the number-th letter after in the alphabet
 * @param {String} string: the string to rotate
 * @param {Array | Number } number : the parameter which contains
 * the number by which the string  must be rotated
 * @returns the rotated string
 */
function rotation(string, number) {
    //console.log(number);
    let pivot = number;

    // Check if pivot is an array, if it is the case, get the only key it can hold and make it the pivot.
    if (number instanceof Array) {
        pivot = parseInt(number[0], 10);
    }

    console.assert(pivot > 0, { pivot, errorMsg: "rotation, pivot should be greater than 0." });
    console.assert(pivot < 27, { pivot, errorMsg: "rotation, pivot should be less than 27." });
    // Replace every accepted character (by using regex) by the pivot-th letter after in the alphabet
    let rotated = string.replace(/[a-z]/gi, function(c) {
        return String.fromCharCode( (c <= "Z"? 90:122) >= (c = c.charCodeAt(0) + pivot)?c:c - 26); });

    console.assert(string.length === rotated.length,
        { string:string,
        rotated:rotated,
        errorMsg: "rotation - input string and output rotated should have same length." });
    
    return rotated;
}

/**
 * It is a special case of rotation where each letter is replaced
 * by the 13th letter after.
 * @param {String} string : the string to rotate
 * @returns string with each letter rotated by 13 positions
 */
function rot13(string) {
    // Special case of rotation.
    return rotation(string, 13);
}

/**
 * Another type of rotation.
 * Return a string where each character within the ASCII range [33, 126]
 * is replaced by the character 47 position after it.
 * @param {String} string: the string to rotate
 * @returns the rotated string
 */
function rot47(string) {
    // Create array
    let rotationArray = [];

    // Loop on every char of the string
    for(let index=0; index < string.length; index++) {
        
        // Get code of character
        let charCode = string.charCodeAt(index);
        
        // Check if character is in range
        if (charCode >= 33 && charCode <= 126) {
            // Replace character if it's the case
            rotationArray.push(String.fromCharCode(parseInt(33 + ((charCode + 14) % 94))));
        } else {
            rotationArray.push(string[index]);
        }
    }
    
    console.assert(string.length === rotationArray.length,
                    { string:string,
                    rotationArray:rotationArray,
                    errorMsg: "rot47 - input string and output array should have same length." });

    return rotationArray.join(''); 
}


/**
 * This is a low level function, it should not be called by the user.
 * It should be used with precaution.
 * 
 * Returns the digest of string using the specified algorithm
 * @param {String} algorithm: string representing the hashing algorithm to use
 * @param {String} string: the string to hash
 * @returns hashHex a digest as an hexadecimal string
 */
async function getDigest(algorithm, string) {
    // Encode string as  Uint8Array
    const msgUint8 = new TextEncoder().encode(string);
    // Hash the message using the SubtleCypto interface
    const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);
    // Buffer -> Byte array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Byte array -> hex string
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

/**
 * Returns the digest of string using sha1
 * @param {String} string: the string to hash 
 * @returns digest of string using sha1
 */
async function sha1(string) {
    return await getDigest("SHA-1", string);
}

/**
 * Returns the digest of string using sha256
 * @param {String} string: the string to hash 
 * @returns digest of string using sha256
 */
async function sha256(string) {
    return await getDigest("SHA-256", string);
}

/**
 * Returns the digest of string using sha384
 * @param {String} string: the string to hash 
 * @returns digest of string using sha384
 */
async function sha384(string) {
    return await getDigest("SHA-384", string);
}

/**
 * Returns the digest of string using sha512
 * @param {String} string: the string to hash 
 * @returns digest of string using sha512
 */
async function sha512(string) {
    return await getDigest("SHA-512", string);
}

/**
 * Encodes a text string as a valid component of a Uniform Resource Identifier (URI).
 * @param {String} string: string to represent as URI
 * @returns a string representing the input string as a URI component
 */
function encodeAllURI(string) {
    return encodeURIComponent(string);
}

/**
 * Gets the unencoded version of an encoded component of a Uniform Resource Identifier (URI).
 * @param {String} string: string as URI
 * @returns the unencoded version of string as a String.
 */
function decodeAllURI(string) {
    return decodeURIComponent(string);
}

/**
 * Return the string resulting of the xor algorithm between
 * string and key
 * @param {String} string: base string
 * @param {Array} keyArray:  array with the key (string) to use
 * @returns the resulting string
 */
function xor(string, keyArray) {

    // Extract only key from the array
    let key = keyArray[0];
    // Create array for result
    let xorArray = [];

    // Informations for key
    let keyLength = key.length;
    let keyIndex = 0;

    // Loop on every char of the string
    for(let index=0; index < string.length; index++){
        
        // XOR one character at a time        
        let xorCode = string.charCodeAt(index) ^ key.charCodeAt(keyIndex);
        //console.log(xorCode);
        xorArray.push(String.fromCharCode(xorCode));

        keyIndex++;
        // If key is smaller than word, reset the key index
        // and start again with the key
        if (keyIndex >= keyLength) {
            keyIndex = 0;
        }
    }
    
    console.assert(string.length === xorArray.length,
                    { string:string,
                        xorArray:xorArray,
                    errorMsg: "xor - input string and xor array should have same length." });


    // Make the result a string
    return xorArray.join(''); 
}



/**
 * Return the hexadecimal result of the XOR encoding 
 * of string and key
 * @param {String} string: base string as a textual string
 * @param {Array} key: Array with the string to use as a key
 * @returns the hexadecimal string of the XOR sum between string and key
 */
function encodeXOR(string, key) {
  return stringToHex(xor(string, key));
}

/**
 * Return the textual result of the XOR decoding
 * @param {String} string: the hexadecimal string resulting from a XOR sum
 * @param {Array} key: Array with the string to use as a key
 * @returns the string of the XOR sum between string and key
 */
function decodeXOR(string, key) {
  return xor(hexToString(string), key);
}

/**
 * Return string encoded as a base64 string
 * @param {String} string: initial string
 * @returns input string as a base64 string
 */
function encodeBase64(string) {
    return btoa(string);
}

/**
 * Return string decoded from a base64 string
 * @param {String} string: the base64 string to decode 
 * @returns base64 string as a decoded string
 */
function decodeBase64(string) {
    return atob(string);
}



// EXPORT - IMPORT

/**
 * Export the list of method used
 */
function exportList() {
    // Data as json
    let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(methodsUsed));

    // Create temporary element. His purpose is to offer a download function
    let element = document.createElement("a");
    element.setAttribute("href", "data:" + data);
    element.setAttribute("download", "list.json");

    element.style.display = "none";
    document.body.appendChild(element);

    // Simulate a click on the element.
    element.click();

    // Remove temporary element
    document.body.removeChild(element);
}

/**
 * Import an existing list of methods
 */
function importList() {

    // Check a file is selected
    if(document.getElementById("input-file").value) {
        // Get content
        let fileData = document.getElementById("file-content").textContent;

        let data = JSON.parse(fileData);

        // Add methods from file to list of methods
        for (let i = 0; i < data.length; i++) {
            
            //console.log(data[i]);

            // Find imported method
            let selectedMethod = existingMethods.find(method => method.getName() === data[i].name);

            // Add method to list of used method
            // Create new CryptoMethod object then push it inside array
            methodsUsed.push(
                new CryptoMethod(selectedMethod.getName(),
                                selectedMethod.getNbKeys(),
                                data[i].keyList,
                                selectedMethod.getMethodFunction(),
                                data[i].status
                                ));
                                
        }

        // Reset input file and file data
        document.getElementById("input-file").value = "";
        document.getElementById("custom-file-label").innerText = "Choose file to import";
        document.getElementById("file-content").textContent = "";

        //console.log(methodsUsed);
    }

    // UPDATE UI
    updateUI();
}


/**
 * Add event listener to manage file input
 */
function addEventListenerInputFile() {
    document.getElementById("input-file").addEventListener("change", handleFileSelect, false);
}

/**
 * Handle the selection of the imported file
 */
function handleFileSelect(event) {
    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0]);

    // Change name inside form
    var name = document.getElementById("input-file").files[0].name;
    var nextSibling = event.target.nextElementSibling;
    nextSibling.innerText = name;
}

/**
 * Handle the content of the file loaded
 */
function handleFileLoad(event) {
    //console.log(event);
    document.getElementById("file-content").textContent = event.target.result;
}


/**
 * Fire those events when the window loads
 */
window.onload = () => {
    populateMethods();
    populateMethodsMenu();
}