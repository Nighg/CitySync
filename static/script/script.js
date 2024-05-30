
const dropArea = document.querySelector('.drop-section'); // Corrected class name
const listSection = document.querySelector('.list-section');
const listContainer = document.querySelector('.list');
const fileSelector = document.querySelector(".file-selector");
const fileSelectorInput = document.querySelector('.file-selector-input');


// upload files with browse button 
fileSelector.onclick = () => fileSelectorInput.click();

fileSelectorInput.onchange = () => {
    console.log("Files selected:", fileSelectorInput.files);
    [...fileSelectorInput.files].forEach((file) => {
        console.log("Processing file:", file.name);
        if (typeValidation(file.type)) {
            console.log("Valid file:", file.name);
            uploadFile(file);
        } else {
            console.log("Invalid file:", file.name);
        }
    });
};

// when file is over the drag area
dropArea.ondragover = (e) => {
    e.preventDefault();
    [...e.dataTransfer.items].forEach((item) => {
        if (typeValidation(item.type)) {
            dropArea.classList.add('drag-over-effect');
        }
    });
};

// when file leaves the drag area
dropArea.ondragleave = () => {
    dropArea.classList.remove('drag-over-effect');
};

//when file drop on the drag area

dropArea.ondrop=(e)=>{
  e.preventDefault();
  dropArea.classList.remove('drag-over-effect')
  if(e.dataTransfer.items){
    [...e.dataTransfer.items].forEach((item)=>{
      if(item.kind === 'file'){
        const file = item.getAsFile();
        if(typeValidation(file.type)){
          uploadFile(file)
        }
      }
    })
  }else{
    [...e.dataTransfer.files].forEach((file)=>{
      if(typeValidation(file.type)){
        uploadFile(file)
      }
    })
  }
}

// check the file type
function typeValidation(type) {
    var splitType = type.split('/')[0];
    if (splitType === 'image' || type.startsWith('video/')) {
        return true;
    } else {
        console.log("Invalid file type:", type);
        return false;
    }
}

// //upload file functiom


// JavaScript code to dynamically set image source
// function uploadFile(file) {
//   listSection.style.display = 'block'; // Corrected property name
//   var li = document.createElement('li');
//   li.classList.add('in-prog');
//   li.innerHTML = ` 
//     <div class="col">
//     <img src="static/images/imgpng.png" width="50" alt="img"> <!-- Set the image source directly -->
//     </div>
//     <div class="col">
//       <div class="file-name">
//         <div class="name">${file.name}</div>
//         <span>50%</span>
//       </div>
//       <div class="file-progress">
//         <span></span>
//       </div>
//       <div class="file-size">${(file.size / (1024 * 1024)).toFixed(2)}MB</div>
//     </div>
//     <div class="col">
//       <svg xmlns="http://www.w3.org/2000/svg" height="24" class="cross" viewBox="0 -960 960 960" width="24"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
//       <svg xmlns="http://www.w3.org/2000/svg" height="24" class="tick" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
//     </div> 
//   `;
  
//   listContainer.prepend(li);
//   const formData = new FormData();
//   formData.append('image_name', file);

//   // Create a new XMLHttpRequest object
//   const xhr = new XMLHttpRequest();

//   // Define onload event handler
//   xhr.onload = function() {
//     li.classList.add('complete');
//     li.classList.remove('in-prog');
//   };

//   // Define onprogress event handler
//   xhr.upload.onprogress = function(e) {
//     var percent_complete = (e.loaded / e.total) * 100;
//     li.querySelectorAll('span')[0].innerHTML = Math.round(percent_complete) + '%';
//     li.querySelectorAll('span')[1].style.width = percent_complete + '%';
//   };

//   // Open and send the request
//   xhr.open('POST', '/', true);
//   xhr.send(formData);
// }

function uploadFile(file) {
  listSection.style.display = 'block'; // Corrected property name
  var li = document.createElement('li');
  li.classList.add('in-prog');
  li.innerHTML = ` 
    <div class="col">
    <img src="static/images/${iconSelector(file.type)}" width="50" alt="img"> <!-- Set the image source directly -->
    </div>
    <div class="col">
      <div class="file-name">
        <div class="name">${file.name}</div>
        <span>50%</span>
      </div>
      <div class="file-progress">
        <span></span>
      </div>
      <div class="file-size">${(file.size / (1024 * 1024)).toFixed(2)}MB</div>
    </div>
    <div class="col">
      <svg xmlns="http://www.w3.org/2000/svg" height="24" class="cross" viewBox="0 -960 960 960" width="24"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
      <svg xmlns="http://www.w3.org/2000/svg" height="24" class="tick" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
    </div> 
  `;
  
  listContainer.prepend(li);
  const formData = new FormData();
  formData.append('image_name', file);

  // Create a new XMLHttpRequest object
  const xhr = new XMLHttpRequest();

  // Define onload event handler
  xhr.onload = function() {
    const response = JSON.parse(xhr.response);
        const message = response.message;
        // const textList = response.text_list;
        const upload = response.upload;

        showMessage(message,upload); // Display the message received from the server

    li.classList.add('complete');
    li.classList.remove('in-prog');
  };

  // Define onprogress event handler
  xhr.upload.onprogress = function(e) {
    var percent_complete = (e.loaded / e.total) * 100;
    li.querySelectorAll('span')[0].innerHTML = Math.round(percent_complete) + '%';
    li.querySelectorAll('span')[1].style.width = percent_complete + '%';
  };
    
  // Open and send the request
  xhr.open('POST', '/', true);
  xhr.send(formData);
  li.querySelector('.cross').onclick=()=>xhr.abort()
  xhr.onabort=()=>li.remove()

}
// Function to display the message on the HTML side
function showMessage(message) {
  const messageElement = document.getElementById('message');
  const imgnm=message;
  const src="/static/predict/"+imgnm;
  messageElement.src = src;
  if(message=="File processed successfully!")
    {

        // var popup=document.getElementById('popup');
        // popup.classList.toggle('active');
        // var blur=document.getElementById('blur');
        // blur.classList.toggle('active')
        
    }
  else
  {
    toggle();
  }

  }

// Find icon for the file  
function iconSelector(type) {
  var fileType = type.split('/')[0];
  if (fileType === 'image') {
    return 'imgpng.png'; // Return image icon for image files
  } else if (fileType === 'video') {
    return 'videopng.png'; // Return video icon for video files
  } else {
    return 'file_icon.png'; // Return a default icon for other file types
  }
}

function toggle(){
  var blur=document.getElementById('blur');
  blur.classList.toggle('active');
  var popup=document.getElementById('popup');
  popup.classList.toggle('active');
}

const navE1=document.querySelector('.navbar');
window.addEventListener('scroll',()=>{
  if(window.scrollY>=56){
      navE1.classList.add('navbar-scrolled');
  } else if(window.scrollY<56){
    navE1.classList.remove('navbar-scrolled');
  }
});

// const scroll = new LocomotiveScroll({
//   el: document.querySelector('main'),
//   smooth: true
// });