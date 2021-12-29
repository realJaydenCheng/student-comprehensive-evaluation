var ltIE9 = (function () {
	var theUA = window.navigator.userAgent.toLowerCase();
	if (
		(theUA.match(/msie\s\d+/) && theUA.match(/msie\s\d+/)[0]) ||
		(theUA.match(/trident\s?\d+/) && theUA.match(/trident\s?\d+/)[0])
	) {
		var ieVersion =
			theUA.match(/msie\s\d+/)[0].match(/\d+/)[0] ||
			theUA.match(/trident\s?\d+/)[0];
		if (ieVersion < 9) {
			return true;
		} else {
			return false;
		}
	}
})();
ltIE9 && (window.location.href = "/ie/")

var shuwon = {
	percent: 0,
	timers: "",
	init: function (e) {
		util.backTop()
		util.toastInit()
		var $navA = $('nav .nav-right ul li'),
		$hlayout = $('.hover-layout'),
		navNum = 0
		for (var i = 0; i <= 5; i++) {
			if ($navA.eq(i).hasClass('active')) {
				navNum = i
				$hlayout.css({
					'width': $navA.eq(i).outerWidth(),
					'left': $navA.eq(i).position().left
				})
			}
		}

		$('.m-nav').click(function(){
			$('body,html').toggleClass('menu');
		})

		$(window).scroll(function(){
			if ($(window).scrollTop()>100){
				$(".backTop").addClass('active');
			} else {
				$(".backTop").removeClass('active');
			}
			var top = $(window).scrollTop();
			if (top > 0) {
				$('nav').addClass('navActive')
			} else {
				$('nav').removeClass('navActive')
			}
		});
		//当点击跳转链接后，回到页面顶部位置
		$(".backTop").click(function(){
			if ($('html').scrollTop()) {
				$('html').animate({ scrollTop: 0 }, 1000);
				return false;
			}
			$('body').animate({ scrollTop: 0 }, 1000);
			return false;
		});

		var wow = new WOW({
			boxClass: 'wow',
			animateClass: 'animated',
			offset: 0,
			mobile: true,
			live: true
		}).init();

		$("img.lazy").lazyload({effect: "fadeIn"});
	},

	/**
	 * 页面加载完毕
	 */
	loaded: function () {

	},
	index: function () {
	
			
	
		shuwon.banner();
		// PRODUCT swiper
		var imgSwiper = new Swiper('.img-swiper', {
			direction: 'vertical',
			watchSlidesVisibility: true,//防止不可点击
			loop: true,
			speed: 700,
			allowTouchMove:false
		});
		var imgSwiper2 = new Swiper('.img-swiper2', {
			direction: 'vertical',
			watchSlidesVisibility: true,//防止不可点击
			loop: true,
			speed: 700,
			allowTouchMove:false
		});
		var txtSwiper = new Swiper('.txt-swiper', {
			direction: 'vertical',
			loop: true,
			speed: 700,
			mousewheel: false,
			autoplay: {
				delay: 6000,
				disableOnInteraction: true,
			},
			navigation: {
				nextEl: '.txt-swiper .swiper-button-next',
				prevEl: '.txt-swiper .swiper-button-prev',
			},
			controller: {
				control: [imgSwiper2, imgSwiper],
				// inverse: false,
				by: 'slide',
			},
			on: {
				init: function () {
					numList = '<ul>';
					for (p = 1; p <= (this.slides.length - 2); p++) {
						numList += '<li>' + p + '</li>';
					}
					numList += '</ul>';
					this.$el.find('.swiper-pagination').html(numList + ' / <span class="total">' + (this.slides.length - 2) + '</span>');
					//paginationRender会每次更新dom，无法产生动画效果,所以使用html()生成pagination
					this.emit('transitionStart');
				},
				transitionStart: function () {
					realIndex = this.realIndex;
					speed = this.params.speed;
					bullets = this.$el.find('.swiper-pagination li');
					sldieLength = bullets.length;
					for (i = 0; i < sldieLength; i++) {
						if ((i - realIndex) > Math.floor(sldieLength / 2)) {
							difference = i - sldieLength - realIndex;
						} else if ((i - realIndex) < -Math.floor(sldieLength / 2)) {
							difference = i + sldieLength - realIndex;
						} else {
							difference = i - realIndex;
						}
						bullets.eq(i).transition(speed);
						bullets.eq(i).transform('rotateX(' + difference * 30 + 'deg) translate3d(0, ' + difference * 30 + 'px, 0)');
						bullets.eq(i).css('opacity', 1 - Math.abs(difference));
					}
				}
			}
		});
		
		
		// serach
		$('.d6 input').focus(function () {
		   $('nav ul').addClass('navUlactice')
		});
		$('.d6 input').blur(function () {
			$('nav ul').removeClass('navUlactice')
		});
		
	},
	banner:function(){
		var t = $(".banner ul li"),
			a = t.length,
			d = 0;
		
		$(".banner ul li").eq(0).addClass("active");
		$(".banner ul li").eq(0).addClass("visible");

		var timer = setInterval(function() {
			next();
		}, 8000);

		$(".banner .btn.prev").click(function(){
			prev();
		})
		$(".banner .btn.next").click(function(){
			next();
		})
		function next() {
			d = ++d > a - 1 ? 0 : d;
			e();
		}
		function prev() {
			d = --d < 0 ? a - 1 : d;
			e();
		}
		function e() {
			clearInterval(timer);
			$(".banner ul li").eq(d).addClass("active").siblings().removeClass("active");
			$(".banner ul li").eq(d).addClass("visible");
			$(".banner ol li").eq(d).addClass("active").siblings().removeClass("active");
			setTimeout(function(){
				$(".banner ul li").eq(d).siblings().removeClass("visible");
			},600)

			timer = setInterval(function() {
				next()
			}, 8000)

		}
	},
	/**
	 * 倒计时
	 */
	countDownTime: function () {
		isClick = false;
		$('.yzmBtn').addClass("enable");
		$('.yzmBtn').addClass("active").html('60秒后重新获取')
		var waitTime, currTime = 59;
		var interval = setInterval(function () {
			shuwon.timeChange(currTime);
			currTime--;
			if (currTime < 0) {
				clearInterval(interval);
				currTime = waitTime;
			}
		}, 1000);
	},
	/**
	 *获取数据
	 *
	 * @param {String} url 传入的数据接口
	 * @param {Object} para 传入的参数
	 * @param {Object} callback 返回
	 */
	getDataForApi: function (type, url, para, callback) {
		$.ajax({
			type: type,
			data: para,
			url: window.location.protocol + '//' + window.location.host + url,
			dataType: 'json',
			success: function (data) {
				callback(data)
			},
			error: function (e) {
				alert(window.location.protocol + '//' + window.location.host + url);
				console.log(e, "数据加载错误")
			}
		})
	},
}
shuwon.init()


// 提交form
$form = document.getElementById('_form2');
$('.submit-2').click(function () {
    if ($form.name.value == '') {
        util.toast({
            string: '请填写姓名',
            type: 'warning'
        });
    } else if ($form.phone.value == '') {
        util.toast({
            string: '请填写手机号码',
            type: 'warning'
        });
    } else if (!util.regPhone($form.phone.value)) {
        util.toast({
            string: '请正确填写手机号码',
            type: 'error'
        })
    }  else if ($form.message.value == '') {
        util.toast({
            string: '请填写留言内容',
            type: 'warning'
		});
	}else {
        shuwon.getDataForApi('post','/plus/diy.php', {
            name: $form.name.value,
			phone: $form.phone.value,
			message: $form.message.value,
			action:'post',
			diyid:'1',
			do:'2',
			dede_fields:'name,text;phone,text;message,multitext',
			dede_fieldshash:'80d82028892036e108e8e71033ef58ec',
        }, function (data) {
            if (data.result == true) {
                util.toast({
                    string: data.msg,
                    type: 'success'
                });
            } else {
                util.toast({
                    string: data.msg,
                    type: 'error'
                });
            }

        })
    }
});
$(function(){
    $("#accepted_answer").keyup(function(){
        var len = $(this).val().length;
        if(len > 149){
            $(this).val($(this).val().substring(0,150));
            $("#word").text(0);
        }
        var num = 150 - len;
	
        if(num<0){
            $("#word").text(0);
        }else{
            $("#word").text(num);
        }
    });
$("#submenu").click(function(){
		$('.yahei').slideToggle();
	
})
})
