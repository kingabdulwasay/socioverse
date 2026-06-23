
const firebaseConfig = {
  apiKey: "AIzaSyBU_My_XUpDdulms82XLQ5j1c11UQYjIsk",
  authDomain: "socio-verse.firebaseapp.com",
  projectId: "socio-verse",
  storageBucket: "socio-verse.firebasestorage.app",
  messagingSenderId: "266174796956",
  appId: "1:266174796956:web:486152daa7fa851e024959"
};


const app = firebase.initializeApp(firebaseConfig);

var provider = new firebase.auth.GoogleAuthProvider();

isLiked = false

async function googleAuth() {
  const credentials = await firebase.auth().signInWithPopup(provider);
  console.log(credentials.user.displayName, credentials.user.email, credentials.user.photoURL)
      var docRef = firebase.firestore().collection("users").doc(credentials.user.uid);
      docRef.get().then((doc) => {
    if (!doc.exists) {
      firebase.firestore().collection("users").doc(credentials.user.uid).set({
    name: credentials.user.displayName,
    email: credentials.user.email,
    photo : credentials.user.photoURL
})
.then(() => {
    console.log("Document successfully written!");

})
.catch((error) => {
    console.error("Error writing document: ", error);
});
    } 
      localStorage.setItem("user", JSON.stringify({ uid: credentials.user.uid, name: credentials.user.displayName, photo: credentials.user.photoURL }))
  window.location.reload()
}).catch((error) => {
    console.log("Error getting document:", error);
})

}

var session = JSON.parse(localStorage.getItem("user"))

document.addEventListener("DOMContentLoaded", async () => {
      getDatafromFirebase()
  if (!session) {
    await googleAuth()
    document.getElementById("profile-avatar").innerHTML = `<a id="profile-avatar" class="nav-item profile-link" href="#">
          <img class="avatar small" src="https://cdn-icons-png.flaticon.com/128/3177/3177440.png" alt="Profile">
          <span>Profile</span>
        </a>`
  } else {

    document.getElementById("profile-avatar").innerHTML = ` <img class="avatar small" src=${session.photo} alt="Profile">
          <span>${session.name}</span>
        </a>`
  }

})

document.getElementById("open-popup").addEventListener("click", () => {
  const popup = document.getElementById("popup");
  const modal = document.querySelector(".popup-modal");
  popup.classList.remove("destroyed");
  modal.classList.remove("destroyed");
  popup.classList.add("active");
  modal.classList.add("active");
  popup.style.display = "flex";
})
var actualFile
document.getElementById("select").addEventListener("change", e => {
  document.getElementById("media-placeholder").style.display = "none"
  document.getElementById("media").style.display = "block"
  document.getElementById("media").src = URL.createObjectURL(e.target.files[0])
  actualFile = e.target.files[0]
})

document.getElementById("post-upload").addEventListener("click", async () => {
  if (session && caption != "") {
  document.getElementById("loader").style.display = "flex"
  
  const popup = document.getElementById("popup");
  const modal = document.querySelector(".popup-modal");
  popup.classList.add("destroyed");
  modal.classList.add("destroyed");
  popup.classList.remove("active");
  modal.classList.remove("active");

  const formData = new FormData()
  formData.append("file", actualFile)
  formData.append("upload_preset", "zlqj3cor")

  const response = await fetch(`https://api.cloudinary.com/v1_1/dobmzstib/upload`, {
    method: 'POST',
    body: formData
  })
  const image = await response.json()
  var caption = document.getElementById("textarea").value
    sendDataToFirebase(session.uid, caption, image.url)
    
  setTimeout(() => {
    popup.style.display = "none";
  }, 300);
  }
})

document.getElementById("popup-close").addEventListener("click", () => {
  const popup = document.getElementById("popup");
  const modal = document.querySelector(".popup-modal");
  popup.classList.add("destroyed");
  modal.classList.add("destroyed");
  popup.classList.remove("active");
  modal.classList.remove("active");
  setTimeout(() => {
    popup.style.display = "none";
  }, 300);
})


function sendDataToFirebase(author, caption, url) {
  firebase.firestore().collection("post").add({
    author,
    caption,
    url
  })
    .then((docRef) => {
      document.getElementById("loader").style.display = "none"
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    })
}
function updateUI(caption, url, writer, photo){

  var postCard = document.createElement('section')
  postCard.classList.add('post-card')
  postCard.innerHTML = ` <div class="post-header">
          <div class="user-meta">
            <img class="avatar" src=${photo} alt="mikaela">
            <div>
              <strong>${writer}</strong>
            </div>
          </div>
          <button class="options" aria-label="Post options"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg></button>
        </div>
        <img class="post-image" src=${url} alt="post">
        <div class="post-actions">
          <div>
            <button class='like-btn' aria-label='Like'><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button class='liked-btn' aria-label='Liked'><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.1 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.65 11.54L12.1 21.35z"/></svg></button>
            <button class='comment-btn' aria-label='Comment'><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></button>
            <button class='share-btn' aria-label='Share'><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
          </div>

        </div>
        <div class="post-likes">876 likes</div>
        <div class="post-caption">${caption}</div>
        <div class="post-comments">View all 18 comments</div>
        <div class="comment-box">
          <input type="text" placeholder="Add a comment..." />
          <button>Post</button>
        </div>`
        postCard.querySelector('.comment-box').style.display = "none"
        isLiked ?
        postCard.querySelector('.like-btn').style.display = "none"
        :
        postCard.querySelector('.liked-btn').style.display = "none"

        postCard.querySelector('.like-btn').addEventListener("click",()=>{
        postCard.querySelector('.like-btn').style.display = "none"

        postCard.querySelector('.liked-btn').style.display = "block"

        })

        postCard.querySelector('.liked-btn').addEventListener("click",()=>{
        postCard.querySelector('.like-btn').style.display = "block"

        postCard.querySelector('.liked-btn').style.display = "none"

        })

        

        postCard.querySelector('.comment-btn').addEventListener("click",()=>{
          postCard.querySelector('.comment-box').style.display = "flex"
        })
        postCard.querySelector('.share-btn').addEventListener("click", ()=>{
            alert("Share!")
        })

  feed.appendChild(postCard)
}

function getDatafromFirebase() {
    var feed = document.getElementById("feed")
    feed.innerHTML = ''
    var caption , url , author, writer, photo, postid;

  firebase.firestore().collection("post").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      caption = doc.data().caption
      url =  doc.data().url
      author =  doc.data().author
var docRef = firebase.firestore().collection("users").doc(author);

docRef.get().then((user) => {
    if (user.exists) {
      writer = user.data().name
      photo = user.data().photo
      console.log(writer)
        console.log("Document data:", user.data());
        updateUI(caption, url, writer, photo)
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});
    });
  });
}

