var express = require('express');
var app = express();
var router = express.Router();
var http = require('http');
var sql = require('../public/javascripts/mysqlConnection');
var fs = require('fs');
// var rpio = require('rpio');

//Enable PWM on the chosen pin and set the clock and range.

var pin_right1 = 21;
var pin_right2 = 22;
var pin_left1= 23;
var pin_left2 = 24;

var pin_servo_battery = 35;           /* P12/GPIO18 */
var range_servo_battery = 100;       /* LEDs can quickly hit max brightness, so only use */
var clockdiv_servo_battery = 216;       /* Clock divider (PWM refresh rate), 8 == 2.4MHz */

var pin_servo_back = 12;           /* P12/GPIO18 */
var range_servo_back= 100;       /* LEDs can quickly hit max brightness, so only use */
var clockdiv_servo_back = 216;       /* Clock divider (PWM refresh rate), 8 == 2.4MHz */

var body_straight_flag=false;
var body_right_flag=false;
var body_left_flag=false;
var body_back_flag=false;

// rpio.open(pin_right1, rpio.OUTPUT, rpio.LOW);
// rpio.open(pin_right2, rpio.OUTPUT, rpio.LOW);
//
// rpio.open(pin_left1, rpio.OUTPUT, rpio.LOW);
// rpio.open(pin_left2, rpio.OUTPUT, rpio.LOW);
//
// rpio.init({gpiomem: false});
// rpio.open(pin_servo_back, rpio.PWM);
// rpio.open(pin_servo_battery, rpio.PWM);
// rpio.pwmSetClockDivider(clockdiv_servo_back);
// rpio.pwmSetRange(pin_servo_back, range_servo_back);
// rpio.pwmSetRange(pin_servo_battery, range_servo_battery);

//サーバインスタンス作成
var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type':'text/html'});
  res.end('server connected');
});
var io = require('socket.io').listen(server);
server.listen(8080);

var login_users = {};

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Contents' });
});

io.on('connection', function(socket){
  socket.on('control', function(key) {
    switch (key) {
      //前カメラ（砲台制御）
      case 'battery_shoot':
      var shoot=1;
      var query = 'UPDATE bodystatus set shoot=1 where body_id=2';
      sql.query(query, function(err, rows) {
      });
      console.log("shoot");
      break;
      // case 'battery_right':
      //   console.log(degh);
      // break;
      // case 'battery_left':
      //   console.log(degh);
      // break;
      // //後ろカメラ制御
      // case 'back_right':
      // console.log(degh);
      // break;
      // case 'back_left':
      // console.log(degh);
      // break;
      //機体コントロール
      case 'body_straight':
      body_straight_flag=true;
      console.log("straightflag is true");
      fs.appendFile('writetest.csv', socket.id + "," + "straight\n" ,'utf8', function (err) {
      });
      break;
      case 'body_right':
      body_right_flag = true;
      console.log("rightflag is true");
      fs.appendFile('writetest.csv', socket.id + "," + "sright\n" ,'utf8', function (err) {
      });
      break;
      case 'body_left':
      body_left_flag = true;
      console.log("leftflag is true");
      fs.appendFile('writetest.csv', socket.id + "," + "left\n" ,'utf8', function (err) {
      });
      break;
      case 'body_back':
      body_back_flag = true;
      fs.appendFile('writetest.csv', socket.id + "," + "back\n" ,'utf8', function (err) {
      });
      break;
      case 'body_straight_stop':
      body_straight_flag = false;
      console.log("straightflag is false");
      break;
      case 'body_right_stop':
      body_right_flag = false;
      console.log("rightflag is false");
      break;
      case 'body_left_stop':
      body_left_flag = false;
      console.log("leftflag is false");
      break;
      case 'body_back_stop':
      body_back_flag = false;
      console.log("backflag is false");
      break;

      case 'body_stop':
      if(body_straight_flag || body_right_flag || body_back_flag || body_left_flag){
        // rpio.write(pin_right1, rpio.LOW);
        // rpio.write(pin_right2, rpio.LOW);
        // rpio.write(pin_left1, rpio.LOW);
        // rpio.write(pin_left2, rpio.LOW);
        body_straight_flag = false;
        body_right_flag = false;
        body_left_flag = false;
        body_back_flag = false;
        console.log("stop")
      }
      break;
      default:
      break;
    }

    if(body_straight_flag == true){
      // rpio.write(pin_right1, rpio.HIGH);
      // rpio.write(pin_right2, rpio.LOW);
      // rpio.write(pin_left1, rpio.HIGH);
      // rpio.write(pin_left2, rpio.LOW);
    }

    if(body_left_flag == true){
      // rpio.write(pin_right1, rpio.LOW);
      // rpio.write(pin_right2, rpio.HIGH);
      // rpio.write(pin_left1, rpio.LOW);
      // rpio.write(pin_left2, rpio.HIGH);
    }

    if(body_right_flag == true){
      // rpio.write(pin_right1, rpio.HIGH);
      // rpio.write(pin_right2, rpio.LOW);
      // rpio.write(pin_left1, rpio.LOW);
      // rpio.write(pin_left2, rpio.LOW);
    }

    if(body_back_flag == true){
      // rpio.write(pin_right1, rpio.LOW);
      // rpio.write(pin_right2, rpio.HIGH);
      // rpio.write(pin_left1, rpio.LOW);
      // rpio.write(pin_left2, rpio.HIGH);
    }

  });

  socket.on('servo_battery_value', function(value) { //サーボ制御
    var pwm = value;
    io.emit('servo_battery_value', value);
    // rpio.pwmSetData(pin_servo_battery, value);
    console.log(value/180);
  });

  socket.on('servo_back_value', function(value) { //サーボ制御
    var pwm = value;
    io.emit('servo_back_value', value);
    // rpio.pwmSetData(pin_servo_back, value);
    console.log(value/180);
  });


  // 接続開始カスタムイベント(接続元ユーザを保存し、他ユーザへ通知)
  socket.on('enter room', (nickname) => {
    login_users[socket.id] = nickname;
    socket.broadcast.emit('newcomer joined', login_users[socket.id]); // 入室したことを他の人に通知
    io.emit('the number of users', login_users); 　　　　// 参加者一覧を更新
  });

  // 退室処理
  socket.on('disconnect', () => {
    socket.broadcast.emit('user disconnect', login_users[socket.id]); // 退室したおとを他の人に通知
    delete login_users[socket.id];
    io.emit('the number of users', login_users);  // 参加者一覧を更新
  });

  // テキスト入力処理
  var nowTyping = 0;
  socket.on('start typing', () => {
    if (nowTyping <= 0) {
      socket.broadcast.emit('start typing', login_users[socket.id]);  // 入力開始を他の人に通知
    }
    // 一文字打つごとにカウントアップ。打ってから3秒後にカウントダウンし、カウントが0になると入力停止したとみなす
    nowTyping++;
    setTimeout(() => {
      nowTyping--;
      if (nowTyping <= 0) {
        socket.broadcast.emit('stop typing'); // 入力停止を他の人に通知
      }
    }, 3000);
  });

  // テキスト投稿処理
  socket.on('chat message', (msg) => {
    io.emit('chat message', { // テキスト投稿
      nickname: login_users[socket.id],
      msg: msg
    });
  });
});

module.exports = router;
