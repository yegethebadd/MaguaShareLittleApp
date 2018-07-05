import config from "../config"

var domain = config.getDomain;
var pageCount = config.getPageCunt;
var categoriesID = config.getCategoriesID;
var indexListType = config.getIndexListType;
// var HOST_URI = "https://" + domain + "/WxOpen/";
var HOST_URI = domain + "/WxOpen/";

module.exports = {
    onLogin: function () {
        var url = HOST_URI + 'account/onLogin';
        return url;
    },
    onLogout: function() {
        var url = HOST_URI + 'account/onLogout';
        return url;
    },
    getUserInfo: function(){
        var url = HOST_URI + 'account/getUserInfo';
        return url;
    },
    changeInfo: function() {
        var url = HOST_URI + 'account/changeInfo';
        return url;
    },
    bindAccount: function() {
        var url = HOST_URI + 'account/bindAccount';
        return url;
    },
    createPassword: function() {
        var url = HOST_URI + 'account/resetPassword';
        return url;
    },
    checkUserName: function() {
        var url = HOST_URI + 'account/checkUserNameOK';
        return url;
    },
    getBlogs: function(myAuthorizeCode, page) {
        var url = HOST_URI + 'blogs/index?myAuthorizeCode=' + myAuthorizeCode + "&page=" + page;
        return url;
    },
    getBlogsDetail: function(myAuthorizeCode, id) {
        var url = HOST_URI + 'blogs/details?myAuthorizeCode=' + myAuthorizeCode + "&id=" + id;
        return url;
    },
    getCommentsReply: function(obj) {
        var url = HOST_URI + 'blogs/comments?blogid=' + obj.postId + '&pageCount=' + obj.limit + '&page=' + obj.page;
        return url;
    },
    postComment: function() {
        var url = HOST_URI + 'blogs/addcomment';
        return url;
    },
    sortGenre: function(myAuthorizeCode,genre,name,filterTitle,index) {
        var url = HOST_URI + 'blogs/sortgenre?myAuthorizeCode=' + myAuthorizeCode 
            + "&genre=" + genre + "&name=" + name + "&filterTitle=" + filterTitle
            + "&index=" + index;
        return url;
    },
    getSwiperPosts: function() {
        var url = HOST_URI + 'blogs/getswiper';
        return url;
    },
    getSwiperDetail: function(shorttitle){
        var url = HOST_URI + 'blogs/getswiperdetail?shorttitle=' + shorttitle;
        return url;
    },
    getCommentsWebpage: function(obj) {
        var url = HOST_URI + 'blogs/webpagecomments?pageid=' + obj.postId + '&pageCount=' + obj.limit + '&page=' + obj.page;
        return url;
    },
    postWebpageComment: function() {
        var url = HOST_URI + 'blogs/addwebpagecomment';
        return url;
    },
    postSuggestion: function() {
        var url = HOST_URI + 'account/PostSuggestion';
        return url;
    }
};