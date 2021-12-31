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

function addLine() {
    let line = document.getElementById('templine').cloneNode(true);
    let list = document.getElementById('relist');
    let inputs = line.getElementsByTagName('input');
    let num = inputs[0];
    let txt = inputs[1];
    num.required = true;
    txt.required = true;
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

function checkNum(elem, low, heigh) {
    let tip = elem.parentNode.parentNode.getElementsByClassName("tip")[0];
    if ((elem.value >= low) && (elem.value <= heigh) && (elem.value != "")) {
        tip.style.color = 'rgb(128,128,128)';
        return true;
    }
    else {
        tip.style.color = 'red';
        return false;
    }
}

function beforeModify() {
    if (beforeLogin()) {
        let pwd = document.getElementById('pwdtxt');
        let isOk = true;
        let infos = document.getElementsByClassName('infoinput');
        for (let i = 0; i < infos.length; i++) {
            if ((i == 6) || (i == 8)) { continue; }
            let info = infos[i];
            if (!checkInfo(info)) {
                isOk = false;
                break;
            }
        }
        if (!isOk) {
            window.alert("请检查标红处的数据是否填写错误。");
            pwd.value = '';
            return false;
        }

        let job = document.getElementById("jobtxt");
        if (!checkJob(job)) {
            window.alert("请检查标红处的数据是否填写错误。");
            pwd.value = ''; return false;
        }

        let mor = document.getElementById("mortxt");
        let gpa = document.getElementById("gpatxt");
        let c1 = document.getElementById("c1");
        let my = document.getElementById("mytxt");
        let ld = document.getElementById("ldtxt");
        let dis = document.getElementById("distxt");
        let low = document.getElementById("low");
        let cre = document.getElementById("cretxt");
        if (!checkNum(mor, 3.2, 15)) {
            window.alert("请检查标红处的数据是否填写错误。");
            pwd.value = ''; return false;
        }
        if (!checkNum(gpa, 0, 5)) {
            window.alert("请检查标红处的数据是否填写错误。");
            pwd.value = ''; return false;
        }
        if (!checkNum(c1, 0, 100)) {
            window.alert("请检查标红处的数据是否填写错误。");
            pwd.value = ''; return false;
        }
        if (!checkNum(my, 1.4, 5)) {
            window.alert("请检查标红处的数据是否填写错误。");
            pwd.value = ''; return false;
        }
        if (!checkNum(ld, 1.4, 5)) {
            window.alert("请检查标红处的数据是否填写错误。");
            pwd.value = ''; return false;
        }
        if (!checkNum(dis, 0, 10)) {
            window.alert("请检查标红处的数据是否填写错误。");
            pwd.value = ''; return false;
        }
        if (!checkNum(low, 0, gpa.value)) {
            window.alert("请检查标红处的数据是否填写错误。");
            pwd.value = ''; return false;
        }
        if (!checkNum(cre, 20, 80)) {
            window.alert("请检查标红处的数据是否填写错误。");
            pwd.value = ''; return false;
        }

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
            else {
                idTxt = idTxt + reward[0].innerText + "|next_item_is|";
                valueTxt = valueTxt + reward[1].getElementsByTagName('input')[0].value + "|next_item_is|";
                noteTxt = noteTxt + reward[2].getElementsByTagName('input')[0].value + "|next_item_is|";
            }
        }
        rewards.value = idTxt + "/*a_new_line*/" + valueTxt + "/*a_new_line*/" + noteTxt;
        window.onbeforeunload = null;
        return true;
    }
    else { return false; }
}

function checkInfo(elem) {
    let tip = elem.parentNode.parentNode.getElementsByClassName("tip")[0];
    if (elem.value != '') {
        tip.style.color = 'rgb(128,128,128)';
        return true;
    }
    else {
        tip.style.color = 'red';
        return false;
    }

}

function checkJob(elem) {
    let tip = elem.parentNode.parentNode.getElementsByClassName("tip")[0];
    if ((elem.value.length < 50) && (elem.value != '')) {
        tip.style.color = 'rgb(128,128,128)';
        return true;
    }
    else {
        tip.style.color = 'red';
        elem.value = elem.value.slice(0, 10);
        return false;
    }
}

function checkNote(elem) {
    if (elem.value.length < 50) {
        return true;
    }
    else {
        elem.value = elem.value.slice(0, 50);
        window.alert("奖励分备注最多五十字符！");
        return false;
    }
}

function changeLow(low) {
    let lown = document.getElementById("low");
    lown.setAttribute('max', low);
}