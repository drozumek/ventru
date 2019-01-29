window.addEventListener("DOMContentLoaded", function () {
    var lazyObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var observableElement = entry.target;
                if (observableElement.tagName === "PICTURE") {
                    var pictureElement = observableElement;
                    pictureElement.setAttribute("data-lazy", "show");
                    var imgElement = pictureElement.getElementsByTagName("img")[0];
                    imgElement.setAttribute("src", imgElement.getAttribute("data-src"));
                    var sourceElements = pictureElement.getElementsByTagName("source");
                    for (var i = 0; i < sourceElements.length; i++) {
                        sourceElements[i].setAttribute("srcset", sourceElements[i].getAttribute("data-srcset"));
                    }
                } else {
                    observableElement.src = observableElement.getAttribute("data-src");
                    observableElement.setAttribute("data-lazy", "show");
                }
                lazyObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: "600px",
        threshold: [0, 0.5]
    });
//DOMContentLoaded
    var lazyElements = [].slice.call(document.querySelectorAll("picture, img, iframe, video"));
    lazyElements.forEach(function (element) {
        if (element.tagName === "PICTURE" && element.classList.contains("not-lazy")) {
            element.getElementsByTagName("img")[0].classList.add("not-lazy");
        } else if (!element.classList.contains("not-lazy")) {
            element.classList.add("lazy");
            if (element.tagName === "PICTURE") {
                // jesli JEST picture
                var imgElement = element.getElementsByTagName("img")[0];
                imgElement.setAttribute("data-src", imgElement.getAttribute("src"));
                imgElement.setAttribute("src", "https://via.placeholder.com/350C");
                imgElement.classList.add("not-lazy", "to-show");
                var sourceElements = element.getElementsByTagName("source");
                for (var i = 0; i < sourceElements.length; i++) {
                    sourceElements[i].setAttribute("data-srcset", sourceElements[i].srcset);
                    sourceElements[i].setAttribute("srcset", "https://via.placeholder.com/350C");
                }
            } else {
                // jesli NIE JEST picture
                element.setAttribute("data-src", element.src);
                element.setAttribute("src", "https://via.placeholder.com/350C"); //inaczej wysokosc bedzie wynosila 0
            }
            lazyObserver.observe(element);
        }
    });
});
