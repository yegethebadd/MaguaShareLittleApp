import WxValidate from '../../../utils/wxValidate.js'
var Api = require('../../../utils/api.js');
var app = getApp();
Page({
    data: {
        errorNickName: '',
        form: {
            nickName: '',
            email: '',
            signature: '',
        }
    },
    onLoad: function () {
        this.initValidate();
        this.setData({
            form: {
                nickName: app.globalData.userInfo.nickName,
                signature: app.globalData.userInfo.signature,
                email: app.globalData.userInfo.email,
            }
        })
    },
    initValidate() {
        const rules = {
            email: {
                email: true,
            },
            nickName: {
                required: true,
                checkUserName: true
            }
        };
        const messages = {
            email: {
                email: '请输入正确的邮箱'
            },
            nickName: {
                required: '用户名不能为空',
                checkUserName: '用户名被占用',
            }
        };
        // 创建实例对象
        this.WxValidate = new WxValidate(rules, messages);
        this.WxValidate.addMethod('checkUserName', (value,param) => {
            return this.WxValidate.optional(value) || (this.data.errorNickName==="")
        })
    },
    showModal(error){
        wx.showModal({
            content: error.msg,
            showCancel: false,
        })
    },
    formSubmit: function(e) {
        var params = e.detail.value;
        if(!this.WxValidate.checkForm(e)){
            const error = this.WxValidate.errorList[0];
            this.showModal(error);    
            return false;
        }

        var myAuthorizeCode = wx.getStorageSync("myAuthorizeCode");
        var that = this;
        wx.request({
            url: Api.changeInfo() + 
                "?myAuthorizeCode=" + myAuthorizeCode,
            data:{
                UserName: params.nickName,
                Email: params.email,
                Signature: params.signature
            },
            dataType: "json",
            method: "POST",
            success:function (res) {
                if (res.data.success) {
                    wx.showToast({
                        title: "保存成功",
                        duration: 2000,
                        complete:wx.navigateBack()
                      })
                }
                else{
                    wx.showModal({
                        content:"保存出错了\n出错提示：" + res.data.msg,
                        showCancel:false,
                        confirmText:"确定",
                    })
                }
            }
        })
    },
    checkUserName: function(e) {
        this.checkUserNameOK(e.detail.value)
    },
    checkUserNameOK: function(userName) {
        var that = this;
        var myAuthorizeCode = wx.getStorageSync('myAuthorizeCode');
        if(userName==""||userName==undefined){
            return;
        }
        wx.request({
            url: Api.checkUserName() + 
                "?myAuthorizeCode=" + myAuthorizeCode + 
                "&userName=" + userName,
            success: function (res) {
                //检验成功
                if(res.data.success) {
                    that.setData({
                        errorNickName:''
                    });
                }
                else {
                    that.setData({
                        errorNickName:'用户名被占用'
                    })
                }
            }
        });
    }
})