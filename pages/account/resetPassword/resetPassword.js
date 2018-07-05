import WxValidate from '../../../utils/wxValidate.js'
var Api = require('../../../utils/api.js');
var app = getApp();

Page({
    data: {
        form: {
            password: '',
            confirmPassword: ''
        }
    },
    onLoad: function() {
        this.initValidate();
    },
    initValidate() {
        const rules = {
            password: {
                required: true,
                minlength: 6,
                maxlength: 15,
                assistance: true
            },
            confirmPassword: {
                required: true,
                equalTo: 'password'
            },
        };
        const messages = {
            password: {
                required: '新密码不能为空',
                minlength: '新密码不能小于6位',
                maxlength: '新密码不能大于15位',
                assistance: '新密码必须包含字母和数字'
            },
            confirmPassword: {
                required: '确认密码不能为空',
                equalTo: '密码输入不一致'
            }
        };
        this.WxValidate = new WxValidate(rules, messages);
        this.WxValidate.addMethod('assistance', (value, param) => {
            return this.WxValidate.optional(value) || (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,15}$/.test(value))
        })
    },
    showModal(error) {
        wx.showModal({
            content: error.msg,
            showCancel: false
        })
    },
    formSubmit: function(e) {
        var params = e.detail.value;
        if(!this.WxValidate.checkForm(e)) {
            const error = this.WxValidate.errorList[0];
            this.showModal(error);
            return false;
        }

        var myAuthorizeCode = wx.getStorageSync("myAuthorizeCode");
            var that = this;
            wx.request({
                url: Api.createPassword() +
                    "?myAuthorizeCode=" + myAuthorizeCode,
                data: {
                    Password: params.password,
                    ConfirmPassword: params.confirmPassword
                },
                dataType: "json",
                method: "POST",
                success: function (res) {
                    if (res.data.success) {
                        wx.showToast({
                            title: "重置成功",
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
})