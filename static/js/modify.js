function addLine() {
    let line = document.getElementById('templine').cloneNode(true);
    let list = document.getElementById('relist');
    line.style.display = 'table-row' ;
    list.appendChild(line);
}

function delLine(n) {
    let list = document.getElementById('relist');
    let line = n.parentNode.parentNode;
    list.removeChild(line);
}
