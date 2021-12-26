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