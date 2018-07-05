
import config from "../../../config.js";
var Api = require("../../../utils/api.js");
var util = require("../../../utils/util.js");
var wxParse = require("../../../wxParse/wxParse.js");
var wxApi = require("../../../utils/wxApi.js");
var wxRequest = require("../../../utils/wxRequest.js");
var app = getApp();
let isFocusing = false;
const pageCount = config.getPageCount;

Page({
    data: {
        title: '文章内容',
        detail: {},
        commentsList: [],
        commentCount: '',
        detailDate: '',
        commentValue: '',
        wxParseData: [],
        display: 'none',
        page: 1,
        isLastPage: false,
        parentID: "0",
        focus: false,
        placeholder: "评论...",
        postID: null,
        scrollHeight: 0,
        postList: [],
        link: '',
        dialog: {
            title: '',
            content: '',
            hidden: true
        },
        content: '',
        isShow: false,//控制menubox是否显示
        isLoad: true,//解决menubox执行一次  
        menuBackgroup: false,
        atUserId: "",
        commentdate: "",
        flag: 1,
        enableComment: true,
        isLoading:false,
        total_comments:0,
        shorttitle:''
    },
    onLoad: function (options) {
        if(options.shorttitle == undefined) {
            options.shorttitle = config.getHtmlPaegDefault;
        }
        this.setData({
          shorttitle: options.shorttitle
        })
        this.getEnableComment();
        this.fetchDetailData(options.shorttitle);
    },
    onReachBottom: function() {
        var self = this;
        if(!self.data.isLastPage) {
            console.log('当前页' + self.data.page);
            self.fetchCommentData();
            self.setData({
                page: self.data.page + 1
            });
        }
        else{
        }
    },
    onShareAppMessage: function (res) {
        this.ShowHideMenu();
        return {
            title: '分享"' + config.getWebsiteName + '"的文章：' + this.data.detail.title,
            path: '/pages/blogs/htmlpage/htmlpage?shorttitle=' + this.data.shorttitle,
            imageUrl: this.data.detail.post_thumbnail_image,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    gotowebpage: function() {
        var self = this;
        self.ShowHideMenu();
        var minAppType = config.getMinAppType;
        var url = '';
        if(minAppType = "0") {
            url = "../../webpage/webpage";
            wx.navigateTo({
                url: url + "?url=" + self.data.link
            })
        }
        else{
            self.copyLink(self.data.link);
        }
    },
    copyLink: function(url) {
        wx.setClipboardData({
            data: url,
            success: function(res) {
                wx.getClipboardData({
                    success: function(res) {
                        wx.showToast({
                            title: '链接已复制',
                            image: '../../../image/link.png',
                            duration: 2000
                        })
                    }
                })
            }
        })
    },
    goHome: function() {
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
    
    //获取是否开启评论设置
    getEnableComment: function (id) {
        var self = this;
        self.setData({
            enableComment: true
        })
    },
    //获取文章内容
    fetchDetailData: function(shorttitle) {
        var myAuthorizeCode = wx.getStorageSync("myAuthorizeCode");
        var self = this;
        var getPostDetailRequest = wxRequest.getRequest(Api.getSwiperDetail(shorttitle));
        var res;
        var _displayLike = "none";
        getPostDetailRequest.then(response => {
            res = response;
            var content = util.addImgSrcPrefix(response.data.content);
            wxParse.wxParse("article", "html", content, self, 5);
            self.setData({
                detail: response.data,
                display: "block",
            })
            wx.setNavigationBarTitle({
                title: res.data.title
            });
        })
        .catch(function (response) {

        }).finally(function (response) {

        });
    },
    //给a标签添加跳转和复制链接事件
    wxParseTagATap: function (e) {
        var self = this;
        var href = e.currentTarget.dataset.src;
        self.copyLink(href);
    },
    //图片点击事件
    imgView: function(event) {
        var src = event.currentTarget.dataset.src;
        wx.previewImage({
            current: src,
            urls: src.split(",")
        })
    },
    //获取评论
    fetchCommentData: function () {
        var self=this;
        let args = {};
        args.postId = self.data.detail.id;
        args.limit = pageCount;
        args.page = self.data.page;
        self.setData({ isLoading: true })

        var getCommentsRequest = wxRequest.getRequest(Api.getCommentsWebpage(args));
        getCommentsRequest
            .then(response => {
                if (response.statusCode == 200) {
                    if (response.data.comments.length < pageCount) {
                        self.setData({
                            isLastPage: true
                        });
                    }
                    if (response.data) {
                        self.setData({
                            commentsList: [].concat(self.data.commentsList, response.data.comments)
                        });
                    }

                }

            }).then(response => {
                

            }) 
            .catch(response => {
                
            }).finally(function () {

                self.setData({
                    isLoading: false
                });

            });     
    },
    //显示或隐藏功能菜单
    ShowHideMenu: function () {
        this.setData({
            isShow: !this.data.isShow,
            isLoad: false,
            menuBackgroup: !this.data.false
        })
    },
    //点击非评论区隐藏功能菜单
    hiddenMenubox: function () {
        this.setData({
            isShow: false,
            menuBackgroup: false
        })
    },
    reply: function (e) {
        var self = this;
        var parentId = e.target.dataset.parentid;
        var name = e.target.dataset.name;
        var atUserId = e.target.dataset.userid;
        isFocusing = true;
        if (self.data.enableComment=="1")
        {
            self.setData({
                parentID: parentId,
                placeholder: "回复" + name + ":",
                focus: true,
                atUserId: atUserId,
            });

        }        
    },
    onReplyBlur: function (e) {
        var self = this;
        if (!isFocusing) {
            {
                const text = e.detail.value.trim();
                if (text === '') {
                    self.setData({
                        parentID: "0",
                        placeholder: "评论...",
                        atUserId: "",
                        commentdate: ""
                    });
                }

            }
        }
    },
    onReplyFocus: function (e) {
        var self = this;
        isFocusing = false;
        if (!self.data.focus) {
            self.setData({ focus: true })
        }
    },
    //提交评论
    formSubmit: function (e) {
        var self = this;
        var comment = e.detail.value.inputComment;
        var parent = self.data.parentID;
        var blogId = e.detail.value.inputPostID;
        var formId = e.detail.formId;
        var atUserId = self.data.atUserId;
        if (comment.length === 0) {
            self.setData({
                'dialog.hidden': false,
                'dialog.title': '提示',
                'dialog.content': '没有填写评论内容。'

            });
        }
        else {
            //登录
            app.getUserInfo(function(err){
                if(err){
                    wx.showModal(err);
                    return;
                }
                var myAuthorizeCode = wx.getStorageSync("myAuthorizeCode");
                var fromUser = app.globalData.userInfo.nickName;
                var data = {
                    WebPageID: blogId,
                    Comment: comment,
                    ParentID: parent,
                    AtUserID: atUserId
                };
                var url = Api.postWebpageComment() + '?myAuthorizeCode=' + myAuthorizeCode + '&formId=' + formId;
                var postCommentRequest = wxRequest.postRequest(url, data);
                postCommentRequest
                    .then(res => {
                        if (res.statusCode == 200) {
                            if (!res.data.errMsg) {
                                self.setData({
                                    content: '',
                                    parentID: "0",
                                    atUserId: 0,
                                    placeholder: "评论...",
                                    focus: false,
                                    commentsList: []
                                });
                            }
                            else {
                                self.setData({
                                    'dialog.hidden': false,
                                    'dialog.title': '提示',
                                    'dialog.content': res.data.errMsg
    
                                });
                            }
                        }
                    }).then(response =>{                    
                        //self.fetchCommentData(self.data); 
                        self.setData(
                            {
                                page:1,
                                commentsList:[],
                                isLastPage:false
    
                            }
                        )
                        self.onReachBottom();
                        //self.fetchCommentData();
                        setTimeout(function () {                           
                            wx.showToast({
                                title: '评论发布成功',
                                icon: 'success',
                                duration: 900,
                                success: function () {
                                }
                            })                            
                        }, 900); 
                    }).catch(response => {
                        self.setData({
                            'dialog.hidden': false,
                            'dialog.title': '提示',
                            'dialog.content': '评论失败,' + response
    
                        });
                    })
            });
        }
    },
    userAuthorization: function () {
        var self = this;
        // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
        wx.getSetting({
            success: function success(res) {
                var authSetting = res.authSetting;
                if (util.isEmptyObject(authSetting)) {
                } else {
                    // 没有授权的提醒
                    if (authSetting['scope.userInfo'] === false) {
                        wx.showModal({
                            title: '用户未授权',
                            content: '如需正常使用评论、点赞、赞赏等功能需授权获取用户信息。是否在授权管理中选中“用户信息”?',
                            showCancel: true,
                            cancelColor: '#296fd0',
                            confirmColor: '#296fd0',
                            confirmText: '设置权限',
                            success: function (res) {
                                if (res.confirm) {
                                    wx.openSetting({
                                        success: function success(res) {
                                            var scopeUserInfo = res.authSetting["scope.userInfo"];
                                            if (scopeUserInfo) {
                                                auth.getUsreInfo();
                                            }
                                        }
                                    });
                                }
                            }
                        })
                    }
                }
            }
        });
    },
})