let googleUser;
var labelsSearched; 

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      console.log(user); 
      googleUser = user;
      getNotes(user.uid)
    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
  labelsSearchSetup(); 
};

function labelsSearchSetup()  {
    const labelSearch = document.querySelector('#labelSearch');
    
    labelSearch.addEventListener('keydown', function (e) {
        if (e.key === "Backspace") {
            labelsSearched = labelSearch.value.substring(0, labelsSearched.length - 1) //Jank Solution - Doesn't work if person deletes in the middle 
        } else {
            labelsSearched = labelSearch.value + e.key; 
        }
        
        
        document.querySelector('#app').innerHTML = "";
        getNotes(googleUser.uid); 
    }); 
}

function getNotes(userId) {
    console.log(userId)
    const notesRef = firebase.database().ref(`users/${userId}`);
    notesRef.on('value', (db) => {
        const data = db.val(); 
        console.log(data)
        renderData(data); 

    });
}

function renderData(data) { 
    // let html = '';
    for (const dataKey in data) {
        const note = data[dataKey]; 
        const cardHtml = renderCard(note);
        // html += cardHtml;  
        if (cardHtml != undefined) {
            document.querySelector('#app').appendChild(cardHtml); 
        }
    }
    // document.querySelector('#app').innerHTML = html; 
}

function renderCard(note) {
    const div = document.createElement('div');
    div.classList.add('column', 'is-one-quarter'); 

    const card = document.createElement('div');
    card.classList.add('card'); 
    card.style.background = `#${Math.floor(Math.random()*16777215).toString(16)}`;

    const header = document.createElement('header');
    header.classList.add('card-header');

    const span = document.createElement('span');
    span.classList.add('card-header-title');
    span.innerHTML = note.title
    
    const cardContentDiv = document.createElement('div');
    cardContentDiv.classList.add('card-content'); 

    const cardContent = document.createElement('div');
    cardContent.classList.add('content');
    cardContent.innerHTML = note.text

    const footer = document.createElement('footer');
    footer.classList.add('card-footer'); 

    const cardFooterSpan = document.createElement('span');
    cardFooterSpan.classList.add('card-footer-info'); 
    cardFooterSpan.innerHTML = `${googleUser.displayName} ${googleUser.email}`

    div.appendChild(card); 
    card.appendChild(header);
    header.appendChild(span);
    card.appendChild(cardContentDiv); 
    cardContentDiv.appendChild(cardContent); 
    card.appendChild(footer);
    footer.appendChild(cardFooterSpan);

    console.log(labelsSearched);
    if (labelsSearched === undefined || labelsSearched === "") {
        return div; 
    } else if (note.labels != undefined && note.labels.includes(labelsSearched)) {
        return div; 
    } else {
        return undefined; 
    }

    // return div; 

    // return `
    //     <div class="column is-one-quarter">
    //         <div class="card">
    //             <header class="card-header">
    //                 <span class="card-header-title">${note.title}</span> 
    //             </header>
    //             <div class="card-content">
    //                 <div class="content">${note.text}</div>
    //             </div>
    //             <footer class="card-footer">                         
    //                 <span class="card-footer-info">${googleUser.displayName} ${googleUser.email}</span> 
    //             </footer>
    //         </div>
    //     </div>
    // `;
}