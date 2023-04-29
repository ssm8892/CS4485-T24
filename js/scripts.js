/*!
* Start Bootstrap - Freelancer v7.0.6 (https://startbootstrap.com/theme/freelancer)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
*/
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

const tutorButton = document.getElementById("dash-label-tutor");
const classButton = document.getElementById("dash-label-class");
const tutorDiv = document.getElementById("dash-content-tutor");
const classDiv = document.getElementById("dash-content-class");
tutorButton.onclick = function() {
    tutorDiv.style.display = "flex";
    classDiv.style.display = "none";
    classButton.classList.remove("bg-white");
    classButton.classList.remove("text-primary");
    classButton.style.borderRadius = "0rem";
    tutorButton.style.borderRadius = "1rem";
    classButton.classList.add("bg-primary");
    classButton.classList.add("text-white");
    tutorButton.classList.remove("bg-primary");
    tutorButton.classList.remove("text-white");
    tutorButton.classList.add("bg-white");
    tutorButton.classList.add("text-primary");
};

classButton.onclick = function() {
    tutorDiv.style.display = "none";
    classDiv.style.display = "flex";
    tutorButton.classList.remove("bg-white");
    tutorButton.classList.remove("text-primary");
    tutorButton.style.borderRadius = "0rem";
    classButton.style.borderRadius = "1rem";
    tutorButton.classList.add("bg-primary");
    tutorButton.classList.add("text-white");
    classButton.classList.remove("bg-primary");
    classButton.classList.remove("text-white");
    classButton.classList.add("bg-white");
    classButton.classList.add("text-primary");
};


const tutorButtonForm = document.getElementById("form-label-tutor");
const classButtonForm = document.getElementById("form-label-class");
const tutorDivForm = document.getElementById("form-content-tutor");
const classDivForm = document.getElementById("form-content-class");
tutorButtonForm.onclick = function() {
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

classButtonForm.onclick = function() {
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
