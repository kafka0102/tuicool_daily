//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
Page({
  __proto__: util.basePageObject,
  data: {
    id : 0,
    items: [],
    title: '',
    date: '',
    end_date: util.formatDate(new Date(), "yyyy-MM-dd"),
    isLoading: true,
    error: ''
  },
  //事件处理函数
  clickArticleDetail: function(e) {
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.id
    })
  },
  clickChooseDate: function (e) {
    var date = e.detail.value;
    date = date.replace(/-/g,"");
    this.setData({
      id: parseInt(date)
    });
    this.requestData();
  },
  requestData: function () {
    var that = this;
    util.getDailyNews(that.data.id, (res) => {
      that.setData({
        isLoading: false
      });
      if (res.data.success) {
        that.setData({
          items: res.data.items,
          title: res.data.title,
          date: util.formatDate(new Date(res.data.time*1000), "yyyy-MM-dd")
        });
      } else {
        var error = res.data.error;
        if (res.data.code == 404) {
          error = "没有数据";
        }
        that.setData({
          items: [],
          error: error
        });
      }
    });
  },
  onShareAppMessage: function () {
    return {
      title: '推酷晚报',
      path: '/pages/index/index',
      imageUrl: '/images/logo_mini_share.jpg',
      success: function (res) {
        // 转发成功
      },
    }
  }
});

