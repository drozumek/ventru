/*=============================
        PRELOADER
=============================*/

window.onload = () => {
    const headerEl = document.querySelector(".header-preloader");
    const preloader = document.querySelector(".preloader");
    preloader.style.animation = "speed .3s ease forwards";
    headerEl.style.display = "flex";
    setTimeout( () => {
        preloader.style.display = "none";
    }, 300)
};


/*=============================
    HIDING NAVBAR ON SCROLL
=============================*/



/*=============================
  LOAD CHAT AFTER 10 SECONDS
=============================*/

function loadChat() {
    setTimeout( () => {
        window.$crisp=[];window.CRISP_WEBSITE_ID="43426c74-7b60-4141-acc9-01fd4ce0bf62";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
    }, 10000)
}
loadChat();

/*=================================================================================
     AUTO CREATE SLIDER NAV BULLETS AND SET DATA-NUMBER ATTRIBUTE TO SLIDERS
=================================================================================*/

let sliders = document.querySelectorAll(".slide");
let navigationBullets;

( () => {
    for (let i = 0; i < sliders.length; i++) {
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
    setTimeout( () => {
        sliders[activeSlider].dataset.status = "unactive";
        sliders[activeSlider].classList.remove("not-visible");
        sliders[activeSlider + changeValue].dataset.status = "active";
    }, 300 );
    setActiveSlideBullet(activeSlider, changeValue);
};

const changeSlide = changeValue => {
    let activeSlider = parseFloat(document.querySelector(".slide[data-status='active']").dataset.number);
    if (activeSlider === 0  && changeValue === (-1)) {
        setActiveSlider(0, sliders.length-1);
    } else if  (activeSlider === sliders.length-1 && changeValue === (1) ) {
        setActiveSlider(sliders.length-1, -(sliders.length-1));
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
    let interval = setInterval( () => {
        pause ? clearInterval(interval) : changeSlide(1);
    }, 11000);
})();





// TODO zrobic tak, zeby slider 2 i 3 doczytaly sie po kilku sekundach, na ten czas zamrozic mozliwosc zmiany slajdow navigatorem,
// scroll into view smooth nie jest obslugiwany na wszystkich przegladarkah, polyfill https://github.com/iamdustan/smoothscroll
// removeListener pauzy ze slajdow hero image po kliknieciu (jak w tabach)


// let mobileViewport = window.matchMedia("screen and (max-width: 480px)");
//
// mobileViewport.addListener(function(mq) {
//     if(mq.matches) {
//         // viewport <= 480px
//     } else {
//         // viewport > 480px
//     }
// });






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
    tabButtons.forEach( tab => {
        tab.removeEventListener("click", stopTabs);
    });
};

/* invoked by intersection observer event */
const tabListener = () => {
    tabButtons.forEach( tab => {
        tab.addEventListener("click", stopTabs, true);
    });
};



const switchTab = (clickedTabButton, tabContentNumber) => {
    if (!(clickedTabButton.dataset.status === "active")) {
        activeSwitchTab.removeAttribute("data-status");
        activeSwitchTab = clickedTabButton;
        activeSwitchTab.dataset.status = "active";
        activeTabContentItem.dataset.animation ="fadeOut";
        setTimeout( () => {
            activeTabContentItem.removeAttribute("data-animation");
            activeTabContentItem.removeAttribute("data-status");
            tabContentItems[tabContentNumber].dataset.status = "active";
            activeTabContentItem = tabContentItems[tabContentNumber];
        }, 150)
    }
};


const changeTabs = () => {
    let tabCounter = 0;
    let interval = setInterval( () => {
        if (pauseTabs) {
            clearInterval(interval);
        } else {
            if (tabCounter < tabContentItems.length - 1 && tabCounter !== 3 ) {
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




// const changeTabs = () => {
//     let tabCounter = 0;
//     let interval = setInterval( () => {
//         tabCounter++;
//         if (pauseTabs) {
//             clearInterval(interval);
//         } else {
//             if (tabCounter < tabControl.length) {
//                 tabControl[tabCounter].checked = "true";
//             } else {
//                 tabControl[0].checked = "true";
//                 tabCounter = 0;
//             }
//         }
//     }, 7000)
// };


/*====================================================================
                         INTERSECTION OBSERVER
====================================================================*/

const geth2root = () => {
    if (document.documentElement.clientWidth < 992) {
        return "1px";
    } else if (document.documentElement.clientWidth < 1367) {
        return -(Math.floor(window.innerHeight/10).toString()) + "px";
    } else {
        return -(Math.floor(window.innerHeight/5).toString()) + "px";
    }
};

let h2root = geth2root();


let observer = new IntersectionObserver( observables => {
    observables.forEach( observable => {
        if (observable.intersectionRatio > 0.5) {
            if (observable.target.classList.contains("delay")) {
                let delayItems = observable.target.getElementsByClassName("delay__item");
                for (let i = 0; i < delayItems.length; i++) {
                    setTimeout(function() {
                        delayItems[i].classList.remove('not-visible');
                    }, 180 * i)
                }
                observer.unobserve(observable.target);
                if (observable.target.classList.contains("tab-switch")) {
                    // observable.target.classList.remove("tab-switch");
                    changeTabs();
                    tabListener();
                }
            }
            else {
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
underlineElements.forEach( element => {
    observer.observe(element);
});


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
    observables.forEach( observable => {
        console.log(observable.intersectionRatio);
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
                    currentProcessItem.classList.add("fadeOut");
                    setTimeout( () => {
                        currentProcessItem.classList.remove("fadeOut");
                        currentProcessItem.classList.add("d-none");
                    }, 10)
                } else {
                    if (observable.target.dataset.content < 3) {
                        let currentProcessItem = processLeftItem[(parseFloat(observable.target.dataset.content) + 1)];
                        currentProcessItem.classList.add("fadeOut");
                        setTimeout( () => {
                            currentProcessItem.classList.remove("fadeOut");
                            currentProcessItem.classList.add("d-none");
                        }, 10)
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

function createObserverX() {
    let observer3;

    let options2 = {
        root: null,
        rootMargin: calcRootMargin(),
        threshold: buildThresholdList2()
    };



    observer3 = new IntersectionObserver(handleIntersectProcess, options2);
    processItems.forEach( observable => {
        observer3.observe(observable);
    })
}



function buildThresholdList2() {
    let thresholds = [];

    for (let i=0.1; i<=numSteps2; i+=0.05) {
        let  ratio = i/numSteps2;
        thresholds.push(ratio);
    }
    thresholds.push(0);
    return thresholds;
}
createObserverX();






//
// function handleIntersectProcess(observables, options2) {
//     currentScrollPos = window.scrollY;
//     observables.forEach( observable => {
//         if (observable.intersectionRatio <= 0.15) {
//             observable.target.style.opacity = increasingOpacity.replace("ratio", 0.15);  //set minimum opacity
//         } else {
//             observable.target.style.opacity = increasingOpacity.replace("ratio", observable.intersectionRatio);
//         }
//         if (observable.intersectionRatio >= prevRatioProcess[observable.target.dataset.content]) {
//             if (observable.intersectionRatio > 0.95) {
//                 observable.target.querySelector(".animated-svg").classList.remove("d-none");
//                 if (currentScrollPos > prevScrollPos && observable.target.dataset.content > 0) {
//                     processLeftItem[parseFloat(observable.target.dataset.content) - 1].classList.add("d-none");
//                 } else {
//                     if (observable.target.dataset.content < 3) {
//                         processLeftItem[(parseFloat(observable.target.dataset.content) + 1)].classList.add("d-none");
//                     }
//                 }
//                 processLeftItem[observable.target.dataset.content].classList.remove("d-none");
//             }
//         } else {
//             observable.target.style.opacity = decreasingOpacity.replace("ratio", observable.intersectionRatio + 0.1);
//         }
//         prevRatioProcess[observable.target.dataset.content] = observable.intersectionRatio;
//     })
//     prevScrollPos = currentScrollPos;
// }












/*end*/

// Set things up.

let boxElement;

window.addEventListener("load", function(event) {
    boxElement = document.querySelector(".agency__left");
    createObserver();
}, true);

function createObserver() {
    let observer2;

    let options = {
        root: null,
        // rootMargin: "50px",
        rootMargin: "200px",
        threshold: buildThresholdList()
    };
    observer2 = new IntersectionObserver(handleIntersect, options);
    observer2.observe(boxElement);
}


let numSteps = 20.0;

function buildThresholdList() {
    let thresholds = [];

    for (let i=1.0; i<=10; i++) {
        let  ratio = i/10;
        thresholds.push(ratio);
    }
    thresholds.push(0);
    return thresholds;
}


// let translateValue = "translateY(ratio)";
// let initialScrollPos;
//
// function handleIntersect(entries, observer2) {
//     currentScrollPos = window.scrollY;
//     entries.forEach(function(entry) {
//         if (entry.intersectionRatio < 0.05) {
//             initialScrollPos = window.scrollY;
//         }
//         if (currentScrollPos < prevScrollPos && entry.intersectionRatio < 0.05) {
//             setTimeout( () => {
//                 entry.target.style.transform = translateValue.replace("ratio", (200 + (currentScrollPos - initialScrollPos)/20) + "px");
//             }, 10);
//         } else {
//             setTimeout( () => {
//                 entry.target.style.transform = translateValue.replace("ratio", (currentScrollPos - initialScrollPos)/20 + "px");
//             }, 10);
//         }
//     });
//     prevScrollPos = currentScrollPos;
// }

let prevRatio = 0.0;
let translateValue = "translateY(ratio)";
let ratioMultiply = 80; // by what value numSteps has to be multiplied

function handleIntersect(entries, observer2) {
    currentScrollPos = window.scrollY;
    entries.forEach(function(entry) {
        if (currentScrollPos > prevScrollPos) {
            if (entry.intersectionRatio > prevRatio) {
                entry.target.style.transform = translateValue.replace("ratio", -entry.intersectionRatio*ratioMultiply + "px");
            } else {
                entry.target.style.transform = translateValue.replace("ratio", -(ratioMultiply + (1 - entry.intersectionRatio)*ratioMultiply) + "px");
            }
        } else if (currentScrollPos < prevScrollPos) {
            if (entry.intersectionRatio > prevRatio) {
                entry.target.style.transform = translateValue.replace("ratio", -(ratioMultiply + (1 - entry.intersectionRatio)*ratioMultiply) + "px");
            } else {
                entry.target.style.transform = translateValue.replace("ratio", -entry.intersectionRatio*ratioMultiply + "px");
            }
        }
        prevRatio = entry.intersectionRatio;
    });
    prevScrollPos = currentScrollPos;
}








































//
//
// window.load = () => {
//     document.querySelector("header").style.display = "flex";
// };
//
//
// let navNumbers = document.querySelectorAll(".nav-numbers"); // Navigation numbers (near prev next buttons)
// navNumbers[0].dataset.status = "active";
//
// let licznik = 0; // current navigation number active
//
// const setActiveSlideNumber = () => {
//     if (licznik < navNumbers.length - 1) {
//         navNumbers[licznik].removeAttribute("data-status");
//         licznik++;
//         navNumbers[licznik].dataset.status = "active";
//     } else {
//         navNumbers[licznik].removeAttribute("data-status");
//         licznik = 0;
//         navNumbers[licznik].dataset.status = "active";
//     }
// };
//
// const getActiveSlide = () => {
//     let activeSlider = document.querySelector(".slide[data-status='active']");
//     return activeSlider;
// };
//
// const nextSlide = (activeSlide) => {
//
//     let unactiveSlider = document.querySelector(".slide[data-status='unactive']");
//
//     // navNumbers.forEach( (number) => {
//     //     number.dataset.status ? number.removeAttribute("data-status") : number.dataset.status = "active";
//     // });
//     //
//
//     setActiveSlideNumber();
//
//     activeSlide.classList.add("not-visible");
//
//     setTimeout( () => {
//         activeSlide.dataset.status = "unactive";
//         activeSlide.classList.remove("not-visible");
//         unactiveSlider.dataset.status = "active";
//     }, 300 );
// };
//
// let pause = false;
//
// let pauseSlider = () => {
//     pause = true;
// };
//
// // Stops slider autoplay
// (() => {
//     let interval = setInterval( () => {
//         pause ? clearInterval(interval) : nextSlide();
//     }, 11000);
// })();
