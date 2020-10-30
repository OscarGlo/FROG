String.prototype.searchLast = function (searcher) {
    let index = -1, next = -1;
    do {
        index += next + 1;
        next = this.substr(index + 1).search(searcher);
    } while (next !== -1);
    return index;
};

window.addEventListener("load", () => {
    document.querySelectorAll("#text p").forEach(p => {
        p.innerHTML = p.innerHTML.replace(/(?<=\s*)([a-zéèàêîû'-]+)(?=\s*)/gi, "<span class='word'>$1</span>");
        p.innerHTML = p.innerHTML.replace(/\s*(.+)\s*/gi, "<span class='unit'>$1</span>\n");
    });

    let text = document.getElementById("text"),
        defBox = document.getElementById("definition-box"),
        container = document.getElementById("container"),
        close = document.getElementById("close"),
        contextMenu = document.getElementById("contextMenu"),
        coloring = document.getElementById("coloring");

    let maskOn = false;

    document.querySelectorAll("#menu .material-icons").forEach(icon => {
        icon.addEventListener("click", () => {
            let spans = icon.querySelectorAll(":scope > span");

            let toggleClass = [...icon.classList].find(c => c.startsWith("toggle")),
                i = parseInt(toggleClass.substr(6)),
                j = i % spans.length + 1;

            let getClass = n => spans[n - 1].getAttribute("data-class");

            if (maskOn && getClass(j) === "alternate")
                j = 1;

            icon.classList.replace(toggleClass, `toggle${j}`);

            let remClass = getClass(i), addClass = getClass(j);
            if (remClass != null) text.classList.remove(remClass);
            if (addClass != null) text.classList.add(addClass);
        });
    });

    text.addEventListener("scroll", evt => {
        hideDef();

        let contHeight = document.getElementById("text-container").clientHeight;
        document.getElementById("gradient-start").style.opacity = "" + Math.min(text.scrollTop / 20, 1);
        document.getElementById("gradient-end").style.opacity = "" + Math.min((text.scrollHeight - contHeight - text.scrollTop + 20) / 20, 1);
    });

    let selected = null, selectedAt = 0, maskFocus = null;

    function unselect() {
        if (selected != null) {
            contextMenu.style.display = "none";
            selected.classList.remove("selected");
            selected = null;
        }
    }

    function hideDef() {
        defBox.style.display = "none";
    }

    document.querySelectorAll("#text .word").forEach(span => {
        span.addEventListener("click", evt => {
            evt.stopPropagation();

            if (maskOn) {
                if (span.parentNode !== maskFocus) {
                    maskFocus.classList.remove("maskFocus")
                    maskFocus = span.parentNode;
                    maskFocus.classList.add("maskFocus");
                }
            } else {
                hideDef();

                if (selected != null)
                    selected.classList.remove("selected");

                if (Date.now() - selectedAt < 800 && (selected === span || selected === span.parentNode)) {
                    selected = (selected === span ? span.parentNode : span);
                } else {
                    selected = (selected === span || selected === span.parentNode ? (selected == null ? span : null) : span);
                }

                contextMenu.style.display = selected != null ? "" : "none";

                if (selected != null) {
                    contextMenu.style.top = (selected.offsetTop + selected.getBoundingClientRect().height + 25 - text.scrollTop) + "px";
                    if (selected.classList.contains("word"))
                        contextMenu.style.left = Math.max(selected.offsetLeft - (contextMenu.clientWidth / 2), 0) + "px";
                    selected.classList.add("selected");
                    selectedAt = Date.now();
                } else {
                    selectedAt = 0;
                }
            }
        });
    });

    close.addEventListener("click", () => {
        if (maskOn) {
            close.style.display = "none";
            container.classList.remove("mask");
            maskFocus.classList.remove("maskFocus");
            maskFocus = null;
            maskOn = false;
        }
    })

    text.addEventListener("click", () => {
        unselect();
        hideDef();
    });

    document.getElementById("speech").addEventListener("click", () => {
        if (selected != null) {
            window.speechSynthesis.cancel();
            let utter = new SpeechSynthesisUtterance(selected.innerText);
            utter.rate = 0.8;
            window.speechSynthesis.speak(utter);

            selected.classList.add("voice");
            (elt => {
                utter.onend = () => elt.classList.remove("voice");
            })(selected);

            unselect();
        }
    });

    document.getElementById("definition").addEventListener("click", () => {
        if (selected != null) {
            defBox.innerText = `Définition de "${selected.innerText}"`;
            defBox.style.display = "";
            defBox.style.top = contextMenu.style.top;
            defBox.style.left = (contextMenu.offsetLeft + contextMenu.clientWidth/2 - defBox.clientWidth/2) + "px";

            unselect();
        }
    });

    document.getElementById("masque").addEventListener("click", () => {
        if (selected != null) {
            maskOn = true;

            close.style.display = "";
            container.classList.add("mask");
            maskFocus = (selected.classList.contains("unit") ? selected : selected.parentNode)
            maskFocus.classList.add("maskFocus");

            if (text.classList.contains("alternate")) {
                text.classList.remove("alternate");
                coloring.classList.replace("toggle3", "toggle1");
            }

            unselect();
        }
    });
});