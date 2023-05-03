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



console.log(favtutors.classList);
function displayAll() {
    console.log("Display All is being called.");
    const tutorDiv = document.getElementById("dash-content-tutor");
    const favtutors = document.getElementById("dash-content-tutor-favs");
    tutorDiv.style.display = "flex";
    favtutors.style.display = "none";
};
function displayFavs() {
    console.log("Display Favs is being called.");
    const tutorDiv = document.getElementById("dash-content-tutor");
    const favtutors = document.getElementById("dash-content-tutor-favs");
    favtutors.style.display = "flex";
    tutorDiv.style.display = "none";
};

var checkList = document.getElementById('list1');
checkList.getElementsByClassName('anchor1')[0].onclick = function(evt) {
  if (checkList.classList.contains('visible'))
    checkList.classList.remove('visible');
  else
    checkList.classList.add('visible');
}

var checkList2 = document.getElementById('list2');
checkList2.getElementsByClassName('anchor2')[0].onclick = function(evt) {
  if (checkList2.classList.contains('visible'))
    checkList2.classList.remove('visible');
  else
    checkList2.classList.add('visible');
}


function handleData()
{
    var form_data = new FormData(document.querySelector("#tutor-signup-form"));
    
    if(!form_data.has("days[]"))
    {
        document.getElementById("chk_option_error_days").style.visibility = "visible";
        return false;
    }else if(!form_data.has("shifts[]")){
        document.getElementById("chk_option_error_shifts").style.visibility = "visible";
        return false;
    }
    else
    {
        document.getElementById("chk_option_error_days").style.visibility = "hidden";
        document.getElementById("chk_option_error_shifts").style.visibility = "hidden";
      return true;
    }
    
}

