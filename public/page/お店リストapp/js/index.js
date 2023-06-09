let pw = document.getElementById("pw");

pw.addEventListener("click", showPwForm);

function showPwForm() {
  var UserInput = prompt("ぱすわーど は なにかな ？", "");
  location.href = UserInput + ".html";
}
