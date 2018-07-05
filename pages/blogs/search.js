var app = getApp()
var tempCode = {};
var Api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js');
var config = require('../../config.js');
var pageCount = config.getPageCount;
Page({
    data: {
      postsList: [],
      isLastPage: false,
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
      genreList: [],
      genre: '',
      genreIndex: 0,
      userName: '',
      filterTitle: ''
    },
    formSubmit: function(e) {
        var user = e.detail.value.userName;
        var title = e.detail.value.filterTitle;
        var genre = this.data.genre || "";
        var url = "search?name=" + user + "&filterTitle=" + title + "&genre=" + genre;
        wx.redirectTo({
            url: url
        })
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
            isLastPage: false,
            page: 0,
        });
        this.fetchPostsData();
    },
    onReachBottom: function() {
        var self = this;
        if(!self.data.isLastPage) {
            self.setData({
                page: self.data.page + 1
            });
            this.fetchPostsData(self.data);
        }
        else{
        }
    },
    onLoad: function(options) {
        var self = this;
        self.setData({
            filterTitle: options.filterTitle||"",
            userName: options.name||"",
            genre: options.genre||""
        });
        this.fetchPostsData();
    },
    onShow: function(options){
        // wx.setStorageSync('openLinkCount', 0);
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
        var genre = self.data.genre || "",
            userName = self.data.userName || "",
            filterTitle = self.data.filterTitle || "";
        wx.showLoading({
            title: '正在加载',
            mask: true
        });
        var getPostsRequest = wxRequest.getRequest(Api.sortGenre(myAuthorizeCode,genre,userName,filterTitle,data.page));
        getPostsRequest.then(response => {
            if(response.statusCode === 200){
                if(response.data.blogs && (response.data.blogs.length < pageCount)){
                    self.setData({
                        isLastPage: true
                    });
                };
                self.setData({
                    floatDisplay: "block",
                    postsList: self.data.postsList.concat(response.data.blogs),
                    genreList: response.data.genres
                });
                var genres = self.data.genreList;
                for(var i=0;i<genres.length;i++){
                    if(self.data.genre==genres[i]){
                        self.setData({
                            genreIndex: i
                        });
                        break;
                    }
                }
                setTimeout(function() {
                    wx.hideLoading();
                }, 900);
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
            url = 'detail/detail?id=' + id;
        wx.navigateTo({
            url: url,
        })
    },
    searchUser: function(e) {
        var user = e.currentTarget.dataset.user;
        var url = "search?name=" + user;
        wx.redirectTo({
            url: url
        })
    },
    searchGenre: function(e) {
        var genre = e.currentTarget.dataset.genre;
        var url = "search?genre=" + genre;
        wx.redirectTo({
            url: url
        })
    },
    bindGenreChange: function(e) {
        var genres = this.data.genreList;
        this.setData({
            genreIndex: e.detail.value,
            genre: genres[e.detail.value]
        });
    }
});