window.onload = function() {
    /*=================================================================================
                PRELOADER and start header animations when page is loaded
    =================================================================================*/
    (function () {
        const preloader = document.querySelector(".preloader");
        const headerEl = document.querySelector(".header-preloader");
        headerEl.style.display = "flex";
        if (preloader) {
            preloader.style.opacity = "0";
            setTimeout(function() {
                preloader.style.display = "none"; //optional
                preloader.remove();
            }, 250);
        }
    })();

    /*=================================================================================
                DELAY loading of CRISP chat
    =================================================================================*/
    setTimeout(function() {
        window.$crisp = [];
        window.CRISP_WEBSITE_ID = "43426c74-7b60-4141-acc9-01fd4ce0bf62";
        (function () {
            d = document;
            s = d.createElement("script");
            s.src = "https://client.crisp.chat/l.js";
            s.async = 1;
            d.getElementsByTagName("head")[0].appendChild(s);
        })();
    }, 6000)
};
/*==============================
       END Window Onload
===============================*/

/*==========================================================
            TOGGLE Mobile Menu
==========================================================*/
function toggleMobileMenu() {
    const hamburgerMenu = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.menu-primary');
    hamburgerMenu.onclick = function toggleMenu() {   // Or addEventListener if not working on IE
        if (hamburgerMenu.classList.contains('active')) {
            hamburgerMenu.classList.remove('active');
        } else {
            hamburgerMenu.classList.add('active');
        }
        // hamburgerMenu.classList.remove('active'); // not working on IE Mobile?
        if (navMenu.classList.contains("active")) {
            navMenu.style.animation = "fadeout .3s ease";
            setTimeout(function() {
                navMenu.classList.remove('active');
                navMenu.removeAttribute("style");
            }, 300);
        } else {
            navMenu.classList.add('active');
        }
    };
}
toggleMobileMenu();

//
// function toggleHamburgerMenu () {
//     var hamburger = document.querySelector('.hamburger-button');
//     var navmenu = document.querySelector('.menu-primary');
//     hamburger.addEventListener('click', function() {
//         if (hamburger.classList.contains("active")) {
//             hamburger.style.animation = "fadeout .3s ease";
//             setTimeout(function() {
//                 hamburger.classList.remove('active');
//                 hamburger.removeAttribute("style");
//             }, 300);
//         } else {
//             hamburger.classList.add('active');
//         }
//         if (navmenu.classList.contains("active")) {
//             navmenu.style.animation = "fadeout .3s ease";
//             setTimeout(function() {
//                 navmenu.classList.remove('active');
//                 navmenu.removeAttribute("style");
//             }, 300);
//         } else {
//             navmenu.classList.add('active');
//         }
//     });
// }
// toggleHamburgerMenu();

/*=============================
    HIDING NAVBAR ON SCROLL
=============================*/


/*=================================================================================
     AUTO CREATE SLIDER NAV BULLETS AND SET DATA-NUMBER ATTRIBUTE TO SLIDERS
=================================================================================*/

let sliders = document.querySelectorAll(".slide");
let navigationBullets;

(() => {
    let sliderLength = sliders.length;
    for (let i = 0; i < sliderLength; i++) {
        sliders[i].dataset.number = i;
        navigationBullets = document.createElement("span");
        navigationBullets.classList.add("nav-numbers");
        navigationBullets.innerHTML = "0" + (i + 1);
        document.querySelector(".slider-nav").appendChild(navigationBullets);
    }
})();


/*==================================
    SLIDER NAV BULLETS NAVIGATION
==================================*/

let navNumbers = document.querySelectorAll(".nav-numbers"); // Navigation numbers (near prev next buttons)
navNumbers[0].dataset.status = "active";

const setActiveSlideBullet = (activeSlider, changeValue) => {
    navNumbers[activeSlider].removeAttribute("data-status");
    navNumbers[activeSlider + changeValue].dataset.status = "active";
};


/*==================================
      CHANGE CURRENT SLIDER
==================================*/

const setActiveSlider = (activeSlider, changeValue) => {
    sliders[activeSlider].classList.add("not-visible");
    setTimeout(() => {
        sliders[activeSlider].dataset.status = "unactive";
        sliders[activeSlider].classList.remove("not-visible");
        sliders[activeSlider + changeValue].dataset.status = "active";
    }, 300);
    setActiveSlideBullet(activeSlider, changeValue);
};

const changeSlide = changeValue => {
    let activeSlider = parseFloat(document.querySelector(".slide[data-status='active']").dataset.number);
    if (activeSlider === 0 && changeValue === (-1)) {
        setActiveSlider(0, sliders.length - 1);
    } else if (activeSlider === sliders.length - 1 && changeValue === (1)) {
        setActiveSlider(sliders.length - 1, -(sliders.length - 1));
    } else {
        setActiveSlider(activeSlider, changeValue);
    }
};


/*==================================
     DISABLE SLIDERS AUTOPLAY
==================================*/

let pause = false;

let pauseSlider = () => {
    pause = true;
};

(() => {
    let interval = setInterval(() => {
        pause ? clearInterval(interval) : changeSlide(1);
    }, 11000);
})();


// TODO zrobic tak, zeby slider 2 i 3 doczytaly sie po kilku sekundach, na ten czas zamrozic mozliwosc zmiany slajdow navigatorem,
// scroll into view smooth nie jest obslugiwany na wszystkich przegladarkah, polyfill https://github.com/iamdustan/smoothscroll
// removeListener pauzy ze slajdow hero image po kliknieciu (jak w tabach)


const agencySection = document.querySelector(".agency");

const start = () => {
    agencySection.scrollIntoView({behavior: "smooth"})
};

const tabOverflow = document.querySelector(".tab-overflow");
const tabButtons = document.querySelectorAll(".tab-button__item");
const tabContentItems = document.querySelectorAll(".tab-content__item");
let activeSwitchTab = document.querySelector(".tab-button__item[data-status='active']");
let activeTabContentItem = document.querySelector(".tab-content__item[data-status='active']");

let pauseTabs = false;

/* shows more services button */
const showMoreServices = () => {
    tabOverflow.classList.toggle("move-y");
};

const stopTabs = () => {
    pauseTabs = true;
    tabButtons.forEach(tab => {
        tab.removeEventListener("click", stopTabs);
    });
};

/* invoked by intersection observer event */
const tabListener = () => {
    tabButtons.forEach(tab => {
        tab.addEventListener("click", stopTabs, true);
    });
};


const switchTab = (clickedTabButton, tabContentNumber) => {
    if (!(clickedTabButton.dataset.status === "active")) {
        activeSwitchTab.removeAttribute("data-status");
        activeSwitchTab = clickedTabButton;
        activeSwitchTab.dataset.status = "active";
        activeTabContentItem.dataset.animation = "fadeout";
        setTimeout(() => {
            activeTabContentItem.removeAttribute("data-animation");
            activeTabContentItem.removeAttribute("data-status");
            tabContentItems[tabContentNumber].dataset.status = "active";
            activeTabContentItem = tabContentItems[tabContentNumber];
        }, 150)
    }
};


const changeTabs = () => {
    let tabCounter = 0;
    let interval = setInterval(() => {
        if (pauseTabs) {
            clearInterval(interval);
        } else {
            if (tabCounter < tabContentItems.length - 1 && tabCounter !== 3) {
                tabCounter++;
            } else if (tabCounter === 3) {
                showMoreServices();
                tabCounter++;
            } else {
                showMoreServices();
                tabCounter = 0;
            }
            switchTab(tabButtons[tabCounter], tabCounter);
        }
    }, 10000);
};

const setupTabs = () => {
    changeTabs();
    tabListener();
};


/*====================================================================
                         INTERSECTION OBSERVER
====================================================================*/


let observer3 = new IntersectionObserver(observable => {
        if (observable[0].intersectionRatio > 0) {
            observable[0].target.classList.add("animate");
        } else {
            observable[0].target.classList.remove("animate");
        }
    }
);

let observeAnimate = document.querySelector(".mobile");
observer3.observe(observeAnimate);


const geth2root = () => {
    if (document.documentElement.clientWidth < 992) {
        return "1px";
    } else if (document.documentElement.clientWidth < 1367) {
        return -(Math.floor(window.innerHeight / 10).toString()) + "px";
    } else {
        return -(Math.floor(window.innerHeight / 5).toString()) + "px";
    }
};

let h2root = geth2root();


let observer = new IntersectionObserver(observables => {
    observables.forEach(observable => {
        if (observable.intersectionRatio > 0.5) {
            if (observable.target.classList.contains("delay")) {
                let delayItems = observable.target.getElementsByClassName("delay__item");
                let delayItemsLength = delayItems.length;
                for (let i = 0; i < delayItemsLength; i++) {
                    setTimeout(function () {
                        delayItems[i].classList.remove('not-visible');
                    }, 180 * i)
                }
                observer.unobserve(observable.target);
                if (observable.target.classList.contains("tab-switch")) {
                    // observable.target.classList.remove("tab-switch");
                    changeTabs();
                    tabListener();
                }
            } else {
                observable.target.classList.remove("observe");
                observer.unobserve(observable.target);
            }

        }
    })
}, {
    rootMargin: h2root,
    threshold: [0.5]
});

let underlineElements = document.querySelectorAll(".observe");
underlineElements.forEach(element => {
    observer.observe(element);
});


/********************************************
 Process intersection observer
 *********************************************/

let numSteps2 = 1.0;
let prevRatioProcess = [0, 0, 0, 0];

/*start*/
let processItems = document.querySelectorAll(".process__item");
let setOpacity = "ratio";
let processLeftItem = document.querySelectorAll(".process-left__container__item");
let prevScrollPos = 0;
let currentScrollPos = 0;

function handleIntersectProcess(observables, options2) {
    currentScrollPos = window.scrollY;
    observables.forEach(observable => {
        if (observable.intersectionRatio <= 0.90) {
            observable.target.style.opacity = setOpacity.replace("ratio", 0.2);  //set minimum opacity
        } else if (observable.intersectionRatio > 0.90 && observable.intersectionRatio < 0.95) {
            observable.target.style.opacity = setOpacity.replace("ratio", 1);
        } else {
            observable.target.style.opacity = setOpacity.replace("ratio", 1);
            observable.target.style.transform = "translateX(0)";
            if (observable.intersectionRatio >= prevRatioProcess[observable.target.dataset.content]) {
                observable.target.querySelector(".animated-svg").classList.remove("d-none");
                if (currentScrollPos > prevScrollPos && observable.target.dataset.content > 0) {
                    let currentProcessItem = processLeftItem[(parseFloat(observable.target.dataset.content) - 1)];
                    currentProcessItem.classList.add("fadeout");
                    setTimeout(() => {
                        currentProcessItem.classList.remove("fadeout");
                        currentProcessItem.classList.add("d-none");
                    }, 200)
                } else {
                    if (observable.target.dataset.content < 3) {
                        let currentProcessItem = processLeftItem[(parseFloat(observable.target.dataset.content) + 1)];
                        currentProcessItem.classList.add("fadeout");
                        setTimeout(() => {
                            currentProcessItem.classList.remove("fadeout");
                            currentProcessItem.classList.add("d-none");
                        }, 200)
                    }
                }
                processLeftItem[observable.target.dataset.content].classList.remove("d-none");
            }
        }
        prevRatioProcess[observable.target.dataset.content] = observable.intersectionRatio;
    });
    prevScrollPos = currentScrollPos;
}

const calcRootMargin = () => {
    if (document.documentElement.clientWidth < 1440) {
        return "-160px 0px -160px 0px";
    } else {
        return "-260px 0px -260px 0px";
    }
};

function buildThresholdList2() {
    let thresholds = [];
    for (let i = 0.1; i <= numSteps2; i += 0.05) {
        let ratio = i / numSteps2;
        thresholds.push(ratio);
    }
    thresholds.push(0);
    return thresholds;
}

function createObserverX() {
    let observer3;
    let options2 = {
        root: null,
        rootMargin: calcRootMargin(),
        threshold: buildThresholdList2()
    };
    observer3 = new IntersectionObserver(handleIntersectProcess, options2);
    processItems.forEach(observable => {
        observer3.observe(observable);
    })
}

createObserverX();

/**********************************************
 END Process intersection observer
 **********************************************/

/**********************************************
 Agency left onscroll behavior
 **********************************************/

let boxElement;

window.addEventListener("load", function (event) {
    boxElement = document.querySelector(".agency__left");
    createObserver();
}, true);

function createObserver() {
    let observer2;

    let options = {
        root: null,
        // rootMargin: "50px",
        rootMargin: "100px",
        threshold: buildThresholdList()
    };
    observer2 = new IntersectionObserver(handleIntersect, options);
    observer2.observe(boxElement);
}


let numSteps = 20.0;

function buildThresholdList() {
    let thresholds = [];

    for (let i = 1.0; i <= 10; i++) {
        let ratio = i / 10;
        thresholds.push(ratio);
    }
    thresholds.push(0);
    return thresholds;
}

let prevRatio = 0.0;
let translateValue = "translateY(ratio)";
let ratioMultiply = 80; // by what value numSteps has to be multiplied

function handleIntersect(entries, observer2) {
    currentScrollPos = window.scrollY;
    entries.forEach(function (entry) {
        if (currentScrollPos > prevScrollPos) {
            if (entry.intersectionRatio > prevRatio) {
                entry.target.style.transform = translateValue.replace("ratio", -entry.intersectionRatio * ratioMultiply + "px");
            } else {
                entry.target.style.transform = translateValue.replace("ratio", -(ratioMultiply + (1 - entry.intersectionRatio) * ratioMultiply) + "px");
            }
        } else if (currentScrollPos < prevScrollPos) {
            if (entry.intersectionRatio > prevRatio) {
                entry.target.style.transform = translateValue.replace("ratio", -(ratioMultiply + (1 - entry.intersectionRatio) * ratioMultiply) + "px");
            } else {
                entry.target.style.transform = translateValue.replace("ratio", -entry.intersectionRatio * ratioMultiply + "px");
            }
        }
        prevRatio = entry.intersectionRatio;
    });
    prevScrollPos = currentScrollPos;
}

/** LAZY LOADING USING INTERSECTION OBSERVER **/

let lazyObserver = new IntersectionObserver(observables => {
        observables.forEach(observable => {
            if (observable.intersectionRatio > 0) {
                let imgEl = observable.target.getElementsByTagName("img");
                if (imgEl) {
                    for (let i = 0; i < imgEl.length; i++) {
                        imgEl[i].setAttribute("src", imgEl[i].dataset.src);
                    }
                }
                let elements = observable.target.getElementsByTagName("source");
                if (elements) {
                    for (let i = 0; i < elements.length; i++) {
                        elements[i].setAttribute("srcset", elements[i].getAttribute("data-srcset"));
                    }
                }
                if (!elements && !imgEl) {
                    let iframeEl = observable.target.getElementsByTagName("iframe");
                    if (iframeEl) {
                        iframeEl[0].setAttribute("src", iframeEl[0].dataset.src);
                    }
                }
                observable.target.classList.remove("not-visible");
                lazyObserver.unobserve(observable.target);
            }
        })
    }, {
        rootMargin: "250px",
        threshold: [0.1]
    }
);

let lazyElements = document.querySelectorAll(".lazy");
lazyElements.forEach(element => {
    element.classList.add("not-visible");
    lazyObserver.observe(element);
});


/**********************************************
 END Agency left onscroll behavior
 **********************************************/

function _(selector) {
    return document.querySelector(selector);
}

// var form = document.querySelector('#contact-form');

const submitForm = () => {
    _("#contact-form button").disabled = true;
    let formdata = new FormData();
    formdata.append("name", _(".name").value);
    formdata.append("email", _(".email").value);
    formdata.append("message", _(".message").value);

    let ajax = new XMLHttpRequest();
    ajax.open("POST", "contact-handler.php");
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4 && ajax.status === 200) {
            if (ajax.responseText === "success") {
                _(".confirmation-text").innerHTML = 'Wiadomość wysłana';
            } else {
                _(".confirmation-text").innerHTML = ajax.responseText;
                _("#contact-form button").disabled = false;
            }
        }
    };
    ajax.send(formdata);
};


(function () {
    if (document.documentElement.clientWidth < 769) {
        const element = document.getElementById('mySwipe');
        window.mySwipe = new Swipe(element, {
            startSlide: 0,
            auto: 7000,
            draggable: true,
            autoRestart: false,
            continuous: false,
            disableScroll: true,
            stopPropagation: true,
            callback: function (index, element) {
            },
            transitionEnd: function (index, element) {
            }
        });
    }
}());


// var name = document.querySelector('.name').value;
// var email = document.querySelector('.email').value;
// var message = document.querySelector('.message').value;
//
// var data = JSON.stringify(
//     {
//         name:name,
//         email:email,
//         message:message
//     }
// );
//
//
// var request = new XMLHttpRequest();
// request.open('POST', 'contact-handler.php', true);
// request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
// request.send(data);
