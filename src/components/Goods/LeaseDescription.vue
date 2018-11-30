<template>
  <div class="lease-description">
    <section v-if="isShowAdvantage" class="description-item">
      <div class="advantage">
        <div class="item-title">租赁优势</div>
        <div class="item-con">
          <div class="adv-title">
            <span>{{ advTitle }}</span>
          </div>
          <div class="adv-compare-con clearfix">
            <div class="adv-compare compare-left">
              <div class="compare-txt"><span>{{ leftDay }}</span>天物主租金总额</div>
              <div class="compare-price">
                <span class="price">{{ leftPrice }}</span>
                <span class="unit">元</span>
              </div>
            </div>
            <div class="adv-vs">
              <span>vs</span>
            </div>
            <div class="adv-compare compare-right">
              <div class="compare-txt">全款购买</div>
              <div class="compare-price">
                <span class="price">{{ rightPrice }}</span>
                <span class="unit">元</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="description-item">
      <div class="maturity">
        <div class="item-title">到期可选择</div>
        <div class="item-con">
          <ul>
            <li>• 归还：快递上门取件寄回</li>
            <li>• 续租：到期可续租产品，续租专享租金优惠</li>
            <li>• 买断：仅需在已支付租金基础上，补齐商品签约价</li>
            <li>• 如是租完即送商品则到期免归还直接拥有</li>
          </ul>
        </div>
      </div>
    </section>
    <section class="description-item">
      <div class="process">
        <div class="item-title">租赁流程</div>
        <div class="item-con">
          <div class="bg-img"></div>
          <!-- <img class="process-bg" src="./process_bg.png" /> -->
          <!-- <div class="item-box">
            <span>1.选定商品</span>
          </div>
          <span class="box-arrow">></span> -->
        </div>
      </div>
    </section>
    <section class="description-item">
      <div class="rules">
        <div class="item-title">租期规则</div>
        <div class="item-con">
          <div class="rules-txt">租期计算规则：从签收的第二天开始计算租期，以租品寄回的前一天作为结束日<span>（以快递跟踪记录为准）</span></div>
          <div class="rules-sample">示例如下：（A同学计划 01 号收到快递，06号发快递寄回机器，因此他的租用行程为：02号起租-05号退租，租期4天）</div>
          <!-- <div class="rules-tip">
            <span class="tip-title">*Tip：</span>
            <span class="tip-txt">归还前请与客服确认物流方式及地址</span>
          </div> -->
          <div class="rules-img">
            <div class="bg-rules-img"></div>
            <!-- <img src="./rules_img.png" /> -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'LeaseDescription',
  props: {
    isShowAdvantage: {
      type: Boolean,
      default: true
    },
    advTitle: {
      type: String,
      default: '租赁 iPhone X 全新国行'
    },
    leftDay: {
      type: Number,
      default: 30
    },
    leftPrice: {
      type: Number,
      default: 400
    },
    rightPrice: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  mounted() {
  }
}
</script>

<style lang="less" rel="stylesheet/less">
@import './../../common/less/index';
.lease-description{
  font-family:PingFangSC-Regular;
  width: 100%;
  background-color: white;
  padding: 0px 24px;
  box-sizing: border-box;
  .description-item{
    padding: 24px 0px;
    .item-title{
      font-family: PingFangSC-Medium;
      color: rgb(17,17,17);
      color: rgba(17,17,17,1);
      font-size: 18px;
      line-height: 25px;
      font-weight: bold;
    }
    .item-con{
      margin-top: 16px;
    }
  }
  .advantage{
    .adv-title{
      height: 28px;
      line-height: 28px;
      background: rgb(247,247,247);
      background: rgba(247,247,247,1);
      text-align: center;
      span{
        font-size:14px;
        color: rgba(17,17,17,1);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
    }
    .adv-compare{
      width: 45%;
      .compare-txt{
        font-size: 12px;
        color: rgb(136,136,136);
        color: rgba(136,136,136,1);
        line-height: 17px;
        span{
          color: rgb(17,17,17);
          color: rgba(17,17,17,1);
          word-wrap: break-word;
        }
      }
      .compare-price{
        .price{
          font-size: 30px;
          font-family: PingFangSC-Light;
          color: rgb(255,71,84);
          color: rgba(255,71,84,1);
          line-height: 42px;
          word-wrap:break-word;
        }
        .unit{
          font-size: 20px;
          font-family: PingFangSC-Light;
          color: rgb(187,187,187);
          color: rgba(187,187,187,1);
          line-height: 42px;
        }
      }
    }
    .adv-vs{
      width:36px;
      height:36px;
      line-height: 36px;
      background: rgb(247,247,247);
      background: rgba(247,247,247,1);
      border-radius: 50%;
      text-align: center;
      margin: auto;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      span{
        font-size: 16px;
        font-family: PingFangSC-Medium;
        color: rgb(187,187,187);
        color: rgba(187,187,187,1);
      }
    }
    .adv-compare-con{
      position: relative;
      width: 100%;
      // height: 60px;
      margin-top: 10px;
      .compare-left{
        float: left;
      }
      .compare-right{
        float: right;
        .compare-txt{
          padding-left: 25px;
        }
        .compare-price{
          padding-left: 25px;
          .price{
            color: rgb(17,17,17);
            color: rgba(17,17,17,1);
          }
        }
      }
    }
  }
  .maturity{
    ul{
      li{
        font-size: 12px;
        color: rgb(17,17,17);
        color: rgba(17,17,17,1);
        line-height: 25px;
      }
    }
  }
  .process{
    .bg-img{
      width: 100%;
      min-height: 110px;
      height: auto;
      .bg('~./step');
    }
    .process-bg{
      display: block;
      margin: auto;
      width: 100%;
      max-width: 330px;
      height: auto;
    }
    .item-box{
      width: 96px;
      height: 44px;
      line-height: 44px;
      display: inline-block;
      background: rgb(245,245,245);
      background: rgba(245,245,245,1);
      border-radius: 4px;
      text-align: center;
      span{
        font-size: 14px;
        color: rgb(17,17,17);
        color: rgba(17,17,17,1);
      }
    }
    .box-arrow{
      color: rgb(238,238,238);
      color: rgba(238,238,238,1);
    }
  }
  .rules{
    .rules-txt{
      font-size: 14px;
      color: rgb(17,17,17);
      color: rgba(17,17,17,1);
      line-height: 21px;
      span{
        font-size: 11px;
      }
    }
    .rules-sample{
      margin-top: 19px;
      font-size: 12px;
      color: rgb(136,136,136);
      color: rgba(136,136,136,1);
      line-height: 18px;
    }
    .rules-tip{
      font-size: 12px;
      height: 33px;
      line-height: 33px;
      background: rgb(245,245,245);
      background: rgba(245,245,245,1);
      text-align: left;
      padding-left: 12px;
      margin-top: 16px;
      .tip-title{
        color: #FFBA00;
      }
      .tip-txt{
        color: rgb(17,17,17);
        color: rgba(17,17,17,1);
      }
    }
    .rules-img{
      margin-top: 16px;
      .bg-rules-img{
        width: 100%;
        min-height: 140px;
        height: auto;
        .bg('~./day');
      }
      img{
        display: block;
        margin: auto;
        width: 100%;
        max-width: 330px;
        height: auto;
      }
    }
  }
  @media screen and (max-width: 320px) {
    .advantage{
      .adv-compare-con{
        .compare-right{
          .compare-txt{
            padding-left: 21px;
          }
          .compare-price{
            padding-left: 21px;
            .price{
              font-size: 26px;
            }
          }
        }
      }
    }
    .process{
      .bg-img{
        min-height: 82px;
      }
    }
    .rules{
      .rules-img{
        .bg-rules-img{
          min-height: 130px;
        }
      }
    }
  }
}
</style>