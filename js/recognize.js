
function callback(data) {
    //var speech = data.substr(-4, 4);
    var speech = data;
    console.log("speech =>",speech);
    msgCtx.clearRect(0, 0, msgCtx.canvas.width, msgCtx.canvas.height);
    msgCtx.font = '40px 微軟正黑體';
    msgCtx.fillStyle = '#ebebeb';
    
    if(speech.substring(speech.length-2, speech.length) == "白白"){
        msgCtx.fillText("掰掰" , 75 , 150);
    }
    else{
         msgCtx.fillText(speech.substring(speech.length-2, speech.length) , 75 , 150);
    }
       

    
    var iphone1 = document.getElementById("Iphone1");
    console.log(iphone1);
    iphone1.className = "iphone1 shock_animation";
    iphone1.addEventListener("webkitAnimationEnd", function(e) {
        iphone1.className = "iphone1";
    });
    
    //, ""
    var actionLeft = ["國", "賓", "無", "多", "露", "說", "我", "左", "蘿", "羅", "囉", "l", "f", "卓", "郭", "著", "佛", "朵"];
    var actionRight = ["右", "有", "路", "幼", "r", "友", "遊", "永", "y", "用", "6", "又", "佑", "誘", "郵", "優", "悠", "肉", "由", "油"];
    var actionShoot = ["射", "多", "發", "mo", "s", "色", "花", "社", "髮", "塞", "八", "巴", "8", "2", "秀"];
    var actionBig = ["長", "變", "b", "常", "當", "噹", "大", "場", "廠", "巢", "腸"];
    var actionSmall = ["短", "small" , "小", "玩", "傳"];
    var actionHelp = ["復", "活", "火", "付", "附", "救", "就", "舊", "舅", "我", "命", "help", "死", "副", "save"];
    var actionFast = ["快", "屬", "加", "fast", "點", "電", "yahoo", "素", "數", "樹", "因", "應", "茵", "印", "速", "點", "hurry", "speed", "up", "緊"];
    var actionSlow = ["慢", "緩", "slow", "down"];
    var actionGood = ["帥", "棒", "一", "名"];
    var actionLeave = ["掰","白","拜"];

    action = "";
    max = -1;

    for (var key in actionLeave) {
        var searchIndex = speech.lastIndexOf(actionLeave[key]);
        if (searchIndex > max && searchIndex != -1) {
            action = "8";
            max = searchIndex;
        }
    }

    for (var key in actionLeft) {
        var searchIndex = speech.lastIndexOf(actionLeft[key]);
        if (searchIndex > max && searchIndex != -1) {
            action = "l";
            max = searchIndex;
        }
    }

    for (var key in actionRight) {
        var searchIndex = speech.lastIndexOf(actionRight[key]);
        if (searchIndex > max && searchIndex != -1) {
            action = "r";
            max = searchIndex;
        }
    }

    for (var key in actionBig) {
        var searchIndex = speech.lastIndexOf(actionBig[key]);
        if (searchIndex > max && searchIndex != -1) {
            action = "b";
            max = searchIndex;
        }
    }

    for (var key in actionSmall) {
        var searchIndex = speech.lastIndexOf(actionSmall[key]);
        if (searchIndex > max && searchIndex != -1) {
            action = "small";
            max = searchIndex;
        }
    }

    for (var key in actionShoot) {
        var searchIndex = speech.lastIndexOf(actionShoot[key]);
        if (searchIndex > max && searchIndex != -1) {
            action = "s";
            max = searchIndex;
        }
    }

    for (var key in actionHelp) {
        var searchIndex = speech.lastIndexOf(actionHelp[key]);
        if (searchIndex > max && searchIndex != -1) {
            action = "h";
            max = searchIndex;
        }
    }

    for (var key in actionFast) {
        var searchIndex = speech.lastIndexOf(actionFast[key]);
        if (searchIndex > max && searchIndex != -1) {
            action = "f";
            max = searchIndex;
        }
    }

    for (var key in actionSlow) {
        var searchIndex = speech.lastIndexOf(actionSlow[key]);
        if (searchIndex > max && searchIndex != -1) {
            action = "d";
            max = searchIndex;
        }
    }

    if (action != "") {
        move_bar(action);

        if (action == "l")
            console.log("左邊");
        else if (action == "r")
            console.log("右邊");
        else if (action == "s")
            console.log("發射");
        else if (action == "b")
            console.log("變長");
        else if (action == "small")
            console.log("變短");
        else if (action == "h")
            console.log("復活");
        else if (action == "f")
            console.log("變快");
        else if (action == "d")
            console.log("變慢");
        else if (action == "g")
            console.log("好帥");
        else
            console.log("沒事");
    }
    else {
        console.log("沒事");
    }
}

function StartVoiceRec() {

    voiceRec.start(callback);
}
