// 繰り返し処理のタイマーオブジェクト

// var tmrExecte_straight;
// var tmrExecte_right;
// var tmrExecte_left;
// var tmrExecte_back;
// var blnExecute_stop;
// // 処理実行中の判定フラグ（true：処理実行中）
// var blnExecute_straight;
// var blnExecute_right;
// var blnExecute_left;
// var blnExecute_back;
// var blnExecute_stop;
// var intTmrInterval = 100;	// 繰り返し処理の時間間隔（ミリ秒）

var controlStatus = new Array(4);


var flag_body_straight=0;
var flag_body_right=0;
var flag_body_left=0;
var flag_body_back=0;

// if (document.addEventListener){
//     var _click = (window.ontouchstart === undefined)? 'click' : 'touchstart';
//     clickTap.addEventListener(_click, function(){
//         cTCnt++;
//         clickTapCnt.innerHTML = cTCnt;
//     }, false);
// }else if(document.attachEvent){
//     clickTap.attachEvent('onclick', function(){
//         cTCnt++;
//         clickTapCnt.innerHTML = cTCnt;
//     });
// }

$(function(){
  $('.dial_battery','.servo_battery').knob({
    'min':0,
    'max':360,
    'stopper':true,
    'width':120,
    'cursor':15,
    'thickness':.3,
    'fgColor':"#222222",
    'change' : function(value) {
      //console.log(value);
      socket.emit('servo_battery_value',value);
    }
  });
  $('#reset_btn_battery').click(function() {
    $('.dial_battery','.servo_battery').val(0).trigger('change');
    socket.emit('servo_battery_value',0);
  });
  socket.on('servo_battery', function(value) {
    //console.log("value: " + msg.value);
    // ノブの値を更新
    $('.servo_battery').val(value).trigger('change');
  });
});

$(function(){
  $('.dial_back','.servo_back').knob({
    'min':0,
    'max':360,
    'stopper':true,
    'width':120,
    'cursor':15,
    'thickness':.3,
    'fgColor':"#222222",
    'change' : function(value) {
      //console.log(value);
      socket.emit('servo_back_value',value);
    }
  });


  $('#reset_btn_back').click(function() {
    $('.dial_back','.servo_back').val(0).trigger('change');
    socket.emit('servo_back_value',0);
  });
  socket.on('servo_back', function(value) {
    //console.log("value: " + msg.value);
    // ノブの値を更新
    $('.servo_back').val(value).trigger('change');
  });
});


function control_battery_top() {
  socket.emit('control', 'battery_top');
};
function control_battery_down() {
  socket.emit('control', 'battery_down');
};
function control_battery_left() {
  socket.emit('control', 'battery_left');
};
function control_battery_right() {
  socket.emit('control', 'battery_right');
};
function control_battery_shoot() {
  socket.emit('control', 'battery_shoot');
};


//後ろカメラの関数設定
function control_back_top() {
  socket.emit('control', 'back_top');
};
function control_back_down() {
  socket.emit('control', 'back_down');
};
function control_back_left() {
  socket.emit('control', 'back_left');
};
function control_back_right() {
  socket.emit('control', 'back_right');
};



function control_body(direction) {
  socket.emit('control', direction);
  switch(direction){
    case "body_straight":
    document.getElementById("body_straight_status").innerHTML="Stright";
    break;
    case "body_right":
    document.getElementById("body_right_status").innerHTML="Right";
    break;
    case "body_left":
    document.getElementById("body_left_status").innerHTML="Left";
    break;
    case "body_back":
    document.getElementById("body_back_status").innerHTML="Back";
    break;

    case "body_straight_stop":
    document.getElementById("body_straight_status").innerHTML=" ";
    break;
    case "body_right_stop":
    document.getElementById("body_right_status").innerHTML=" ";
    break;
    case "body_left_stop":
    document.getElementById("body_left_status").innerHTML=" ";
    break;
    case "body_back_stop":
    document.getElementById("body_back_status").innerHTML=" ";
    break;

    case "body_stop":
    document.getElementById("body_straight_status").innerHTML=" ";
    document.getElementById("body_right_status").innerHTML=" ";
    document.getElementById("body_left_status").innerHTML=" ";
    document.getElementById("body_back_status").innerHTML=" ";
    break;
  }
};

document.onkeydown = function (e){
  //if(!e) e = window.event; // レガシー
  if(e.keyCode == 37 && flag_body_left==0){
    control_body("body_left");
    flag_body_left=1;
  }
  if(e.keyCode == 38 && flag_body_straight==0){
    control_body("body_straight");
    flag_body_straight=1;
  }
  if(e.keyCode == 39 && flag_body_right==0){
    control_body("body_right");
    flag_body_right=1;
  }
  if(e.keyCode == 40 && flag_body_back==0){
    control_body("body_back");
    flag_body_back=1;
  }
}

document.onkeyup = function (e){
  if(e.keyCode == 37){
    flag_body_left=0;
    control_body("body_left_stop");
  }
  if(e.keyCode == 38){
    flag_body_straight=0;
    control_body("body_straight_stop");
  }
  if(e.keyCode == 39){
    flag_body_right=0;
    control_body("body_right_stop");
  }
  if(e.keyCode == 40){
    flag_body_back=0;
    control_body("body_back_stop");
  }
}





// function start(mode){
//   // ここに繰り返す処理の関数
//   switch (mode) {
//     case 'body_straight':
//     blnExecute_straight = true;
//     tmrExecte_straight = setInterval(function(){
//     control_body('control_body_straight')}, intTmrInterval);
//     break;
//     case 'body_right':
//     blnExecute_right = true;
//     tmrExecte_right = setInterval(function(){
//     control_body('control_body_right')}, intTmrInterval);
//     break;
//     case 'body_left':
//     blnExecute_left = true;
//     tmrExecte_left = setInterval(function(){
//     control_body('control_body_left')}, intTmrInterval);
//     break;
//     case 'body_back':
//     blnExecute_back = true;
//     tmrExecte_back = setInterval(function(){
//     control_body('control_body_back')}, intTmrInterval);
//     break;
//     case 'body_stop':
//     blnExecute_stop = true;
//     tmrExecte_stop = setInterval(function(){
//     control_body('control_body_stop')}, intTmrInterval);
//     break;
//
//     default:
//           }
//         };
//
//         function stop(mode){
//           switch (mode) {
//             case 'body_straight':
//             clearInterval(tmrExecte_straight);
//             blnExecute_straight = false;
//             break;
//             case 'body_right':
//             clearInterval(tmrExecte_right);
//             blnExecute_right = false;
//             break;
//             case 'body_left':
//             clearInterval(tmrExecte_left);
//             blnExecute_left = false;
//             break;
//             case 'body_back':
//             clearInterval(tmrExecte_back);
//             blnExecute_back = false;
//             break;
//             case 'body_stop':
//             clearInterval(tmrExecte_stop);
//             blnExecute_stop = false;
//             break;
//             default:
//           }
//         };
