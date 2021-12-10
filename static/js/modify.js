function addLine() {
    let line = document.getElementById('templine').cloneNode(true);
    let list = document.getElementById('relist');
    line.style.display = 'table-row';
    list.appendChild(line);
    changeIndex();
}

function delLine(n) {
    let list = document.getElementById('relist');
    let line = n.parentNode.parentNode;
    list.removeChild(line);
    changeIndex();
}

function changeIndex() {
    let list = document.getElementById('relist');
    let lines = list.getElementsByTagName("tr");
    for (let i = 0; i <= lines.length; i++) {
        let line = lines[i];
        let index = line.getElementsByTagName("td");
        index = index[0];
        index.innerText = i;
    }
}