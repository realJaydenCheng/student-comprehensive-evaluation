// 检验密码
function checkPwd() {
	let pwd1 = document.getElementById('newpwd').value;
	let tip1 = document.getElementById('pwdtip2');
	let pwd2 = document.getElementById('pwd2').value;
	let tip2 = document.getElementById('pwdtip3');
	if (pwd1.length >= 8) {
		if (pwd2 == pwd1) {
			tip1.innerText = '请输入您的8位以上密码。';
			tip2.innerText = '请再次输入密码确保无误。';
			tip1.style.color = tip2.style.color = 'rgb(125,125,125)';
			return true;
		}
		else {
			tip2.innerText = '两次密码输入不一致，请重试。';
			tip2.style.color = 'red';
			return false;
		}
	}
	else {
		tip1.innerText = '密码不足8位，请重试。';
		tip1.style.color = 'red';
		return false;
	}
}

// 
function check8(n){
    let tip = document.getElementById("pwdtip1");
    if (n.value.length >= 8) {
        tip.style.color =  'rgb(125,125,125)' ;
        return true ;}
    else{ 
        tip.style.color = 'red' ;
        return false ;}
}

function beforeSubmit() {
	let pwd = document.getElementById('newpwd')
	let code = document.getElementById('code').value
    let oldpwd = document.getElementById('oldpwd')
	if (!check8(oldpwd)) {
		window.alert('旧密码填写不足八位');
		oldpwd.value = '';
		return false;
	}
	if (!checkPwd()) {
		window.alert('请检查密码是否输入正确。');
		pwd.value = '';
		return false;
	}
	pwd.value = md5Pwd(pwd.value, code);
    oldpwd.value = md5Pwd(oldpwd.value,code);
	return true;
}