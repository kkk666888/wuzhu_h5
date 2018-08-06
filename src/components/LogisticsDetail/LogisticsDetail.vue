<template>
  <div class="LogisticsDetail">
    <div class="logistics-header">
      <div class="info-wrapper">
        <div class="right-wrapper">
          <span class="title">订单编号</span><span class="f14 text-indent">{{orderNo}}</span><br>
          <span class="title">物流公司</span><span class="f14 text-indent">{{company}}</span><br>
          <span class="title">物流单号</span><span class="f14 text-indent">{{deliveryOrderNo}}</span>
          <span class="text-right" >{{orderStatus}}</span>
          <!--<span v-show="deliveryOrderNo" class="text-right copyBtn" :data-clipboard-text=deliveryOrderNo>复制单号</span>-->
        </div>
      </div>
    </div>
    <div class="logistics-content">
      <div class="content-wrapper">
        <ul>
          <li class="item-list" v-for="item in routeInfo">
            <div class="item-left">
              <span class="day">{{item.day}}</span>
              <span class="times">{{item.times}}</span>
            </div>
            <div class="item-right">
              <div class="timeline-wrapper">
                <span class="icon-danxuan icon iconfont"></span>
                <div class="item-timeline"></div>
              </div>
              <p>{{item.address}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'LogisticsDetail',
    data() {
      return {
        company: '', // 物流公司
        orderNo: this.$store.state.orderNo || '', // 可以直接从传来的参数取
        orderStatus: '', // 物流状态
        routeInfo: [], // 物流详情
        deliveryOrderNo: '' // 物流单号
      }
    },
    created() {
      this.getRouteInfo()
      /* 复制功能 */
      /* eslint-disable */
//      var clipboard = new Clipboard('.copyBtn').on('success', function(e) {
//        var e = e || window.event
//      }).on('error', function(e) {
//        console.log(e)
//      })
    },
    methods: {
      getRouteInfo() {
       let params = this.$store.state.orderNo
        // let params = '00120180514000000367685747'
        this.$http.get('/wuzhu/route/getRouteInfo?orderNo=' + params).then(res => {
          if (res.code === '00' && res.data) {
            this.company = res.data.expressCompanyName
            this.orderNo = res.data.orderNo
            this.orderStatus = res.data.routStatusDesc
            this.deliveryOrderNo = res.data.deliveryOrderNo
            this.routeInfo = res.data.routeTraceList
//            this.routeInfo = res.data.routeTraceList.reverse()
          } else {
            console.log(`没有数据～`)
          }
        })
      }
    },
    components: {
    }
  }
</script>

<style lang="less">
  @import '../../common/less/index.less';
  .LogisticsDetail {
    .logistics-header{
      padding: 20px;
      background: #fff;
      .avatar{
        display: inline-block;
        margin-left: 10px;
        margin-bottom: 10px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 1px solid #eee;
        overflow: hidden;
      }
      .info-wrapper{
        .right-wrapper{
          position: relative;
          .title{
            display: inline-block;
            line-height: 16px;
            font-size: 14px;
            color: #888;
          }
          .text-right{
            position: absolute;
            bottom: 2px;
            right: 0;
            font-size: 12px;
            line-height: 16px;
            color: #5C99F4;
          }
        }
        .text-indent{
          display: inline-block;
          line-height: 16px;
          text-indent: 10px;
        }
        .f14{
          font-size: 14px;
        }
        .p-a{
          position: absolute;
          top: 10px;
          right: 15px;
        }
      }
    }
    .logistics-content{
      margin-top: 11px;
      padding-top: 20px;
      background: #fff;
      .content-wrapper{
        padding: 0 20px;
        .item-list{
          display: flex;
          min-height: 70px;
          .item-left{
            flex: 0 0 60px;
            width: 60px;
          }
          .item-right{
            display: flex;
            position: relative;
            .timeline-wrapper{
              flex: 0 0 25px;
              width: 25px;
            }
            .icon-danxuan{
              margin-right: 8px;
              color: #ddd;
            }
            .item-timeline{
              position: absolute;
              content: '';
              height: 80%;
              width: 1px;
              left: 7px;
              top: 19px;
              background: #ddd;
            }
            p{
              flex: 1;
              display: inline-block;
              font-size: 14px;
            }
          }
          .day, .times{
            display: block;
          }
          .day{
            font-size: 16px;
            font-weight: 500;
          }
          .times{
            font-size: 12px;
          }
          &:last-child{
            .item-timeline{
              display: none;
            }
          }
          &:first-child{
            z-index: 333;
            p{
              color: #47CC5E;
            }
            .icon-danxuan{
              margin-right: 8px;
              color: #47CC5E;
            }
          }
        }
      }
    }
  }
</style>
