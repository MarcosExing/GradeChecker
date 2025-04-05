/**
 * This file provides utility functions for handling file operations, specifically saving and loading files, for now.
 */

/**
 * Saves data to a file, prompting the user to download it.
 *
 * @param {string} data - The data to be saved to the file. This should be a string.
 * @param {string} fileName - The name of the file to be saved (without the extension).
 * @param {string} fileType - The MIME type of the file (e.g., 'application/json', 'text/plain').
 */
export function saveFile(data, fileName, fileType){

    // Check if the data is null or undefined. If so, alert the user and return early.
    if(data === null || data === undefined){
        window.alert("No data to save");
        return;
    }
    
    // Create a new Blob object from the data and file type.
    var file = new Blob([data], {type: fileType});
    
    // Create an anchor (<a>) element. This will be used to trigger the download.
    var a = document.createElement("a");
    // Create a URL for the Blob object. This URL will be used as the href for the anchor.
    var url = URL.createObjectURL(file);

    // Set the href of the anchor to the Blob URL.
    a.href = url;
    // Set the download attribute of the anchor to the desired file name.
    a.download = fileName;
    // Append the anchor to the DOM. This is necessary for the click() method to work.
    document.body.appendChild(a);
    // Simulate a click on the anchor to trigger the download.
    a.click();

    // Use setTimeout to remove the anchor and revoke the URL after the click event.
    // This is done asynchronously to ensure the download has started before cleanup.
    setTimeout(function(){
        // Remove the anchor from the DOM.
        document.body.removeChild(a);
        // Revoke the Blob URL to free up memory.
        window.URL.revokeObjectURL(url);
    }, 0); // The 0ms delay ensures this runs after the current event loop.
}

/**
 * Loads a file selected by the user and returns its content as a string.
 *
 * @param {string} type - The accepted file type (e.g., '.json', '.txt').
 * @returns {Promise<string>} A promise that resolves with the file content as a string or rejects with an error message.
 */
export function loadFile(type){
    // Return a new Promise to handle the asynchronous file loading.
    return new Promise((resolve, reject) => {

        // Create a new input element of type "file".
        var input = document.createElement("input");
        input.type = "file";
        // Set the accept attribute to the specified file type.
        input.accept = type;
        
        // Append the input to the DOM.
        document.body.appendChild(input);

        // Add an event listener for the "change" event on the input.
        input.addEventListener("change", (event) => {
            // Get the selected file from the input's files array.
            var file = input.files[0];
            // Check if a file was selected.
            if(file){
                // Create a new FileReader object to read the file.
                var reader = new FileReader();
        
                // Set the onload event handler for the reader.
                reader.onload = (e) => resolve(e.target.result); // Resolve the promise with the file content.
                // Read the file as text.
                reader.readAsText(file);
            }
            else{
                // Reject the promise if no file was selected.
                reject("No file selected");
            }
        });

        // Simulate a click on the input to open the file selection dialog.
        input.click();

        // Use setTimeout to remove the input after the click event.
        // This is done asynchronously to ensure the download has started before cleanup.
        setTimeout(function(){
            document.body.removeChild(input);
        }, 0);

    });
}
