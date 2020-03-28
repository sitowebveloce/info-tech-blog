// Selection
let btnShowNav = document.querySelector(".img-show");
let btnAddPost = document.querySelector(".info-btn-add");
let btnModalClose = document.querySelector(".info-modal-close");
let header = document.getElementsByTagName("header");
let modalWindow = document.querySelector(".info-modal-window");
let nav = document.querySelector(".info-nav");
let content = document.querySelectorAll(".content");
let contentHeader = document.querySelector(".contentHeader");

// Open var
let open = false;

//****************** ADD RESPONSIVENESS JS MEDIA QUERY*/
function mediaQueryJs() {
  if (open) {
    header[0].style.backgroundColor = "#ffffff";
    header[0].style.color = "rgba(99, 7, 248, 1)";
    // Set content size
    content.forEach(item => {
      // console.log(item);
      // FIND WINDOW WIDTH SIZE
      let winWidth = window.innerWidth;
      // Media query
      if (winWidth > 768) {
        item.style.marginLeft = winWidth / 2 - 260 + 125 + "px";
        item.style.marginRight = "auto";
        // Set width default value
        item.style.width = 520 + "px";
        // Reset to display block
        item.style.display = "block";
        // Add show-btn class
        btnShowNav.style.marginLeft = "calc(260px - 37px)";
        // Set nav width
        nav.style.width = 260 + "px";
        // content header
        contentHeader.style.marginLeft = winWidth / 2 - 260 + 125 + "px";
        contentHeader.style.marginRight = "auto";
        // Set width default value
        contentHeader.style.width = 520 + "px";
      } else if (winWidth < 768) {
        if (winWidth < 520) {
          item.style.display = "none";
          // SET NAV WIDTH ALL THE WINDOWS SIZE
          nav.style.width = winWidth + "px";
          // SET Z-INDEX FOR THE BTN OTHERWISE REMAIN HIDDEN
          btnShowNav.style.zIndex = "3";
          btnShowNav.style.marginLeft = "86%";
        } else {
          item.style.display = "block";
          item.style.marginLeft = `260` + "px";
          item.style.marginRight = "auto";
          item.style.width = winWidth - 280 + "px";
          nav.style.width = 260 + "px";
          btnShowNav.style.marginLeft = "calc(260px - 37px)";
          // content header
          contentHeader.style.marginLeft = "260" + "px";
          contentHeader.style.marginRight = "auto";
          // Set width default value
          contentHeader.style.width = winWidth - 280 + "px";
        }
      }
    });
  } else {
    // if 'open' is false styels come back
    header[0].style.backgroundColor = "rgba(99, 7, 248, 1)";
    header[0].style.color = "#ffffff";

    // content
    content.forEach(item => {
      // check windows size
      let winWidth = window.innerWidth;

      if (winWidth < 520) {
        item.style.display = "block";
        // Add show-btn class
        btnShowNav.style.marginLeft = "1%";
      } else if (winWidth > 768) {
        // Set width default value
        item.style.width = 520 + "px";
        item.style.display = "block";
        item.style.marginLeft = "auto";
        item.style.marginRight = "auto";
        // content header
        contentHeader.style.marginLeft = "auto";
        contentHeader.style.marginRight = "auto";
        // Set width default value
        contentHeader.style.width = 520 + "px";
        // Add show-btn class
        btnShowNav.style.marginLeft = "1%";
      } else {
        item.style.display = "block";
        item.style.opacity = "1";
        item.style.marginRight = "auto";
        item.style.marginLeft = "auto";
        // content header
        contentHeader.style.marginLeft = "autp";
        contentHeader.style.marginRight = "auto";
        // Add show-btn class
        btnShowNav.style.marginLeft = "1%";
      }
    });
  }
}

//*** CHECK WINDOWS SIZE RUN RESIZE FUNCTION */
window.addEventListener("resize", () => {
  mediaQueryJs();
});

//************************* Add event listener
//*** SHOW NAV */
btnShowNav.addEventListener("click", () => {
  // Toggle open value
  open = !open;
  nav.classList.toggle("show-nav");
  btnShowNav.classList.toggle("show-btn");
  // Run mediaQuery function
  mediaQueryJs();
});
//*** Open modal add post window */
btnAddPost.addEventListener("click", () => {
  modalWindow.classList.add("info-modal-window-show");
});
//*** Close modal window */
btnModalClose.addEventListener("click", () => {
  modalWindow.classList.remove("info-modal-window-show");
});
//*** Close modal window on click outside the form */
// window.addEventListener("click", e => {
//   //   console.log(e.target);
//   //   console.log(modalWindow);
//   e.target == modalWindow
//     ? modalWindow.classList.remove("info-modal-window-show")
//     : false;
// });
