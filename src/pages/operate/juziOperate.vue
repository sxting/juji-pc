<template>
    <div>
        <a-card title="桔子总计" style="margin-top:20px">
            <a-row style="margin: 0 -12px">
                <a-col :sm="24" :md="12" :xl="6" style="padding: 12px 12px 24px;">
                    <a-card title="待消耗桔子" style="margin-top:20px">
                        11111
                    </a-card>
                </a-col>
                <a-col :sm="24" :md="12" :xl="6" style="padding: 12px 12px 24px;">
                    <a-card title="已消耗桔子" style="margin-top:20px">
                        11111
                    </a-card>
                </a-col>
                <a-col :sm="24" :md="12" :xl="6" style="padding: 12px 12px 24px;">
                    <a-card title="已失效桔子" style="margin-top:20px">
                        11111
                    </a-card>
                </a-col>
                <a-col :sm="24" :md="12" :xl="6" style="padding: 12px 12px 24px;">
                    <a-card title="总计已发放桔子" style="margin-top:20px">
                        11111
                    </a-card>
                </a-col>
            </a-row>
        </a-card>

        <a-card title="桔子发放" style="margin-top:20px">
            <a-row style="margin: 0 -12px">
                <div class="extra-wrap">
                    <div class="extra-item">
                        <a>今日</a>
                        <a>本周</a>
                        <a>本月</a>
                        <a>本年</a>
                    </div>
                    <a-range-picker :style="{width: '256px'}"></a-range-picker>
                </div>
                <a-col :sm="24" :md="12" :xl="6" style="padding: 12px 12px 24px;">
                    <a-card title="支付送桔子" style="margin-top:20px">
                        11111
                    </a-card>
                </a-col>
                <a-col :sm="24" :md="12" :xl="6" style="padding: 12px 12px 24px;">
                    <a-card title="分享得桔子" style="margin-top:20px">
                        11111
                    </a-card>
                </a-col>
                <a-col :sm="24" :md="12" :xl="6" style="padding: 12px 12px 24px;">
                    <a-card title="签到送桔子" style="margin-top:20px">
                        11111
                    </a-card>
                </a-col>
                <a-col :sm="24" :md="12" :xl="6" style="padding: 12px 12px 24px;">
                    <a-card title="评价得桔子" style="margin-top:20px">
                        11111
                    </a-card>
                </a-col>
            </a-row>
            <div id="mountNode"></div>

        </a-card>

        <a-card title="桔子消耗" style="margin-top:20px">
            <div class="extra-wrap">
                <div class="extra-item">
                    <a>今日</a>
                    <a>本周</a>
                    <a>本月</a>
                    <a>本年</a>
                </div>
                <a-range-picker :style="{width: '256px'}"></a-range-picker>
            </div>
            <div id="mountNode2"></div>
        </a-card>
    </div>

</template>

<script>
import StandardTable from "../../components/table/StandardTable";
import ChartCard from "../../components/card/ChartCard";
import MiniArea from "../../components/chart/MiniArea";
import MiniBar from "../../components/chart/MiniBar";
import MiniProgress from "../../components/chart/MiniProgress";
import Bar from "../../components/chart/Bar";
import RankingList from "../../components/chart/RankingList";
import HotSearch from "../../components/analysis/HotSearch";
import SalesData from "../../components/analysis/SalesData";
import Trend from "../../components/chart/Trend";
export default {
  name: "juziOperate",
  components: {
    StandardTable,
    Trend,
    SalesData,
    HotSearch,
    RankingList,
    Bar,
    MiniProgress,
    MiniBar,
    MiniArea,
    ChartCard
  },
  data() {
    return {
      mountNode: "mountNode",
      mountNode2:'mountNode2',
      chart: null
    };
  },
  mounted: function() {
    this.chartFun(this.mountNode);
    this.chartFun(this.mountNode2);
    
  },
  beforeUpdate: function() {
    this.chartFun();
  },
  watch: {
    charData: function(val, oldVal) {
      // 监听charData，当放生变化时，触发这个回调函数绘制图表
      console.log("new: %s, old: %s", val, oldVal);
      this.chartFun(this.mountNode);
      this.chartFun(this.mountNode2);
    }
  },
  methods: {
    chartFun(mountNode) {
      var data = [
        {
          year: "1991",
          value: 3
        },
        {
          year: "1992",
          value: 4
        },
        {
          year: "1993",
          value: 3.5
        },
        {
          year: "1994",
          value: 5
        },
        {
          year: "1995",
          value: 4.9
        },
        {
          year: "1996",
          value: 6
        },
        {
          year: "1997",
          value: 7
        },
        {
          year: "1998",
          value: 9
        },
        {
          year: "1999",
          value: 13
        }
      ];
      this.char = new this.G2.Chart({
        container: document.getElementById(mountNode),
        forceFit: true,
        height: 400
      });
      this.char.source(data);
      this.char.scale("value", {
        min: 0
      });
      this.char.scale("year", {
        range: [0, 1]
      });
      this.char.tooltip({
        crosshairs: {
          type: "line"
        }
      });
      this.char.line().position("year*value");
      this.char
        .point()
        .position("year*value")
        .size(1)
        .shape("circle")
        .style({
          stroke: "#fff",
          lineWidth: 1
        });
      this.char.render();
      console.log(1);
    }
  }
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
.extra-wrap {
}
.extra-item {
  display: inline-block;
  margin-right: 24px;
  a {
    margin-left: 24px;
  }
}
#mountNode {
  height: 400px;
}
</style>
