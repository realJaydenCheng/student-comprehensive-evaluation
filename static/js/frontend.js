function scroll__(s, t) {
    let tiny_t = 5;
    let cnt = Number.parseInt(t / tiny_t);
    let step = s / cnt;
    let timer = setInterval(() => {
        if (cnt > 0) {
            cnt--;
            window.scrollBy(0, step);
        } else {
            clearInterval(timer);
        }
    }, tiny_t)
}

function scrollSmoothly(s, t) {
    let tiny_t = 5;
    let cnt = Number.parseInt(t / tiny_t);
    let step = Number.parseInt(2 * s / cnt);
    let delt = Number.parseInt(step / cnt + 1);
    let timer = setInterval(() => {
        if (cnt > 0) {
            cnt--;
            window.scrollBy(0, step);
            step -= delt;
            if (step < 2) {
                step = 1;
            }
        } else {
            clearInterval(timer);
        }
    }, tiny_t)
}

function blinkSlogan(){
    let text = ['我 |','我 们','我 们 的|','我 们 的 榜','我 们 的 榜 样 |','我 们 的 榜 样 !  ','我 们 的 榜 样 !|'];
    let slogan = document.getElementById('slogantxt');
    let i = 0
    let tiny_t = 400;
    let timer = setInterval(() => {
        slogan.innerText = text[i] ;
        i++ ;
        if (i==7){
            i = 5;
        }
    }, tiny_t)

}