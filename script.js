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
        p.innerHTML = p.innerHTML.replace(/(?<=\s*)([a-zéèàêî'-]+)(?=\s*)/gi, "<span class='word'>$1</span>");
        p.innerHTML = p.innerHTML.replace(/\s*(.+)\s*/gi, "<span class='unit'>$1</span>\n");
    });

    let text = document.getElementById("text");

    document.querySelectorAll("#menu .material-icons").forEach(icon => {
        icon.addEventListener("click", () => {
            let spans = icon.querySelectorAll(":scope > span");

            let toggleClass = [...icon.classList].find(c => c.startsWith("toggle")),
                i = parseInt(toggleClass.substr(6)),
                j = i % spans.length + 1;
            icon.classList.remove(toggleClass);
            icon.classList.add(`toggle${j}`);

            let getClass = n => spans[n - 1].getAttribute("data-class");
            let remClass = getClass(i), addClass = getClass(j);
            if (remClass != null) text.classList.remove(remClass);
            if (addClass != null) text.classList.add(addClass);
        });
    });

    text.addEventListener("scroll", evt => {
        let contHeight = document.getElementById("text-container").clientHeight;
        document.getElementById("gradient-start").style.opacity = "" + Math.min(text.scrollTop / 20, 1);
        document.getElementById("gradient-end").style.opacity = "" + Math.min((text.scrollHeight - contHeight - text.scrollTop + 20) / 20, 1);
    });

    let contextMenu = document.getElementById("contextMenu");

    let selected = null, selectedAt = 0;

    document.querySelectorAll("#text .word").forEach(span => {
        span.addEventListener("click", evt => {
            evt.stopPropagation();

            if (selected != null)
                selected.classList.remove("selected");

            if (Date.now() - selectedAt < 800 || selected === span || selected === span.parentNode) {
                selected = (selected === span ? span.parentNode : span);
            } else {
                selected = (selected === span || selected === span.parentNode ? (selected == null ? span : null) : span);
            }

            contextMenu.style.display = selected != null ? "" : "none";

            if (selected != null) {
                contextMenu.offsetTop = selected.offsetTop;
                contextMenu.offsetLeft = selected.offsetLeft;
                selected.classList.add("selected");
                selectedAt = Date.now();
            } else {
                selectedAt = 0;
            }
        });
    });

    text.addEventListener("click", () => {
        if (selected != null) {
            selected.classList.remove("selected");
            selected = null;
        }
    });
});