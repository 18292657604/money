auto.waitFor();//判断和等待开启无障碍
app.launchApp('快手极速版');//只有一个快手极速版所以直接Launch就可以，不用包名
sleep(10000);//等待splash时间
//console.show(); //开启日志（悬浮窗权限）
console.log("开始点击红包")
if (id("redFloat").exists()) {
    console.log("点击redFloat红包");
    let b = id("redFloat").findOne().bounds();
    click(b.centerX(), b.centerY());
    sleep(5000);
}

console.log("完成点击红包")
sleep(2000);
swipe(device.width / 2, device.height - 200, device.width / 2, 500, 700);
console.log("开始签到")
sleep(2000);
if (className("android.widget.Button").text("去签到").exists()) {
    console.log("快手极速版去签到：按钮存在");
    let b = text("去签到").findOne().bounds();
    click(b.centerX(), b.centerY());
    //TODO 关闭按钮也是无ID 无desc的×
    back();
}
console.log("完成签到")


// 去收藏
let taskName_collect = "去收藏"
// 去收藏图标路径
let iconPath_collect = "/sdcard/autojs/collect_icon.jpg";
//doTask(taskName_collect, iconPath_collect)

// 去点赞
let taskName_like = "去点赞"
// 去点赞图标路径
let iconPath_like = "/sdcard/autojs/like_icon.jpg";
//doTask(taskName_like, iconPath_like)

// 去评论
let taskName_comment = "去评论"
// 去评论图标路径
let iconPath_comment = "/sdcard/autojs/comment_icon.jpg";
doTask(taskName_comment, iconPath_comment)

// stopApp('快手极速版');//停止APP（Android7和Android10亲测）

/**
 *  去收藏
 */
function doTask(taskName, taskIconPath){
    sleep(5000);
    console.log("【任务中心】已进入");

    images.requestScreenCapture();
    let img = images.captureScreen();
    let goZhuanqianContents = ocr.detect(img);

    let goCollectObject = goZhuanqianContents.filter(item => item.label.includes(taskName))[0];
    console.log("goCollectObject : " + goCollectObject)

    if(goCollectObject){
        let goCollectReact = goCollectObject["bounds"];
        log(goCollectReact.left, goCollectReact.right, goCollectReact.top, goCollectReact.bottom);
        let centerX = (goCollectReact.left + goCollectReact.right) / 2;
        let centerY = (goCollectReact.top + goCollectReact.bottom) / 2;
    
        click(centerX, centerY);
        console.log("【" + taskName + "】点击完成");
    
        clickTaskIcon(taskName, taskIconPath)
    }else {
        console.log("【任务中心】页面未找到" + taskName);
    }

}

function clickTaskIcon(taskName, taskIconPath) {
    sleep(5000); // 等待页面加载

    // 请求屏幕截图权限
    if (!images.requestScreenCapture()) {
        console.log("屏幕截图权限未开启，请手动开启！");
        return;
    }

    // 捕获屏幕截图
    let img = images.captureScreen();
    if (!img) {
        console.log("屏幕截图失败！");
        return;
    }

    // 加载任务图标为ImageWrapper对象
    let starIconImage = images.read(taskIconPath);
    if (!starIconImage) {
        console.log("加载任务图标失败，请检查路径是否正确！加载任务图标路径 ：" + taskIconPath);
        return;
    }

    // 使用图像识别定位任务图标
    let result = images.findImage(img, starIconImage, {
        threshold: 0.5
    });
    if (result) {
        console.log("找到任务图标，位置：", result);

        // 计算点击坐标
        let centerX = result.x + 10;
        let centerY = result.y + 10;
        // 点击任务图标
        click(centerX, centerY);
        console.log("任务图标点击完成");
    } else {
        console.log("未找到任务图标");
    }

    if("去评论" == taskName){
        console.log("已进入" + taskName + "页面")

        // 调用函数发送评论
        sendComment("视频很好，up加油！");
    }

}

function sendComment(comment) {
    // 点击评论框的父布局以激活输入法
    let textHolderContainer = id("com.kuaishou.nebula:id/text_holder_container_layout").findOne();
    if (textHolderContainer) {
        textHolderContainer.click();
        sleep(1000); // 等待输入法弹出

        // 输入评论内容
        setText(comment);
        sleep(1000); // 等待文本输入完成

        // 点击发送按钮
        // let sendButton = text("发送").findOne();
        // if (sendButton) {
        //     sendButton.click();
        //     toastLog("评论已发送");
        // } else {
        //     toastLog("未找到发送按钮");
        // }
    } else {
        console.log("未找到评论框");
    }
}

/**
 * 强制停止app
 * @param {应用名称} appName 
 */
function stopApp(appName){
    console.log("开始结束运行")
    openAppSetting(getPackageName(appName));
    console.show();
    sleep(3000);
    console.log("判断是否存在结束运行按钮")
    if (className("android.widget.Button").text("结束运行").exists()) {
        console.log("结束运行按钮存在")
        className("android.widget.Button").text("结束运行").findOnce().click();
        try {

            sleep(3000);
            if (className("android.widget.Button").text("确定").exists()) {
                className("android.widget.Button").text("确定").findOnce().click();
                toastLog(appName + "结束运行！");
            }
            else {
                let closeButton = className("android.widget.Button").text("结束运行").find();
                console.info(closeButton.length);
                console.info(closeButton[0].bounds());
                closeButton[0].click();
                toastLog(appName + "结束运行！");
            }
        } catch (e) {
            toastLog(e);
        }
    }else {
        console.log("结束运行按钮不存在")
    }
    
}