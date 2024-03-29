/*!
* Start Bootstrap - Freelancer v7.0.6 (https://startbootstrap.com/theme/freelancer)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
*/

//import { globalAgent } from "http";

//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 72,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
});

function getDaysInMonth(month, year) {
    //console.log(month);
    const tempDate = new Date(year, month, 0);
    //console.log(tempDate);
    return tempDate.getDate();
};


function load_calendar() {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let months = ['Janurary', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const calendar_div = document.getElementById("calendar_data_container");
    const date = new Date();
    //console.log(new Date());
    var first = new Date(date.getFullYear(), date.getMonth(), 1);
    var firstDay = first.getDay();
    //console.log(firstDay);
    var numDays = getDaysInMonth(date.getMonth(), date.getFullYear());
    //console.log(numDays);
    var numWeeks = Math.ceil(numDays / 7);
    //console.log(numWeeks);
    let j = 1;
    const calendar_title = document.getElementById("calendar__picture");
    let title_string1 = "<h2>" + date.getDate() + ", " + days[date.getDay()] + "</h2>";
    let title_string2 = "<h3>" + months[date.getMonth()] + "</h3>";
    calendar_title.innerHTML += title_string1;
    calendar_title.innerHTML += title_string2;
    while (numWeeks > 0) {
        let i = 0;
        const weekDiv = document.createElement("div");
        weekDiv.classList.add("week_container", "text-white");
        weekDiv.style.display = "flex";
        weekDiv.style.flexDirection = "row";
        while (i < 7) {
            if (j == date.getDate()) {
                var string = "<div class='calendar__number--current'>" + j + "</div>";
                weekDiv.innerHTML += string;
                numDays--;
                j++;
            } else if (firstDay > 0) {
                var string = "<div class='calendar__number'></div>";
                weekDiv.innerHTML += string;
                firstDay--;
            } else if (numDays > 0) {
                var string = "<div class='calendar__number'>" + j + "</div>";
                weekDiv.innerHTML += string;
                numDays--;
                j++;
            }
            //console.log(firstDay);
            i++;
        }
        //console.log(weekDiv.innerHTML);
        numWeeks--;
        calendar_div.appendChild(weekDiv);
    }
    //console.log(calendar_div.innerHTML);
};



function displayTutorForm() {
    const tutorButtonForm = document.getElementById("form-label-tutor");
    const classButtonForm = document.getElementById("form-label-class");
    const tutorDivForm = document.getElementById("form-content-tutor");
    const classDivForm = document.getElementById("form-content-class");
    tutorDivForm.style.display = "flex";
    classDivForm.style.display = "none";
    classButtonForm.classList.remove("bg-white");
    classButtonForm.classList.remove("text-primary");
    classButtonForm.style.borderRadius = "0rem";
    tutorButtonForm.style.borderRadius = "1rem";
    classButtonForm.classList.add("bg-primary");
    classButtonForm.classList.add("text-white");
    tutorButtonForm.classList.remove("bg-primary");
    tutorButtonForm.classList.remove("text-white");
    tutorButtonForm.classList.add("bg-white");
    tutorButtonForm.classList.add("text-primary");
};

function displayClassForm() {
    const tutorButtonForm = document.getElementById("form-label-tutor");
    const classButtonForm = document.getElementById("form-label-class");
    const tutorDivForm = document.getElementById("form-content-tutor");
    const classDivForm = document.getElementById("form-content-class");
    tutorDivForm.style.display = "none";
    classDivForm.style.display = "flex";
    tutorButtonForm.classList.remove("bg-white");
    tutorButtonForm.classList.remove("text-primary");
    tutorButtonForm.style.borderRadius = "0rem";
    classButtonForm.style.borderRadius = "1rem";
    tutorButtonForm.classList.add("bg-primary");
    tutorButtonForm.classList.add("text-white");
    classButtonForm.classList.remove("bg-primary");
    classButtonForm.classList.remove("text-white");
    classButtonForm.classList.add("bg-white");
    classButtonForm.classList.add("text-primary");
};

var favToggler = false;

function displayAll() {
    //console.log("Display All is being called.");
    const cards = document.getElementsByClassName("filter-all");
    for (var i = 0; i < cards.length; i++) {
        var s = cards[i].style;
        s.visibility = "visible";
    }

    const favcards = document.getElementsByClassName("filter-fav");
    for (var i = 0; i < favcards.length; i++) {
        var s = favcards[i].style;
        s.visibility = "visible";
    }
    const allbutton = document.getElementById("ALL-BUTTON");
    const favButton = document.getElementById("FAV-BUTTON");
    allbutton.classList.add("bg-secondary", "text-white");
    favButton.classList.remove("bg-secondary", "text-white");
    favToggler = false;
};
function displayFavs() {
    //console.log("Display Favs is being called.");
    const cards = document.getElementsByClassName("filter-all");
    for (var i = 0; i < cards.length; i++) {
        var s = cards[i].style;
        s.visibility = "hidden";
    }
    const allbutton = document.getElementById("ALL-BUTTON");
    const favButton = document.getElementById("FAV-BUTTON");
    favButton.classList.add("bg-secondary", "text-white");
    allbutton.classList.remove("bg-secondary", "text-white");
    favToggler = true;
};

function updateFavs() {
    if (favToggler == true) {
        displayFavs();
    } else {
        displayAll();
    }
};

function displayList1() {
    var checkList = document.getElementById('list1');
    console.log("function is being called");
    if (checkList.classList.contains('visible'))
        checkList.classList.remove('visible');
    else
        checkList.classList.add('visible');
};

function displayList2() {
    var checkList2 = document.getElementById('list2');
    if (checkList2.classList.contains('visible'))
        checkList2.classList.remove('visible');
    else
        checkList2.classList.add('visible');
};

function onlyOneDay(checkbox) {
    var checkboxes = document.getElementsByClassName("apptDays");
    console.log(checkboxes);
    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false
    })
};

function addtoFavorites(index) {
    var name = "tutorCard" + index;
    const card = document.getElementById(name);
    if (card.classList.contains("filter-fav")) {
        //console.log("being removed from favorites");
        card.classList.remove("filter-fav");
        card.classList.add("filter-all");
    } else {
        //console.log("being added to favorites");
        card.classList.remove("filter-all");
        card.classList.add("filter-fav");
    }
};

function handleData() {
    var form_data = new FormData(document.querySelector("#tutor-signup-form"));

    if (!form_data.has("days[]")) {
        document.getElementById("chk_option_error_days").style.visibility = "visible";
        return false;
    } else if (!form_data.has("shifts[]")) {
        document.getElementById("chk_option_error_shifts").style.visibility = "visible";
        return false;
    }
    else {
        document.getElementById("chk_option_error_days").style.visibility = "hidden";
        document.getElementById("chk_option_error_shifts").style.visibility = "hidden";
        return true;
    }

};

