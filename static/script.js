const canvas = document.getElementById('canvas');
const view = document.getElementById('viewport');
const obj = document.getElementById('mi-arbol');
let scale = 1;

function centrarInicio() {
    view.scrollLeft = (view.scrollWidth - view.clientWidth) / 2;
    view.scrollTop = 0;
}

window.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
        e.preventDefault();
        if (e.deltaY < 0) scale *= 1.15;
        else scale /= 1.15;
        scale = Math.min(Math.max(0.1, scale), 30);
        canvas.style.transform = `scale(${scale})`;
    }
}, { passive: false });

obj.addEventListener('load', () => {
    setTimeout(centrarInicio, 500);

    try {
        const svgDoc = obj.contentDocument;
        if (!svgDoc) return;

        const style = svgDoc.createElementNS("http://w3.org", "style");
        style.textContent = `
            a, a * { 
                text-decoration: none !important; 
                outline: none !important; 
                cursor: pointer !important;
                -webkit-user-select: none;
                user-select: none;
            }
            a:visited text, a:visited tspan, a:active text, a:active tspan {
                fill: inherit !important;
            }
        `;
        svgDoc.documentElement.appendChild(style);

        const links = svgDoc.querySelectorAll('a');
        links.forEach(link => {
            const hijos = link.querySelectorAll('text, tspan');

            hijos.forEach(h => {
                const col = window.getComputedStyle(h).fill;
                h.setAttribute('data-original-color', col);
                h.style.fill = col;
            });

            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const url = link.getAttribute('xlink:href') || link.getAttribute('href');
                if (url) window.open(url, '_blank');

                setTimeout(() => {
                    if (document.activeElement) document.activeElement.blur();
                    hijos.forEach(h => {
                        h.style.fill = h.getAttribute('data-original-color');
                    });
                }, 100);
            });
        });

    } catch (e) { console.error("Error:", e); }
});
