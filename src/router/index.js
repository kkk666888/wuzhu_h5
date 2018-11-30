import Vue from 'vue';
import Router from 'vue-router';
import store from '../store/store';
import { isAlipayLife } from './../util/utils';

Vue.use(Router);

const router = new Router({
  // mode: 'history',  // 调试用，取消＃号
  linkActiveClass: 'active',
  routes: [
    {
      path: '/InitLogin',
      name: 'InitLogin',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/InitLogin/InitLogin.vue')), 'InitLogin');
      },
      beforeEnter: (to, from, next) => {
        setTitle('登录');
        next();
      }
    },
    {
      path: '/CheckMobile',
      name: 'CheckMobile',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/CheckMobile/CheckMobile.vue')), 'CheckMobile');
      },
      beforeEnter: (to, from, next) => {
        setTitle('手机号验证');
        next();
      }
    },
    {
      path: '/',
      name: 'HomePage',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/Home/HomePage.vue')), 'HomePage');
      },
      beforeEnter: (to, from, next) => {
        setTitle('物主潮品租赁');
        store.commit('SELECTED_INDEX', { selectedIndex: 0 });
        next();
      }
    },
    {
      path: '/Mine/MinePage',
      name: 'MinePage',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/Mine/MinePage.vue')), 'MinePage');
      },
      beforeEnter: (to, from, next) => {
        store.commit('SELECTED_INDEX', { selectedIndex: 2 });
        setTitle('我的');
        next();
      }
    },
    {
      path: '/OrderSet/IDverify',
      name: 'IDverify',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/OrderSet/IDverify.vue')), 'IDverify');
      },
      beforeEnter: (to, from, next) => {
        setTitle('身份认证');
        next();
      }
    },
    {
      path: '/OrderSet/LivenessVerify',
      name: 'LivenessVerify',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/OrderSet/LivenessVerify.vue')), 'LivenessVerify');
      },
      beforeEnter: (to, from, next) => {
        setTitle('活体检测');
        next();
      }
    },
    {
      path: '/OrderSubmit/OrderSubmitPage',
      name: 'OrderSubmitPage',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/OrderSubmit/OrderSubmitPage.vue')), 'OrderSubmitPage');
      },
      beforeEnter: (to, from, next) => {
        setTitle('确认预约');
        next();
      }
    },
    {
      path: '/Shop/ShopPage',
      name: 'ShopPage',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/Shop/ShopPage.vue')), 'ShopPage');
      },
      beforeEnter: (to, from, next) => {
        setTitle('SL测试页面');
        next();
      }
    },
    {
      path: '/Shop/EmptyPage',
      name: 'EmptyPage',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/Shop/EmptyPage.vue')), 'EmptyPage');
      },
      beforeEnter: (to, from, next) => {
        setTitle('SL测试页面');
        next();
      }
    },
    {
      path: '/OrderSubmit/OrderSubSuccessPage',
      name: 'OrderSubSuccessPage',
      component: resolve => {
        require.ensure(
          [],
          () => resolve(require('@/components/OrderSubmit/OrderSubSuccessPage.vue')),
          'OrderSubSuccessPage'
        );
      },
      beforeEnter: (to, from, next) => {
        setTitle('订单提交成功');
        next();
      }
    },
    {
      path: '/LogisticsDetail/LogisticsDetail',
      name: 'LogisticsDetail',
      component: resolve => {
        require.ensure(
          [],
          () => resolve(require('@/components/LogisticsDetail/LogisticsDetail.vue')),
          'LogisticsDetail'
        );
      },
      beforeEnter: (to, from, next) => {
        setTitle('物流详情');
        next();
      }
    },
    {
      path: '/LogisticsDetail/Service',
      name: 'Service',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/LogisticsDetail/Service.vue')), 'Service');
      },
      beforeEnter: (to, from, next) => {
        setTitle('维修');
        next();
      }
    },
    {
      path: '/Pay/WXPayAgreement',
      name: 'WXPayAgreement',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/Pay/WXPayAgreement.vue')), 'WXPayAgreement');
      },
      beforeEnter: (to, from, next) => {
        setTitle('租赁协议');
        next();
      }
    },
    {
      path: '/Pay/WXPaying',
      name: 'WXPaying',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/Pay/WXPaying.vue')), 'WXPaying');
      },
      beforeEnter: (to, from, next) => {
        setTitle('首期支付');
        next();
      }
    },
    {
      path: '/Pay/WXPayCashing',
      name: 'WXPayCashing',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/Pay/WXPayCashing.vue')), 'WXPayCashing');
      },
      beforeEnter: (to, from, next) => {
        setTitle('收银台');
        next();
      }
    },
    {
      path: '/Pay/WXPaySuccess',
      name: 'WXPaySuccess',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/Pay/WXPaySuccess.vue')), 'WXPaySuccess');
      },
      beforeEnter: (to, from, next) => {
        setTitle('支付结果');
        next();
      }
    },
    {
      path: '/Pay/WXPayOverpaying',
      name: 'WXPayOverpaying',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/Pay/WXPayOverpaying.vue')), 'WXPayOverpaying');
      },
      beforeEnter: (to, from, next) => {
        setTitle('账单支付');
        next();
      }
    },
    {
      path: '/GoodsCategory/GoodsCategory',
      name: 'GoodsCategory',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/GoodsCategory/GoodsCategory.vue')), 'GoodsCategory');
      },
      beforeEnter: (to, from, next) => {
        store.commit('SELECTED_INDEX', { selectedIndex: 1 });
        setTitle('商品列表');
        next();
      }
    },
    {
      path: '/GoodsReturn/GoodsReturn',
      name: 'GoodsReturn',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/GoodsReturn/GoodsReturn.vue')), 'GoodsReturn');
      },
      beforeEnter: (to, from, next) => {
        setTitle('归还');
        next();
      }
    },
    {
      path: '/InviteAward/InviteAward',
      name: 'InviteAward',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/InviteAward/InviteAward.vue')), 'InviteAward');
      },
      beforeEnter: (to, from, next) => {
        setTitle('邀请好友');
        next();
      }
    },
    {
      path: '/InviteAward/InviteFriends',
      name: 'InviteFriends',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/InviteAward/InviteFriends.vue')), 'InviteFriends');
      },
      beforeEnter: (to, from, next) => {
        setTitle('邀请好友');
        next();
      }
    },
    {
      path: '/InviteAward/Withdraw',
      name: 'Withdraw',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/InviteAward/Withdraw.vue')), 'Withdraw');
      },
      beforeEnter: (to, from, next) => {
        setTitle('提现');
        next();
      }
    },
    {
      path: '/FeeItemSubView/RepaymentPlanScroller',
      name: 'RepaymentPlanScroller',
      component: resolve => {
        require.ensure(
          [],
          () => resolve(require('@/components/FeeItemSubView/RepaymentPlanScroller.vue')),
          'RepaymentPlanScroller'
        );
      },
      beforeEnter: (to, from, next) => {
        setTitle('测试插件');
        next();
      }
    },
    {
      path: '/InviteAward/WithdrawSuccess',
      name: 'WithdrawSuccess',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/InviteAward/WithdrawSuccess.vue')), 'WithdrawSuccess');
      },
      beforeEnter: (to, from, next) => {
        setTitle('申请成功');
        next();
      }
    },
    {
      path: '/Settings/Settings',
      name: 'Settings',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/Settings/Settings.vue')), 'Settings');
      },
      beforeEnter: (to, from, next) => {
        setTitle('设置');
        next();
      }
    },
    {
      path: '/Account/Account',
      name: 'Account',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/Account/Account.vue')), 'Account');
      },
      beforeEnter: (to, from, next) => {
        setTitle('我的账户');
        next();
      }
    },
    {
      path: '/Goods/GoodsDetailPage',
      name: 'GoodsDetailPage',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/Goods/GoodsDetailPage.vue')), 'GoodsDetailPage');
      },
      beforeEnter: (to, from, next) => {
        setTitle('商品详情');
        next();
      }
    },
    {
      path: '/ImageDetailScroller/ImageDetailScrollerPage',
      name: 'ImageDetailScrollerPage',
      component: resolve => {
        require.ensure(
          [],
          () => resolve(require('@/components/ImageDetailScroller/ImageDetailScrollerPage.vue')),
          'ImageDetailScrollerPage'
        );
      },
      beforeEnter: (to, from, next) => {
        setTitle('详情图预览');
        next();
      }
    },
    {
      path: '/OrderList/OrderListPage',
      name: 'OrderListPage',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/OrderList/OrderListPage.vue')), 'OrderListPage');
      },
      beforeEnter: (to, from, next) => {
        setTitle('订单列表');
        next();
      }
    },
    {
      path: '/About/About',
      name: 'About',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/About/About.vue')), 'About');
      },
      beforeEnter: (to, from, next) => {
        setTitle('关于');
        next();
      }
    },
    // {
    //   path: '/OrderDetail/OrderDetailPage',
    //   name: 'OrderDetailPage',
    //   component: resolve => {
    //     require.ensure([], () => resolve(require('@/components/OrderDetail/OrderDetailPage.vue')), 'OrderDetailPage');
    //   },
    //   beforeEnter: (to, from, next) => {
    //     setTitle('订单详情');
    //     next();
    //   }
    // },
    {
      path: '/OrderDetail/OrderDetailEmptyPage',
      name: 'OrderDetailEmptyPage',
      component: resolve => {
        require.ensure(
          [],
          () => resolve(require('@/components/OrderDetail/OrderDetailEmptyPage.vue')),
          'OrderDetailEmptyPage'
        );
      },
      beforeEnter: (to, from, next) => {
        setTitle('订单详情中间页面');
        next();
      }
    },
    {
      path: '/OrderDetail/OrderDetailNewPage',
      name: 'OrderDetailNewPage',
      component: resolve => {
        require.ensure(
          [],
          () => resolve(require('@/components/OrderDetail/OrderDetailNewPage.vue')),
          'OrderDetailNewPage'
        );
      },
      beforeEnter: (to, from, next) => {
        setTitle('订单详情');
        next();
      }
    },
    {
      path: '/Credit/Credit',
      name: 'Credit',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/Credit/Credit.vue')), 'Credit');
      },
      beforeEnter: (to, from, next) => {
        setTitle('信用认证');
        next();
      }
    },
    {
      path: '/Credit/JDCredit',
      name: 'JDCredit',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/Credit/JDCredit.vue')), 'JDCredit');
      },
      beforeEnter: (to, from, next) => {
        setTitle('京东小白信用');
        next();
      }
    },
    {
      path: '/Follow/Follow',
      name: 'Follow',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/Follow/Follow.vue')), 'Follow');
      },
      beforeEnter: (to, from, next) => {
        setTitle('关注物主');
        next();
      }
    },
    // 续租-确认订单
    {
      path: '/relet/confirmOrder/:orderNo',
      name: 'reletConfirmOrder',
      component: resolve => {
        require.ensure(
          [],
          () => resolve(require('@/components/reletConfirmOrder/reletConfirmOrder.vue')),
          'reletConfirmOrder'
        );
      },
      beforeEnter: (to, from, next) => {
        setTitle('续租-确认订单');
        next();
      }
    },
    // 买断
    {
      path: '/Buyout/Buyout',
      name: 'Buyout',
      component: resolve => {
        require.ensure([], () => resolve(require('@/components/Buyout/Buyout.vue')), 'Buyout');
      },
      beforeEnter: (to, from, next) => {
        setTitle('买断');
        next();
      }
    }
  ]
});
/**
 * 页面加载处理
 * 根据路由设置当前title
 * */
router.beforeEach(function(to, from, next) {
  clearSortStore(to.name, from.name);
  let url = window.location.href;
  url = url.substring(0, url.length - 2);
  let reg = /accessToken/;
  let state = reg.test(url);
  // let startJdCredit = sessionStorage.getItem('startJdCredit');
  // 2018-7-26 modify by hanfeng
  // 过滤掉从京东APP或京东金融App直接跳转到首页，如果是小白授权则不能过滤。另外修改xiaobaoPageName存储到sessionStorage
  // 2018-10-12 modify by hanfeng
  // 如果是小白信用授权后跳转，则进入xiaobaiPageName对应的页面
  let pageName = sessionStorage.getItem('xiaobaiPageName');
  sessionStorage.setItem('xiaobaiPageName', '');
  if (state && pageName) {
    let accessToken = url.split('accessToken=')[1];
    if (accessToken) {
      accessToken = accessToken.split('#')[0];
    } else {
      accessToken = '';
    }
    store.commit('JDaccessTokenMemory', { JDaccessToken: accessToken });
    localStorage.setItem('JDaccessToken', accessToken);

    window.location.href = pageName;
  } else {
    store.commit('updateLoadingStatus', { isLoading: true });
    next();
  }
});

router.afterEach(function(to, from) {
  // 支付宝生活号苹果手机导航栏不会改变，调用下列方法设置导航栏
  if (isAlipayLife()) {
    try {
      // eslint-disable-next-line
      ap.setNavigationBar(document.title);
    } catch (error) {
      console.log(error)
    }
  }

  document.body.scrollTop = document.documentElement.scrollTop = 0;
  let ele = document.getElementById('app');
  if (ele) {
    ele.scrollTop = 0;
  }
  store.commit('updateLoadingStatus', { isLoading: false });
  // console.log(window._paq);
  // console.log(document.title);
  // console.log(to);
  // console.log('*************************')
  // console.log('location.href = ' + location.href);
  // console.log('from path = ' + from.path);
  // console.log('to.path = ' + to.path);
  // console.log(location.href);
  // 追踪一个新页面
  let tmpStr = location.href.split('#');
  let tmpParamArr = tmpStr[1] && tmpStr[1].split('?');
  let tmpParam = ''
  // console.log('tmpParamArr = ' + tmpParamArr);
  // console.log('tmpParam = ' + tmpParam);
  if (tmpParamArr && tmpParamArr.length > 1) {
    tmpParam = '?' + tmpParamArr[1];
  }
  // let path = tmpStr[0] + '#' + tmpStr[1].replace(from.path, to.path);
  let path = tmpStr[0] + '#' + to.path + tmpParam;
  // console.log('test tmpStr = ' + tmpStr + ', path = ' + path);
  // console.log('*************************')
  let _paq = window._paq;
  if (_paq) {
    _paq.push(['setCustomUrl', path]);
    _paq.push(['setDocumentTitle', document.title])
    // 以下一行代码将一次浏览传输到Piwik：
    _paq.push(['trackPageView']);
  }
});

function setTitle(t) {
  document.title = t;
}
function clearSortStore(to) {
  if (to !== 'GoodsCategory' && to !== 'GoodsDetailPage') {
    store.commit('setTypeObj', { typeObj: {} });
    store.commit('typeNoMemory', { typeNo: '' });
  }
}

export default router;
