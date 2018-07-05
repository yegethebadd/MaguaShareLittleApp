var Api = require('../../../utils/api.js');
var app = getApp();

Page({
    data: {
      anonymous: true,
      items: [
        {value: 'anonymous', name: '匿名反馈', checked: 'true'},
      ]
    },
    checkboxChange: function(e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    
        var items = this.data.items, values = e.detail.value;
        for (var i = 0, lenI = items.length; i < lenI; ++i) {
          items[i].checked = false;
    
          for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
            if(items[i].value == values[j]){
              items[i].checked = true;
              break
            }
          }
        }
    
        this.setData({
          anonymous: items[0].checked
        })
    },
    formSubmit: function(e) {
      var params = e.detail.value;
      if(params.message == "") {
        wx.showModal({
            content:"请填写反馈信息",
            showCancel:false,
            confirmText:"确定",
        })
        return;
      }

      var myAuthorizeCode = "";
      if(!this.data.anonymous) {
        myAuthorizeCode = wx.getStorageSync("myAuthorizeCode");
      }
      var that = this;
      wx.request({
          url: Api.postSuggestion() + 
              "?myAuthorizeCode=" + myAuthorizeCode,
          data:{
              message: params.message
          },
          dataType: "json",
          method: "POST",
          success:function (res) {
            wx.showToast({
                title: "提交成功",
                duration: 2000,
                complete:wx.navigateBack()
            })
          }
      })
    },
  })