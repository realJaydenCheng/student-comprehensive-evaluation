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
    for (let i = 0; i <= lines.length - 1; i++) {
        let line = lines[i];
        let index = line.getElementsByTagName("td");
        index = index[0];
        index.innerText = i;
    }
}

function beforeModify() {
    if (beforeLogin()) {
        var rewards = document.getElementById("rewards");
        var idTxt = '';
        var valueTxt = '';
        var noteTxt = '';
        let rewardList = document.getElementById('relist');
        rewardList = rewardList.getElementsByTagName('tr');
        for (let i = 1; i <= rewardList.length - 1; i++) {
            let reward = rewardList[i];
            reward = reward.getElementsByTagName('td');
            if (i == rewardList.length - 1) {
                idTxt = idTxt + reward[0].innerText;
                valueTxt = valueTxt + reward[1].getElementsByTagName('input')[0].value;
                noteTxt = noteTxt + reward[2].getElementsByTagName('input')[0].value;
            }
            else{
                idTxt = idTxt + reward[0].innerText + "|next_item_is|";
                valueTxt = valueTxt + reward[1].getElementsByTagName('input')[0].value + "|next_item_is|";
                noteTxt = noteTxt + reward[2].getElementsByTagName('input')[0].value + "|next_item_is|";
            }
        }
        rewards.value = idTxt + "/*a_new_line*/" + valueTxt + "/*a_new_line*/" + noteTxt;
        return true;
    }
    else { return false; }
}