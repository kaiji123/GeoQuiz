//Dark Mode Theme

//Enabled/Disabled depending on the OS setting
const toggle = document.getElementById("data-theme");

const storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

if (storedTheme) {
  document.documentElement.setAttribute('data-theme', storedTheme)
}

//To allow toggle between light and dark themes
function toggletheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  let targetTheme = "light";

  if (currentTheme === "light") {
    targetTheme = "dark";
  }

  document.documentElement.setAttribute('data-theme', targetTheme)
  localStorage.setItem('theme', targetTheme);
};