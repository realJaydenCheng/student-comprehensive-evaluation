function beforeLogin(){
    let uid = document.getElementById('codetxt') ;
    let pwd = document.getElementById('pwdtxt') ;
    if (is012Code(uid.value)) {
        pwdtxt = md5Pwd(pwd.value , uid.value) ;
        pwd.value = pwdtxt ;
        return true ;
    } 
    else {
        alert('请输入正确的学号！') ;
        return false ;
    }
}

function md5Pwd(pwd, uid) {
	let md5Pwd = 'password://' + pwd + uid;
	md5Pwd = hex_md5(md5Pwd);
	return md5Pwd;
}

function is012Code(obj) {
    tip = document.getElementById('uidtip');
    let reg = /012\d{10}/ ;
    if ((obj.length == 13) && reg.test(obj)){
        tip.innerText = '请输入012开头的13位学号。';
        tip.style.color = 'rgb(128,128,128)';
        return true;
    }
    else {
        tip.innerText = '应为012开头的13位本科学号';
        tip.style.color = 'red';
        return false;
    }
        
}