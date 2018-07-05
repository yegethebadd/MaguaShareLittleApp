var app = getApp()
var tempCode = {};
var Api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js');
var config = require('../../config.js');
var pageCount = config.getPageCount;
Page({
    data: {
      postsList: [],
      postsShowSwiperList: [],
      isLastPage: false,
      isLoading:false,
      page: 1,
      search: '',
      categories: 0,
      showerror: "none",
      showCategoryName: "",
      categoryName: "",
      showallDisplay: "block",
      displayHeader: "none",
      displaySwiper: "none",
      floatDisplay: "none",
      displayfirstSwiper: "none",
    },
    formSubmit: function(e) {
        var url = '../blogs/search';
        var key = '';
        if(e.currentTarget.id == "search-input"){
            key = e.detail.value;
        }
        else{
            key = e.detail.value.input;
        }
        if(key != ''){
            url = url + '?filterTitle=' + key;
            wx.navigateTo({
                url: url
            })
        }
        else{
            wx.showModal({
                title: '提示',
                content: '请输入内容',
                showCancel: false
            });
        }
    },
    onShareAppMessage: function() {
        return {
            title: '"' + config.getWebsiteName + '"网站微信小程序',
            path: '/pages/index/index',
            success: function (res){
                //分享成功
            },
            fail: function (res){
                //分享失败
            }
        }
    },
    onPullDownRefresh: function() {
        var self = this;
        self.setData({
            showerror: "none",
            showallDisplay: "none",
            displaySwiper: "none",
            floatDisplay: "none",
            isLastPage: false,
            page: 0,
            postsShowSwiperList: []
        });
        this.fetchTopFivePosts();
    },
    onReachBottom: function() {
        var self = this;
        if(!self.data.isLastPage) {
            self.setData({
                page: self.data.page + 1
            });
            //console.log('当前页' + self.data.page);
            this.fetchPostsData(self.data);
        }
        else{
        }
    },
    onLoad: function(options) {
        var self = this;
        this.fetchTopFivePosts();
    },
    onShow: function(options){
    },
    fetchTopFivePosts: function() {
        var self = this;
        var getPostsRequest = wxRequest.getRequest(Api.getSwiperPosts());
        getPostsRequest.then(response => {
            if (response.statusCode == 200 && response.data.posts.length > 0) {
                self.setData({
                    postsShowSwiperList: response.data.posts,
                    displaySwiper: "block"
                });
            }
            else {
                self.setData({
                    displaySwiper: "none"
                })
            }
        })
        self.setData({
            showallDisplay: "block",
        })

        this.fetchPostsData();
    },

    //获取文章列表数据
    fetchPostsData: function (data) {
        var myAuthorizeCode = wx.getStorageSync("myAuthorizeCode");
        var self = this;
        if(!data) data = {};
        if(!data.page) data.page = 1;
        if(!data.search) data.search = '';
        if(data.page === 1){
            self.setData({
                postsList: []
            });
        };
        self.setData({ isLoading: true })
        var getPostsRequest = wxRequest.getRequest(Api.getBlogs(myAuthorizeCode,data.page));
        getPostsRequest.then(response => {
            if(response.statusCode === 200){
                if(response.data.blogs && (response.data.blogs.length < pageCount)){
                    self.setData({
                        isLastPage: true
                    });
                }
                self.setData({
                    floatDisplay: "block",
                    postsList: self.data.postsList.concat(response.data.blogs)
                });
                self.setData({ isLoading: false })
            }
            else {
                if(response.data.code == "rest_post_invalid_page_number") {
                    self.setData({
                        isLastPage: true
                    });
                }
                else {
                    wx.showToast({
                        title: response.data.message,
                        duration: 1500
                    })
                }
            }
        }).catch(function(response) {
            if(data.page == 1) {
                self.setData({
                    showerror: "block",
                    floatDisplay: "none"
                });
            }
            else {
                wx.showModal({
                    title: "加载失败",
                    content: "加载数据失败，请重试",
                    showCancel: false,
                });
                self.setData({
                    page: data.page - 1
                });
            }
        })
        .finally(function(response) {
            wx.hideLoading();
            wx.stopPullDownRefresh();
        })
    },
    //加载详情
    redirectDetail: function(e) {
        var id = e.currentTarget.id,
            url = '../blogs/detail/detail?id=' + id;
        wx.navigateTo({
            url: url,
        })
    },
    searchUser: function(e) {
        var user = e.currentTarget.dataset.user;
        var url = "../blogs/search?name=" + user;
        wx.navigateTo({
            url: url
        })
    },
    searchGenre: function(e) {
        var genre = e.currentTarget.dataset.genre;
        var url = "../blogs/search?genre=" + genre;
        wx.navigateTo({
            url: url
        })
    },
    redictAppDetail: function(e){
        var id = e.currentTarget.id;
        var shorttitle = e.currentTarget.dataset.shorttitle;
        var isBlogLink = e.currentTarget.dataset.isbloglink;
        var blogLinkId = e.currentTarget.dataset.bloglinkid == null ? "" : e.currentTarget.dataset.bloglinkid;
        var url;

        //置顶文章，跳转到详情页
        if(isBlogLink){
            url = '../blogs/detail/detail?id=' + blogLinkId;
            wx.navigateTo({
                url: url
            });
        }
        //跳转到特定置顶文章页
        else {
            url = '../blogs/htmlpage/htmlpage?shorttitle=' + shorttitle;
            wx.navigateTo({
                url: url
            });
        }
    }
});