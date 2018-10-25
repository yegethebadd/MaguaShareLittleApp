var Api = require('../../utils/api.js');
var wxRequeset = require('../../utils/wxRequest.js');
var config = require('../../config.js');

Page({
    data: {
        lastStoryId: ''
    },
    onLoad: function() {
        this.nextStory();
    },

    prevStory: function() {
        var id = this.data.lastStoryId;
        var url = Api.getStory(id)
        this.getStory(url);
    },

    nextStory: function() {
        var url = Api.getStory('');
        this.getStory(url);
    },

    getStory: function(url) {
        var that = this;
        var id = this.data.storyId||"";
        wx.request({
            url: url,
            dataType: "GET",
            success: function (res){
            var jsonStr= res.data;
            jsonStr = jsonStr.replace(" ","");
            if(typeof jsonStr!= 'object'){
              jsonStr= jsonStr.replace(/\ufeff/g,"");//重点
              var jj = JSON.parse(jsonStr);
              res.data = jj;
            }
            that.setData({
                lastStoryId: id,
                storyId: res.data.id,
                content: res.data.content,
                title: res.data.title||""
            })
            },
            error: function(res) {
                that.setData({
                    content: "抱歉，获取出错了"
                })
            }
        })
    },
    onShareAppMessage: function() {
        return {
            title: '"' + config.getWebsiteName + '"-开心一刻',
            path: '/pages/story/story',
            success: function (res){
                //分享成功
            },
            fail: function (res){
                //分享失败
            }
        }
    },
    onPullDownRefresh: function() {
        this.nextStory();
    },
})