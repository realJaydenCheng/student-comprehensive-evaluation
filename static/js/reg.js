// 选择头像文件后实时预览
function showImg(thisimg) {
	let file = thisimg.files[0];
	if (window.FileReader) {
		let fr = new FileReader();
		let showimg = document.getElementById('showimg');
		fr.onloadend = function (e) {
			showimg.src = e.target.result;
		};
		fr.readAsDataURL(file);
		showimg.style.display = 'block';
	}
}


// 校验学号
function checkCode() {
	let code = document.getElementById("code").value;
	let tip = document.getElementById('codetip');
	if (!IdentityCodeValid_empty(code)) {
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
	if (obj.length == 13) {
		return true;
	}
	else {
		return false;
	}
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
function checkPwd(){
	let pwd1 = document.getElementById('pwd1').value;
	let tip1 = document.getElementById('pwdtip1');
	let pwd2 = document.getElementById('pwd2').value;
	let tip2 = document.getElementById('pwdtip2');
	if (pwd1.length >= 8){
		if (pwd2 == pwd1){
			tip1.innerText = '请输入您的8位以上密码。';
			tip2.innerText = '请再次输入密码确保无误。';
			tip1.style.color = tip2.style.color = 'rgb(125,125,125)';
			return true;
		}
		else{
			tip2.innerText = '两次密码输入不一致，请重试。';
			tip2.style.color = 'red';
			return false;
		}
	}
	else{
		tip1.innerText = '密码不足8位，请重试。';
		tip1.style.color = 'red';
		return false;
	}
}

// 检验是否有未填信息
function checkNull(){
	let tagName = {'namet' : '姓名' ,'acc' : '账号' };
	for (let i in tagName){
		value = document.getElementById(i).value ;
		if (!value) {
			return false;
		}
	}
	return true ;
}

// 提交表单前检验
function beforeSubmit(){
	if (!checkCode()){
		window.alert('请检查学号相关信息是否有误。');
		return false;
	}
	if (!checkNull()){
		window.alert('账户或者姓名信息未填写。');
		return false;
	}
	if (!checkPwd()){
		window.alert('请检查密码是否输入正确。');
		return false;
	}
	if (!checkId()){
		window.alert('请检查身份证号码是否输入正确。');
		return false
	}
	return true;
}

// 检验身份证
function checkId() {
	let idCode = document.getElementById("idcode").value;
	let tip = document.getElementById('idtip');
	// 进行校验位大小写转换
	idCode = idCode.toUpperCase() ;
	if (!IdentityCodeValid_empty(idCode)) {
		tip.style.color = 'red';
		tip.innerText = '身份证号不可为空。';
		return false;
	}
	else if (!IdentityCodeValid_length_and_type(idCode)) {
		tip.style.color = 'red';
		tip.innerText = '身份证号长度应为18位。';
		return false;
	}
	else if (!IdentityCodeValid_area(idCode)) {
		tip.style.color = 'red';
		tip.innerText = '请检查身份证号中位置信息。';
		return false;
	}
	else if (!IdentityCodeValid_birthday(idCode)) {
		tip.style.color = 'red';
		tip.innerText = '请检查身份证号中出生日期。';
		return false;
	}
	else if (!IdentityCodeValid_jcw(idCode)) {
		tip.style.color = 'red';
		tip.innerText = '请检查身份证号中最后一位。';
		return false;
	}
	else {
		tip.style.color = 'rgb(125,125,125)';
		tip.innerText = '请输入居民身份证号码。';
		return true;
	}
}

var prov_code = {
	11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
	21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏",
	33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南",
	42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆",
	51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃",
	63: "青海", 64: "宁夏", 65: "新疆",
	71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
};

//是否为空
function IdentityCodeValid_empty(obj) {
	if (obj === '') {
		return false;
	}
	else {
		return true;
	}
}

//校验长度，类型
function IdentityCodeValid_length_and_type(obj) {
	if (isCardNo(obj) === false) {
		return false;
	}
	else {
		return true;
	}
}

//检查地区
function IdentityCodeValid_area(obj) {
	if (checkProvince(obj) === false) {
		return false;
	}
	else {
		return true;
	}
}

//检查出生日期
function IdentityCodeValid_birthday(obj) {
	if (checkBirthday(obj) === false) {
		return false;
	}
	else {
		return true;
	}
}

//检查校验码
function IdentityCodeValid_jcw(obj) {
	if (checkParity(obj) === false) {
		return false;
	}
	else {
		return true;
	}
}

//身份证号码为18位，前17位为数字，最后一位是校验位，可能为数字或字符X
function isCardNo(obj) {
	let reg = /^\d{17}(\d|X)$/;
	if (reg.test(obj) === false) {
		return false;
	}
	return true;
};

//取身份证前两位,校验省份
function checkProvince(obj) {
	let province = obj.substr(0, 2);
	if (prov_code[province] == undefined) {
		return false;
	}
	return true;
};

//检查生日是否正确
function checkBirthday(obj) {
	let len = obj.length;
	//身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
	if (len == '15') {
		var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
		var arr_data = obj.match(re_fifteen);
		var year = arr_data[2];
		var month = arr_data[3];
		var day = arr_data[4];
		var birthday = new Date('19' + year + '/' + month + '/' + day);
		return verifyBirthday('19' + year, month, day, birthday);
	}
	//身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
	if (len == '18') {
		var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
		var arr_data = obj.match(re_eighteen);
		var year = arr_data[2];
		var month = arr_data[3];
		var day = arr_data[4];
		var birthday = new Date(year + '/' + month + '/' + day);
		return verifyBirthday(year, month, day, birthday);
	}
	return false;
};

//校验日期
function verifyBirthday(year, month, day, birthday) {
	let now = new Date();
	let now_year = now.getFullYear();
	//年月日是否合理
	if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
		//判断年份的范围（3岁到100岁之间)
		var time = now_year - year;
		if (time >= 0 && time <= 130) {
			return true;
		}
		return false;
	}
	return false;
};

//校验位的检测
function checkParity(obj) {
	let len = obj.length;
	if (len == '18') {
		var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
		var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
		var cardTemp = 0, i, valnum;
		for (i = 0; i < 17; i++) {
			cardTemp += obj.substr(i, 1) * arrInt[i];
		}
		valnum = arrCh[cardTemp % 11];
		if (valnum == obj.substr(17, 1)) {
			return true;
		}
		return false;
	}
	return false;
};
