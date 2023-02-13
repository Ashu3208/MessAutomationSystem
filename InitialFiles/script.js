function showSignInForm() {
  document.getElementById("signinbutton").style.display = "none";
  document.getElementById("registrationbutton").style.display = "none";
  document.getElementById("signInForm").style.display = "block";
  document.getElementById("registrationForm").style.display = "none";
  document.getElementById("signInForm").style.fontSize = "1rem";
}

function showRegistrationForm() {
  document.getElementById("registrationbutton").style.display = "none";
  document.getElementById("signinbutton").style.display = "none";
  document.getElementById("registrationForm").style.display = "block";
  document.getElementById("signInForm").style.display = "none";
  document.getElementById("registrationForm").style.fontSize = "1rem";
}
