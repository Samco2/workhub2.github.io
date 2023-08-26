/* infinite slider2 */
const wrapp = document.querySelector(".wrapp");
const carous = document.querySelector(".carous");
const firstCarWidth = carous.querySelector(".car").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapp i");
const carousChildrens = [...carous.children];

let isDragging = false, isAutoPlay = false, startX, startScrollLeft, timeoutId;

// Get the number of cars that can fit in the carous at once
let carPerView = Math.round(carous.offsetWidth / firstCarWidth);

// Insert copies of the last few cars to beginning of carous for infinite scrolling
carousChildrens.slice(-carPerView).reverse().forEach(car => {
    carous.insertAdjacentHTML("afterbegin", car.outerHTML);
});

// Insert copies of the first few cars to end of carous for infinite scrolling
carousChildrens.slice(0, carPerView).forEach(car => {
    carous.insertAdjacentHTML("beforeend", car.outerHTML);
});

// Scroll the carous at appropriate postition to hide first few duplicate cars on Firefox
carous.classList.add("no-transition");
carous.scrollLeft = carous.offsetWidth;
carous.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carous left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carous.scrollLeft += btn.id == "left" ? -firstCarWidth : firstCarWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carous.classList.add("dragging");
    // Records the initial cursor and scroll position of the carous
    startX = e.pageX;
    startScrollLeft = carous.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carous based on the cursor movement
    carous.scrollLeft = startScrollLef - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carous.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the carous is at the beginning, scroll to the end
    if(carous.scrollLeft === 0) {
        carous.classList.add("no-transition");
        carous.scrollLeft = carous.scrollWidth - (2 * carous.offsetWidth);
        carous.classList.remove("no-transition");
    }
    // If the carous is at the end, scroll to the beginning
    else if(Math.ceil(carous.scrollLeft) === carous.scrollWidth - carous.offsetWidth) {
        carous.classList.add("no-transition");
        carous.scrollLeft = carous.offsetWidth;
        carous.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carous
    clearTimeout(timeoutId);
    if(!wrapp.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carous after every 2500 ms
    timeoutId = setTimeout(() => carous.scrollLeft += firstCarWidth, 2500);
}
autoPlay();

carous.addEventListener("mousedown", dragStart);
carous.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carous.addEventListener("scroll", infiniteScroll);
wrapp.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapp.addEventListener("mouseleave", autoPlay);






