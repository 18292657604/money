/**
 * 抖音签到
 */
auto.waitFor();
images.requestScreenCapture();

main();


function main(){
    app.launch("com.ss.android.ugc.aweme.lite");
    log(currentActivity());
    log("=========开始进入赚钱页面==========");
    zhuanq();
    log("============进入赚钱页面结束============");

 
    log("============开始点击签到============");
    sleep(3000);
    let img = images.captureScreen();
    let contents = ocr.detect(img);
    sign(contents);
    log("============完成点击立即签到============")
 
    log("============执行去预约任务开始============");
    reservation(contents);
    log("============执行去预约任务结束============");

    log("============执行吃饭打卡赚金币去领取任务开始============");
    log(contents)
    eat_receive(contents);
    log("============执行吃饭打卡赚金币去领取任务结束============")

    //  back();
    //  back();
     /* if (isSign) {
        log("==========开始领取夜宵补贴6金币==========");
        let icon = text("领取夜宵补贴6金币").findOne(3000);
        let icon1 = className("com.lynx.tasm.behavior.ui.text.FlattenUIText").text("领取夜宵补贴6金币");
        if (icon.exists()) {
            log("=======已找到签到按钮=======");
            icon.click();
        }
        log("==========完成领取夜宵补贴6金币==========");
        if (icon1.exists()) {
            log("====备选已找到=============");
        }
    } */
}



function zhuanq() {
    sleep(5000);
    zq = id("d=5");
    log(zq);
    if (zq.exists()) {
        log("通过ID已找到赚钱页面");
        zq_ele = zq.findOne(3000);
        if (zq_ele.visibleToUser() && zq_ele.clickable()) {
            id("d=5").findOne(3000).click();
        } else {
            log(zq_ele.centerX(), zq_ele.centerY());
            click(zq_ele.centerX(), zq_ele.centerY());
        }
    } else {
        let img = images.captureScreen();
        let contents = ocr.detect(img);
        let zhuanqianObject = contents.filter(item => item.label.includes("赚钱"))[0];
        if (!zhuanqianObject) {
            log("通过截图的方式找到赚钱页面");
            let react = zhuanqianObject["bounds"];
            log(react.left, react.right, react.top, react.bottom);
            let centerX = (react.left + react.right) / 2;
            let centerY = (react.top + react.bottom) / 2;
            click(centerX, centerY);
        }
    }
}


function sign(contents) {
    sleep(1500);
    let sign = click_btn(contents, ["去签到"]);
    if (sign) {
        click(sign.centerX, sign.centerY);
        if (id("tc").exists()) {
            id("tc").findOne(1500).click();
        }
        sleep(1500);
        back();
    }
}

/**
 * 未完成 
 */
function reservation(contents) {
    sleep(2500);
    let reservation = click_btn(contents, ["去預约", "去预约"]);
    if (reservation) {
        click(reservation.centerX, reservation.centerY);
        if (text("立即预约领取").exists()) {
            text("立即预约领取").findOne(1500).click();
        }
        sleep(1500);
        back();
    }
}

function click_btn(btns, btn_names) {
    let button = null;
    for (let btn of btns) {
        for (let btn_name of btn_names) {
            if (btn.label.includes(btn_name)) {
                button = btn;
                break;
            }
        }
        if (button) {
            break;
        }
    }
    if (button) {
        log("通过截图的方式找到" + btn_names[0] + "页面");
        let react = button["bounds"];
        log(react.left, react.right, react.top, react.bottom);
        let centerX = (react.left + react.right) / 2;
        let centerY = (react.top + react.bottom) / 2;
        return {'centerX': centerX, 'centerY': centerY};
    }
    return null;
}