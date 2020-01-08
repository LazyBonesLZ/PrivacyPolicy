$(function () {
    /*
     luckyNum为每次抽几人
     luckyResult为抽奖结果的集合（数组）
     luckyNum为5那么luckyResult的length也为5
     */
    var Obj = {};
    Obj.luckyResult = [];
    Obj.luckyPrize = '';
    Obj.luckyNum = $(".select_lucky_number").val();

    Obj.tmpResult = [];

    var lotteryTypes = ["Lucky Prize","The 3rd Prize","The 2nd Prize","The 1st Prize"]
    var lotteryCount = [15,8,5,1]
    var currentResultCount = 0
    var currentLottoryCount = 15
    var currentLottoryType = ""
    var currentLottoryResult=[]

    var resultMap = new Map()

    /*
     一次抽几人改变事件
     */
    $(".select_lucky_number").bind('change', function () {
        Obj.luckyNum = $(this).val();
    })

    /*
    初始化参与人数
     */
      $('.lucky_number').html(personArray.length)
    /*
     图片预加载
     */
    function loadImage(arr, callback) {
        var loadImageLen = 1;
        var arrLen = arr.length;
        $('.all_number').html("/" + arrLen);
        for (var i = 0; i < arrLen; i++) {
            var img = new Image(); //创建一个Image对象，实现图片的预下载
            img.onload = function () {
                img.onload = null;
                ++loadImageLen;
                $(".current_number").html(loadImageLen);
                if (loadImageLen == arrLen) {
                    callback(img); //所有图片加载成功回调；
                }
                ;
            }
            img.src = arr[i].image;
        }
    }

    /*
     把3D动画初始化，等待执行
     personArray为本地引入数据
     */
    Obj.M = $('.container').lucky({
        row: 5, //每排显示个数  必须为奇数
        col: 5,//每列显示个数  必须为奇数
        depth: 7, //纵深度
        iconW: 50, //图片的宽
        iconH: 50, //图片的高
        iconRadius: 8, //图片的圆角
        data: personArray, //数据的地址数组
    });
    /*
    执行图片预加载并关闭加载试图
    */
    loadImage(personArray, function (img) {
        $('.loader_file').hide();
    });
    /*
     若为ajax请求执行这段代码
     此为为ajax请求;
     $.get('index.php',function(data){
         if(data.res == 1){
             personArray = data.data; //此为数组

             //执行图片预加载并关闭加载试图
             loadImage(personArray, function (img) {
                $('.loader_file').hide();
             })
             Obj.M = $('.container').lucky({
             row : 7, //每排显示个数  必须为奇数
             col : 7, //每列显示个数  必须为奇数
             depth : 6, //纵深度
             iconW : 30, //图片的宽
             iconH : 30, //图片的高
             iconRadius : 8, //图片的圆角
             data : personArray, //数据的地址数组
         });
         }
     })
     */

//      Array.prototype.remove=function(dx){
// 　　if(isNaN(dx)||dx>this.length){return false;}
// 　　for(var i=0,n=0;i<this.length;i++)
// 　　{
// 　　　　if(this[i]!=this[dx])
// 　　　　{
// 　　　　　　this[n++]=this[i]
// 　　　　}
// 　　}
// 　　this.length-=1
// 　};

            Array.prototype.indexOf = function(val) {
                for(var i = 0; i < this.length; i++) {
                    if(this[i] == val) return i;
                }
                return -1;
            };
            Array.prototype.remove = function(val) {
                var index = this.indexOf(val);
                if(index > -1) {
                    this.splice(index, 1);
                }
            };


    /*
     中奖人员展示效果
     传入当前中奖数组中单个的key
     */
    function showLuckyPeople(num) {
        setTimeout(function () {
            var $luckyEle = $('<img class="lucky_icon" />');
            var $userName = $('<p class="lucky_userName"></p>');
            var $userEnName = $('<p class="lucky_userEnName"></p>');
            var $fragEle = $('<div class="lucky_userInfo"></div>');
            $fragEle.append($luckyEle, $userName,$userEnName);
            $('.mask').append($fragEle);
            $(".mask").fadeIn(200);
            $luckyEle.attr('src', personArray[Obj.luckyResult[num]].image);
            $userName.text(personArray[Obj.luckyResult[num]].name)
            $userEnName.text(personArray[Obj.luckyResult[num]].enName)
            $fragEle.animate({
                'left': '50%',
                'top': '50%',
                'height': '200px',
                'width': '200px',
                'margin-left': '-100px',
                'margin-top': '-100px',
            }, 500, function () {
                setTimeout(function () {
                    $fragEle.animate({
                        'height': '100px',
                        'width': '100px',
                        'margin-left': '100px',
                        'margin-top': '-50px',
                    }, 400, function () {
                        $luckyEle.attr('class', 'lpl_userImage').attr('style', '');
                        $userName.attr('class', 'lpl_userName').attr('style', '');
                        $userEnName.attr('class', 'lpl_userEnName').attr('style', '');
                        $fragEle.attr('class', 'lpl_userInfo').attr('style', '');
                        $('.lpl_list.active').append($fragEle);


                        //移除掉已经中奖的名单
                          if (num == Obj.luckyResult.length-1) {
                            $(".mask").fadeOut(0);
                            var i = 0;
                            Obj.tmpResult = [];
                            for (; i < Obj.luckyResult.length; i++) {
                                Obj.tmpResult.push(personArray[Obj.luckyResult[i]])

                                currentLottoryResult.push(personArray[Obj.luckyResult[i]])
                            };
        
                            for (var j = 0; j < Obj.tmpResult.length; j++) {
                                var tmpValue = Obj.tmpResult[j]
                                personArray.remove(tmpValue)
                            };
                            // currentResultCount += Obj.luckyResult.length
                        $('.lucky_number').html(personArray.length);

                        //将当前结果缓存起来
                        resultMap.set(currentLottoryType,currentLottoryResult)
                        updateListTitle()
                       
                        }
                          
                    })
                }, 500)
            })
        }, num * 500)
        setTimeout(function () {
            $('.lucky_list').show();
        }, 500)
    }

    /*
     停止按钮事件函数
     */
    $('#stop').click(function () {
        Obj.M.stop();
        $(".container").hide();
        $(this).hide();
        var i = 0;
        for (; i < Obj.luckyResult.length; i++) {
            showLuckyPeople(i);
            
        }

    })
    /*
     开始按钮事件函数
     */
    $('#open').click(function () {
        // if ($(".bgm1").paused) {
        //     $(".bgm1").play()
        // };
     

        if (personArray.length < Obj.luckyNum) {
            alert("参与人数已经小于单次需要的人数")
            return
        };
        if (isCurrentRoundOver()) {
            alert("当前奖项已经抽完了")
            return
        };
        if (resultMap.get(currentLottoryType) != undefined) {
            var length = resultMap.get(currentLottoryType).length
            var t = parseInt(Obj.luckyNum ) + length
            if (t > currentLottoryCount) {
                alert("所选的单次产生人数太多了")
            return
        };
    };
     var t1 = parseInt(Obj.luckyNum )
            if (t1 > currentLottoryCount) {
                alert("所选的单次产生人数太多了")
            return
        }
    
        $('.lucky_list').hide();
        $(".container").show();
        Obj.M.open();
        //此为ajax请求获奖结果
        //$.get('luckyNum.php',{luckyNum : Obj.luckyNum,luckyPrize:Obj.luckyPrize},function(data){
        //	  if(data.res == 1){
        //		  Obj.luckyResult = data.luckyResult;
        //        $("#stop").show(500);
        //	  }
        //})
        //ajax获奖结果结束

        //此为人工写入获奖结果
        randomLuckyArr();
        setTimeout(function () {
            $("#stop").show(500);
        }, 1000)
        //人工获奖结果结束
    })

    /*
     前端写中奖随机数
     */
    function randomLuckyArr() {
        Obj.luckyResult = [];
        for (var i = 0; i < Obj.luckyNum; i++) {
            var random = Math.floor(Math.random() * personArray.length);
            if (Obj.luckyResult.indexOf(random) == -1) {
                Obj.luckyResult.push(random)
            } else {
                i--;
            }
        }
    }

    /*
     切换奖品代码块
     */
    function tabPrize() {
        var luckyDefalut = $(".lucky_prize_picture").attr('data-default');
        var index = luckyDefalut ? luckyDefalut : 1;
        tabSport(index);
        var lucky_prize_number = $('.lucky_prize_show').length;
        $('.lucky_prize_left').click(function () {
            // if (!isCurrentRoundOver()) {
            //     alert("not over")
            //     return
            // };
           $('.lucky_prize_right').addClass('active');
           // $('.lucky_prize_right').style.backgroundImage = "url('../images/next_red.png')";
           $('#btn_right').attr("src","images/next_red.png");
           // var br = document.getElementById("btn_right");
           // br.src = "images/next_red.png";
            index <= 1 ? 1 : --index;
            tabSport(index, lucky_prize_number);
        })
        $('.lucky_prize_right').click(function () {
             if (!isCurrentRoundOver()) {
                alert("当前的奖项还没有抽完")
                return
            };
    
            $('.lucky_prize_left').addClass('active');
            // $('.lucky_prize_left').style.backgroundImage = "url('../images/up_red.png')";
             $('#btn_left').attr("src","images/up_red.png");
           //    var br = document.getElementById("btn_left");
           // br.src = "images/up_red.png";

            index >= lucky_prize_number ? lucky_prize_number : ++index;
            tabSport(index, lucky_prize_number);
        })

    }

    function isCurrentRoundOver(){
        var tmpCurResulst = resultMap.get(currentLottoryType)
        var length = 0
        if (tmpCurResulst != undefined) {
            length = tmpCurResulst.length
        };
        return length == currentLottoryCount
    }

    function updateLottoryCountAndType (lucky_prize_name) {
        var index = lotteryTypes.indexOf(lucky_prize_name)
        currentLottoryType = lucky_prize_name
        currentLottoryCount =  lotteryCount[index]
        currentLottoryResult = []
    }

    function updateListTitle(){
        var tmpCurResulst = resultMap.get(currentLottoryType)
        var length = 0
        if (tmpCurResulst != undefined) {
            length = tmpCurResulst.length
        };
        $('.lucky_people_title').html("List of winners ("+ length + "/"+ currentLottoryCount+")");
    }


    /*
     切换奖品左右按钮公共模块
     */
    function tabSport(i, lucky_prize_number) {

        if (i >= lucky_prize_number) {
            $('#btn_right').src = "images/next_gray.png";
            $('.lucky_prize_right').removeClass('active');
            // $('.lucky_prize_right').style.backgroundImage = "url('../images/up_gray.png')";
            $('#btn_right').attr("src","images/next_gray.png");
           //    var br = document.getElementById("btn_right");
           // br.src = "images/next_gray.png";
             
        }
        if (i <= 1) {
             
            $('.lucky_prize_left').removeClass('active');
            $('#btn_left').src = "images/up_gray.png";
            // $('.lucky_prize_left').style.backgroundImage = "url('../images/up_gray.png')";
            // $('#btn_left').attr("src","../images/up_gray.png");
           //    var br = document.getElementById("btn_left");
           // br.src = "images/up_gray.png";
            
        }
        Obj.luckyPrize = i;
        $('.lucky_prize_show').hide().eq(i - 1).show();
        var prize_name = $('.lucky_prize_show').eq(i - 1).attr('alt')
        $(".lucky_prize_title").html(prize_name);
        updateLottoryCountAndType(prize_name)
        updateListTitle()

        $('.lpl_list').removeClass('active').hide().eq(i - 1).show().addClass('active');
    }
    tabPrize();

//     function test(){
//         var tmp = "周张林李冬曾菁倪澄新林冬梅潘春燕张静怡巫书瑶杨钢宋文琦张鹏谌丹丹侯皝冯琳芝邹文罗晓鹏黄瑞黄文王茂遥胡婉逸许泽沛陈芳唐金龙付丽馨黄文佳李元罗斯佳罗攀雷玲玲刘梦媛王东李巽刘静雯苟谆马宁毛雨东罗伟军王卓瑞陈科唐伟刘璐莹宋振中王婷易满杨春王楚月贺小龙牛珂欣王秀雷吴雨桐王宇乔曹文杰朱若瑜曾恬甜朱喜凌程莉娟罗娜徐圣超张英驰燕玲媛";
// var notcontain = ""
// for (var i = personArray.length - 1; i >= 0; i--) {
    
//     if (!tmp.includes(personArray[i].name)) {
//         notcontain+=personArray[i].name
//     };
// };
// alert(notcontain)

//     }
//     test()
})