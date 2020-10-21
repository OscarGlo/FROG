window.addEventListener("load", () => {
    document.querySelectorAll("#text p").forEach(p => {
        p.innerHTML = "<span>" +
            p.innerHTML.replaceAll(/(?<!^\s*)\n(?!\s*$)/g, "</span>\n<span>")
            + "</span>";
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
});