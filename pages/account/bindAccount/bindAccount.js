import WxValidate from '../../../utils/wxValidate.js'
var Api = require('../../../utils/api.js');
var app = getApp();

Page({
    data: {
        form: {
            account: '',
            signature: '',
        }
    },
    onLoad: function() {
        this.initValidate();
    },
    initValidate() {
        const rules = {
            account: {
                required: true,
            },
            password: {
                required: true
            }
        };
        const messages = {
            account: {
                required: '账号不能为空'
            },
            password: {
                required: '密码不能为空'
            }
        }
        this.WxValidate = new WxValidate(rules, messages);
    },
    showModal(error) {
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
        };

        wx.showModal({
            title: '危险',
            content: '转移后此账号将删除,原账号内容迁移到新账号',
            success: function(res) {
                //用户点击确认
                if(res.confirm) {
                    var myAuthorizeCode = wx.getStorageSync("myAuthorizeCode");
                    var that = this;
                    wx.request({
                        url: Api.bindAccount() +
                            "?myAuthorizeCode=" + myAuthorizeCode,
                        data: {
                            Account: params.account,
                            Password: params.password
                        },
                        dataType: "json",
                        method: "POST",
                        success: function (res) {
                            if (res.data.success) {
                                wx.showToast({
                                    title: "绑定成功",
                                    duration: 2000,
                                    complete: wx.navigateBack()
                                })
                            }
                            else {
                                wx.showModal({
                                    content:"保存出错了\n出错提示：" + res.data.msg,
                                    showCancel: false,
                                    confirmText: "确定",
                                })
                            }
                        }
                    })
                }
            }
        });
    },

})