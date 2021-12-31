function showList(obj){
    obj = obj.nextSibling.nextSibling;
    obj = obj.getElementsByClassName("detail");
    obj = obj[0] ;
    obj.style.display = 'table-cell';
}

function unShowList(obj){
    obj = obj.nextSibling.nextSibling;
    obj = obj.getElementsByClassName("detail");
    obj = obj[0] ;
    obj.style.display = 'none';
}

function checkAll(elem){
    let isCheck = elem.getAttribute("isCheck");
    let ses = document.getElementsByClassName("se");
    if (isCheck == '1'){
        elem.setAttribute("isCheck",'0');
        for (let i = 0 ; i < ses.length ; i++){
            let se = ses[i];
            se.checked = false;
        }
    }
    else{
        elem.setAttribute("isCheck",'1');
        for (let i = 0 ; i < ses.length ; i++){
            let se = ses[i];
            se.checked = true;
        }
    }
}