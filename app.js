var Api = require('utils/api.js');
var tempCode = {};

//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  //获取用户信息 
  //callback:执行完成回调函数
  getUserInfo: function(callback) {
    var that = this;
    var tempUserInfo = {};
    if(that.globalData.userInfo){
      callback();
      return;
    }
    
    if(wx.getStorageSync("myAuthorizeCode")!=""){
      that.refreshInfo(callback);
    }
    else{
      wx.login({
        success: function(res){
          tempCode = res.code;
          wx.getUserInfo({
            success: function (res) {
                tempUserInfo = res;
                wx.request({
                    url: Api.onLogin(),
                    data: {
                        code: tempCode,
                        iv: tempUserInfo.iv,
                        encryptedData: tempUserInfo.encryptedData,
                        avatarUrl: tempUserInfo.userInfo.avatarUrl,
                        nickName: tempUserInfo.userInfo.nickName
                    },
                    dataType: "json",
                    method: "POST",
                    success: function(response) {
                        if (response.data.success) {
                            that.globalData.hasLogin = true;
                            that.globalData.userInfo = response.data.userInfo;
                            that.globalData.openId = response.data.openId;
                            wx.setStorageSync('myAuthorizeCode', response.data.myAuthorizeCode);
                        };
                    callback(null);
                    },
                    fail: function(res) {
                      callback(res);
                    }
                });
            },
            fail:function(res){
              callback(res.errMsg);
            }
        })
        },
        fail:function(res){
          callback(res);
        }
      })
    }
  },
  refreshInfo: function(callback) {
    var that = this;
    var myAuthorizeCode = wx.getStorageSync("myAuthorizeCode");
    wx.request({
        url: Api.getUserInfo()+"?myAuthorizeCode=" + myAuthorizeCode,
        success: function(response) {
            that.globalData.hasLogin = true;
            that.globalData.userInfo = response.data.userInfo;
            that.globalData.openId = response.data.openId;
            callback(null);
        },
        fail: function(res) {
          callback(res);
        }
    })
  },
  globalData:{
    userInfo:null,
    openid:"",
    isGetUserInfo:false,
    isGetOpenid:false,
    hasLogin: false,
  }
})