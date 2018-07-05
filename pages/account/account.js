var app = getApp()
var tempCode = {};
var Api = require('../../utils/api.js');
Page({
    onLoad: function () {
        this.setData({
            hasLogin: app.globalData.hasLogin,
            userInfo: app.globalData.userInfo,
        })
    },
    onShow: function() {
        var myAuthorizeCode = wx.getStorageSync("myAuthorizeCode");
        if(myAuthorizeCode){
            this.refreshInfo();
        }
    },
    data: {
    },
    logout: function() {
        var that = this;
        var myAuthorizeCode = wx.getStorageSync("myAuthorizeCode");
        wx.request({
            url: Api.onLogout(),
            dataType: "json",
            method: "POST",
            data: {
                MyAuthorizeCode: myAuthorizeCode,
                OpenId: app.globalData.openId,
            },
            success: function() {
                wx.showToast({
                    title: "注销成功",
                    duration: 2000,
                })
            }
        })
        app.globalData.hasLogin = false;
        app.globalData.userInfo = {};
        that.hasLogin = false;
        that.userInfo = {};
        wx.removeStorageSync("myAuthorizeCode");
        
        that.onLoad();
    },
    login: function () {
        var that = this;
        wx.login({
            success: function (res) {
                tempCode = res.code;
                that.getUserInfo();
            }
        })
    },
    getUserInfo: function() {
        var that = this;
        var tempUserInfo = {};
        
        if(app.globalData.hasLogin === false) {
            wx.login({
                success: _getUserInfo
            })
        } else {
            _getUserInfo()
        }

        function _getUserInfo() {
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
                                app.globalData.hasLogin = true;
                                app.globalData.userInfo = response.data.userInfo;
                                app.globalData.openId = response.data.openId;
                                that.setData({
                                    hasLogin: true,
                                    userInfo: response.data.userInfo,
                                    openId: response.data.openId
                                })
                                wx.setStorageSync('myAuthorizeCode', response.data.myAuthorizeCode);
                            }
                        }
                    })
                }
            })
        }
    },

    refreshInfo: function() {
        var that = this;
        var myAuthorizeCode = wx.getStorageSync("myAuthorizeCode");
        wx.request({
            url: Api.getUserInfo()+"?myAuthorizeCode=" + myAuthorizeCode,
            success: function(response) {
                app.globalData.hasLogin = true;
                app.globalData.userInfo = response.data.userInfo;
                app.globalData.openId = response.data.openId;
                that.setData({
                    hasLogin: true,
                    userInfo: response.data.userInfo,
                });
            }
        })
    }
})