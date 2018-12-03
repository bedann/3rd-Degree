







function loginWithGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider();
    showLoader();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        hideLoader();
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        window.location.replace('../index.html');
        localStorage.uid = user.uid;
        localStorage.logedin = true;
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        hideLoader();
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('Error with sign in: ',errorMessage);
        
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
}


function showLoader(){
  document.getElementById('load-panel').style.visibility='visible';
}

function hideLoader(){
  document.getElementById('load-panel').style.visibility='hidden';
}