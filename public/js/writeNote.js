let googleUser;
let labelsArr = []; 



window.onload = (event) => {
    // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });

  labelSetUp(); 
};

const handleNoteSubmit = () => {
  // 1. Capture the form data
  const noteTitle = document.querySelector('#noteTitle');
  const noteText = document.querySelector('#noteText');
  const labelContainer = document.querySelector('#labels-container');

//   2. Format the data and write it to our database
  firebase.database().ref(`users/${googleUser.uid}`).push({
    title: noteTitle.value,
    text: noteText.value,
    labels: labelsArr
  })
  // 3. Clear the form so that we can write a new note
  .then(() => {
    noteTitle.value = "";
    noteText.value = "";
    labelsArr = [];
    labelContainer.innerHTML = ""; 
  });
}

function labelSetUp() {
    const labelInput = document.querySelector('#labelsinput');
    const labelContainer = document.querySelector('#labels-container');
    labelInput.addEventListener('keypress', function (e) {
        if (e.key === "Enter") {
            // let labelHtml = `
            //         <span class="tag is-light">${labelInput.value}
            //             <button class="delete is-rounded is-small"></button>
            //         </span>
            //     `;
            
            const span = document.createElement('span');
            span.classList.add('tag');
            span.innerHTML = labelInput.value

            const button = document.createElement('button');
            button.classList.add('delete');
            button.classList.add('is-small');

            span.appendChild(button); 
            labelContainer.appendChild(span); 
            labelsArr.push(labelInput.value); 
            labelInput.value = "";
            console.log(labelsArr);
        }
    });
};


