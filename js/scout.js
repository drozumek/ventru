window.addEventListener("DOMContentLoaded", function() {
    const addAnimation = function(entry) {
        if (entry.classList.contains("scout-container")) {
            let scoutItems = entry.getElementsByClassName("scout-item");
            if (entry.hasAttribute("data-scout-delay")) {
                let delayTimer = entry.getAttribute("data-scout-delay");
                for (let i = 0; i < scoutItems.length; i++) {
                    setTimeout( function() {
                        scoutItems[i].setAttribute("data-animation", "animate");  //jesli nadaje elementom na poczatku animacje to wylaczamy ten wiersz, opieramy sie tylko na JS
                        // scoutItems[i].style.transform = "translate(0,0)";
                    }, delayTimer * i);
                }
            } else {
                for (let j = 0; j < scoutItems.length; j++) {
                    if (scoutItems[j].hasAttribute("data-scout-delay")) {

                        setTimeout( function() {
                            scoutItems[j].setAttribute("data-animation", "animate");
                        }, scoutItems[j].getAttribute("data-scout-delay"));
                    } else {
                        scoutItems[j].setAttribute("data-animation", "animate"); //jesli nadaje elementom na poczatku animacje to wylaczamy ten wiersz, opieramy sie tylko na JS

                        // scoutItems[i].style.transform = "translate(0,0)";
                    }
                }
            }
        } else {
            // entry.style.transform = "translate(0,0)";
            entry.setAttribute("data-animation", "animate"); //jesli nadaje elementom na poczatku animacje to wylaczamy ten wiersz, opieramy sie tylko na JS
        }
        if (entry.hasAttribute("data-scout-script")) {
            let scriptName = entry.getAttribute("data-scout-script");
            eval(scriptName);
        }
        // animationObserver.unobserve(entry);
    };

    const animationObserver = new IntersectionObserver ( function(entries) {
        entries.forEach( function(entry) {
            if (entry.intersectionRatio >= entry.target.getAttribute("data-intersection-ratio")) {
                addAnimation(entry.target);
                animationObserver.unobserve(entry.target);
            }

            // if (entry.isIntersecting) {
            //     if (entry.intersectionRatio >= 0.25 && elClassList.contains("scout-25")) {
            //         addAnimation(entry.target);
            //     } else if (entry.intersectionRatio >= 0.45 && elClassList.contains("scout-50")) {
            //         addAnimation(entry.target);
            //     } else if (entry.intersectionRatio >= 0.65 && elClassList.contains("scout-75")) {
            //         addAnimation(entry.target);
            //     } else if (entry.intersectionRatio >= 0.95 && elClassList.contains("scout-100")) {
            //         addAnimation(entry.target);
            //     } else if (entry.intersectionRatio >= 0.50) {
            //         if ((!(/scout-.[0-9]+/.test(elClassList)))) {
            //             addAnimation(entry.target);
            //         }
            //     }
            // }
        })
    }, {
        rootMargin: "50px",
        threshold: [0.2, 0.4, 0.5, 0.6, 0.9, 1]
        // threshold: [0.25, 0.5, 0.75, 1]
    });

    const getDirection = function getDirection(element, distance) {
        let direction;
        let classes = element.classList; // recudes number of queries?
        if (classes.contains("direction-right")) {
            direction = "translateX(-" + distance + "px)";
        } else if (classes.contains("direction-left")) {
            direction = "translateX(" + distance + "px)";
        } else if (classes.contains("direction-up")) {
            direction = "translateY(" + distance + "px)";
        } else {
            direction = "translateY(-" + distance + "px)";
        }
        return direction;
    };
// var scoutTransition = "transform .3s cubic-bezier(0.4, 0.0, 0.2, 1)"; // nadajemy parametry przejscia
    const animationElements = [].slice.call(document.getElementsByClassName("scout"));
    const defaultDistance = "70";
    for (let i = 0; i < animationElements.length; i++) {
        if (animationElements[i].classList.contains("scout-container")) {  // jesli jest kontenerem
            let scoutItems = animationElements[i].getElementsByClassName("scout-item");  // pobiera itemy kontenera
            if (/direction-.*/.test(animationElements[i].classList)) {   // jesli jest kontenerem i posiada kierunek

                let getDistance;
                if (animationElements[i].hasAttribute("data-scout-distance")) {    // jesli kontener posiada dystans to go pobierz
                    getDistance = animationElements[i].getAttribute("data-scout-distance");
                } else {                                                                        // w przeciwnym razie ustaw kontenerowi domyslny dystans (bo posiada kierunek)
                    getDistance = defaultDistance;
                }
                let distanceAndDirection = getDirection(animationElements[i], getDistance);  // pobiera dystans i kierunek dla itemów

                // TO MOZE SIE POWTARZAC
                for (let j = 0; j < scoutItems.length; j++) {
                    let itemHasDirection = /direction-.*/.test(scoutItems[j].classList);
                    let itemHasDistance = scoutItems[j].hasAttribute("data-scout-distance");
                    // scoutItems[j].style.transition = scoutTransition; //nadajemy itemom parametry przejscia (nie korzystamy z CSS)
                    if (!(itemHasDirection || itemHasDistance)) { //jesli poszczegolne itemy nie posiadaja wlasnego kierunku ani dysa
                        scoutItems[j].style.transform = distanceAndDirection;
                    } else if (!itemHasDistance && itemHasDirection) {  // item posiada tylko kierunek i nie posiada dystansu
                        scoutItems[j].style.transform = getDirection(scoutItems[j], getDistance); //jako argument idzie zmienna do ktorej przypisany jest dystans kontenera
                    } else if (itemHasDistance && !itemHasDirection) { // item posiada tylko dystans i nie posiada kierunku
                        scoutItems[j].style.transform = distanceAndDirection.replace(/[0-9]+/,scoutItems[j].getAttribute("data-scout-distance"));
                        //podmienia cyfry (dystans), zostawia kierunek
                    } else {
                        scoutItems[j].style.transform = getDirection(scoutItems[j], scoutItems[j].getAttribute("data-scout-distance"));
                    }
                }
                // TO MOZE SIE POWTARZAC END
            } else {  // jesli jest kontenerem i nie posiada kierunku (ani dystansu)
                for (let j = 0; j < scoutItems.length; j++) {
                    let itemHasDirection = /direction-.*/.test(scoutItems[j].classList);
                    let itemHasDistance = scoutItems[j].hasAttribute("data-scout-distance");
                    // scoutItems[j].style.transition = scoutTransition; //nadajemy itemom parametry przejscia (nie korzystamy z CSS)
                    if (itemHasDistance && itemHasDirection) { // item posiada kierunek i dystans
                        scoutItems[j].style.transform = getDirection(scoutItems[j], scoutItems[j].getAttribute("data-scout-distance"));
                    } else if (!itemHasDistance && itemHasDirection) {  // item posiada tylko kierunek i nie posiada dystansu
                        scoutItems[j].style.transform = getDirection(scoutItems[j], defaultDistance); //jako argument idzie zmienna do ktorej przypisany jest dystans kontenera
                    }
                }
            }
        } else {  //jesli nie jest kontenerem ani itemem
            if (/direction-.*/.test(animationElements[i].classList)) {   // jesli nie jest kontenerem i posiada kierunek
                let getDistance;
                if (animationElements[i].hasAttribute("data-scout-distance")) {    // jesli element posiada dystans to go pobierz
                    getDistance = animationElements[i].getAttribute("data-scout-distance");
                } else {                                                                        // w przeciwnym razie ustaw kontenerowi domyslny dystans (bo posiada kierunek)
                    getDistance = defaultDistance;
                }
                animationElements[i].style.transform = getDirection(animationElements[i], getDistance);
            } else { // jesli nie jest kontenerem i nie posiada kierunku (wykona sie tylko efekt fade in)
            }
        }
        // sprawdza intersection ratio w klasach i ustawia je jako data- dla szybszego dzialania programu w intersection obserwerze
        let scoutRatio = animationElements[i].classList.value.match(/(scout-)\d+/);  // sprawdza czy znajduje sie klasa o wzorze scout-[liczba]
        //  (scoutRatio !== "sccout-100" && scoutRatio !== null,undefined) {  // jesli tak to: // mozna dac  taki warunek jak ktos poda scout-100
        if (scoutRatio) {  // jesli tak to
            scoutRatio = parseFloat("0." + scoutRatio[0].match(/[0-9]+/)[0]);  // zamienia string z tej klasy na liczbe i przypisuje do zmiennej
        } else {
            scoutRatio = 1;  // GDY ELEMENT NIE MA SCOUT-[LICZBA] wtedy domyslne intersection ratio dla tego elementu wynosi 1
        }
        animationElements[i].setAttribute("data-intersection-ratio", scoutRatio);
        animationObserver.observe(animationElements[i]);
    }
});