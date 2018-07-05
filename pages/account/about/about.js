
var app = getApp();
Page({
    onLoad: function() {
        
    },
    //链接点击事件
    gotowebpage: function(e) {
        var link = e.currentTarget.dataset.src;
        var url = '../../webpage/webpage';
        wx.navigateTo({
          url: url + '?url=' + link
        })
    },
    //图片点击事件
    imgView: function(event) {
        var src = event.currentTarget.dataset.src;
        wx.previewImage({
            current: src,
            urls: src.split(",")
        })
    },
})