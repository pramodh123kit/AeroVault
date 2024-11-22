function goToStep(step) {
  // Remove active class from all steps
  document.querySelectorAll(".step").forEach(function (el) {
    el.classList.remove("active");
  });

  // Add active class to the current step
  document.querySelector(".step-" + step).classList.add("active");

  // Mark previous steps as completed
  for (var i = 1; i < step; i++) {
    document.querySelector(".step-" + i).classList.add("completed");
  }

  // Update content based on the step
  var contentUpload = document.querySelector(".uploadpop-up-content");
  if (step === 1) {
    contentUpload.innerHTML = `
            <h2>Select the Departments you want to upload your files</h2>
       <div class="search-box">
                 <input type="text" placeholder="Search Department">
            </div>
            <ul class="department-list">
                <li>
                    <div class="department">
                         <span>Aviation College</span>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </li>
                <li>
                    <div class="department active">
                        <span>Cargo</span>
                       <span>2</span>
                    </div>
                    <div class="sub-departments">
                        <label><input type="checkbox" checked> Select All</label>
                     <label><input type="checkbox" checked> Cargo Operations</label>
                     <label><input type="checkbox" checked> Cargo Sales</label>
                         <label><input type="checkbox"> Cargo Customer Service</label>
                         <label><input type="checkbox"> Cargo Network Planning</label>
                     </div>
                   </li>
                   <li>
                      <div class="department">
                         <span>Cargo Operations</span>
                        <i class="fas fa-chevron-right"></i>
                     </div>
                 </li>
                  <li>
                     <div class="department">
                        <span>Corporate Communications</span>
                        <i class="fas fa-chevron-right"></i>
                   </div>
                </li>
                <li>
                   <div class="department">
                       <span>Corporate Quality</span>
                       <i class="fas fa-chevron-right"></i>
                   </div>
              </li>
         </ul>
         <div class="button-container">
             <button class="next-button" onclick="goToStep(2)">Next <i class="fas fa-chevron-right"></i></button>
            </div>
        `;
  } else if (step === 2) {
    contentUpload.innerHTML = `
            <h2>Select the System you want to upload your files</h2>
           <div class="button-container">
               <button class="back-button" onclick="goToStep(1)"><i class="fas fa-chevron-left"></i> Back</button>
                <button class="next-button" onclick="goToStep(3)">Next <i class="fas fa-chevron-right"></i></button>
           </div>
       `;
  } else if (step === 3) {
    contentUpload.innerHTML = `
          <h2>Select the Category you want to upload your files</h2>
          <div class="button-container">
               <button class="back-button" onclick="goToStep(2)"><i class="fas fa-chevron-left"></i> Back</button>
              <button class="next-button" onclick="goToStep(4)">Next <i class="fas fa-chevron-right"></i></button>
              </div>
          `;
  } else if (step === 4) {
    contentUpload.innerHTML = `
            <h2>Upload your files</h2>
            <div class="upload-area">
                 <img src="../Assets/uploadicn.svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <p>Drag and drop files here or</p>
               <button>Browse Files</button>
           </div>
            <div class="selected-files">
               <p>No files selected</p>
            </div>
              <div class="button-container">
                  <button class="back-button" onclick="goToStep(3)"><i class="fas fa-chevron-left"></i> Back</button>
                 <button class="reset-button" onclick="resetFiles()">Reset</button>
                 <button class="next-button">Upload <i class="fas fa-chevron-right"></i></button>
             </div>
         `;
  }
}

function resetFiles() {
  var selectedFiles = document.querySelector(".selected-files");
  selectedFiles.innerHTML = "<p>No files selected</p>";
}
