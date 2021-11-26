// 校验学号
function checkCode() {
	let code = document.getElementById("code").value;
	let tip = document.getElementById('codetip');
	if (!code) {
		tip.style.color = 'red';
		tip.innerText = '学号不可为空。';
		return false;
	}
	else if (!isCodeLength(code)) {
		tip.style.color = 'red';
		tip.innerText = '请检查学号是否为13位。';
		return false;
	}
	else if (!is012Code(code)) {
		tip.style.color = 'red';
		tip.innerText = '请检查是否为012开头的本科学号。';
		return false;
	}
	else {
		tip.style.color = 'rgb(125,125,125)';
		tip.innerText = '请输入012开头的13位学号。';
		return true;
	}
}

function isCodeLength(obj) {
	if (obj.length == 13) { return true; }
	else { return false; }
};

function is012Code(obj) {
	let reg = /012\d{10}/;
	return reg.test(obj);
}


// 专业年级班级下拉菜单动态调整
function activeSelect() {
	let mj = document.getElementById('mj').value;
	let yr = document.getElementById('yr');
	let cl = document.getElementById('cl')
	if (mj == 'bmc') {
		yr.innerHTML = '<option value="21">21</option>';
		cl.innerHTML = '';
		for (let i = 1; i <= 13; i++) {
			let opc = document.createElement('option');
			if (i < 10) { i = '0' + i; }
			else { i = '' + i; }
			opc.value = i;
			opc.innerText = i;
			cl.appendChild(opc);
		}
	}
	else if (mj == 'mis') innerSelect(yr, cl, 18, 21, 3);
	else if (mj == 'ac' || mj == 'fm') innerSelect(yr, cl, 18, 20, 3);
	else if (mj == 'bm' || mj == 'hr' || mj == 'mk') innerSelect(yr, cl, 18, 20, 2);
	else if (mj == 'gj') innerSelect(yr, cl, 18, 21, 1);
	else if (mj == 'acca') innerSelect(yr, cl, 18, 20, 1);
}

function innerSelect(yrObj, clObj, yrB, yrE, clE) {
	yrObj.innerHTML = '';
	clObj.innerHTML = '';
	for (let i = yrB; i <= yrE; i++) {
		let opy = document.createElement('option');
		i = '' + i;
		opy.value = i;
		opy.innerText = i;
		yrObj.appendChild(opy);
	}
	for (let i = 1; i <= clE; i++) {
		let opc = document.createElement('option');
		i = '0' + i;
		opc.value = i;
		opc.innerText = i;
		cl.appendChild(opc);
	}
}

// 检验密码
function checkPwd() {
	let pwd1 = document.getElementById('pwd1').value;
	let tip1 = document.getElementById('pwdtip1');
	let pwd2 = document.getElementById('pwd2').value;
	let tip2 = document.getElementById('pwdtip2');
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

// 检验是否有未填信息
function checkName() {
	let value = document.getElementById('name').value;
	if (!value) { return false; }
	return true;
}

// 加密密码
function md5Pwd(pwd, uid) {
	let md5Pwd = 'password://' + pwd + uid;
	md5Pwd = hex_md5(md5Pwd);
	return md5Pwd;
}

// 提交表单前检验与处理
function beforeSubmit() {
	let pwd = document.getElementById('pwd1')
	let code = document.getElementById('code').value
	if (!checkCode()) {
		window.alert('请检查学号相关信息是否有误。');
		pwd.value = ''
		return false;
	}
	if (!checkName()) {
		window.alert('姓名信息未填写。');
		pwd.value = ''
		return false;
	}
	if (!checkPwd()) {
		window.alert('请检查密码是否输入正确。');
		pwd.value = ''
		return false;
	}
	pwd.value = md5Pwd(pwd.value, code);
	return true;
}