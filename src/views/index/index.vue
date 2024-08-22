<template>
  <div class="index-container">
    <el-row :gutter="20">
      <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <el-card shadow="never">
          <div slot="header">
            <span>注册用户年龄段</span>
          </div>
          <vab-chart ref="chart" autoresize :option="ageGroup" />
          <div class="bottom">
            <span>用户数量: {{ ageGroupLength }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import VabChart from '@/plugins/echarts'
  import { dependencies, devDependencies } from '../../../package.json'
  import { calculateAge, ageGroupStatistics } from '@/utils'
  import { getUsers } from '@/api/userManage'

  export default {
    name: 'Index',
    components: {
      VabChart,
    },
    data() {
      return {
        timer: 0,
        updateTime: process.env.VUE_APP_UPDATE_TIME,
        nodeEnv: process.env.NODE_ENV,
        dependencies: dependencies,
        devDependencies: devDependencies,
        ageGroupLength: 0,
        ageGroup: {
          tooltip: {
            trigger: 'item',
          },
          color: ['#1890FF', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5'],
          backgroundColor: 'rgba(252,252,252,0)',
          grid: {
            top: '4%',
            left: '2%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
          },
          series: [
            {
              name: '用户年龄段',
              type: 'pie',
              radius: ['40%', '70%'],
              padAngle: 5,
              itemStyle: {
                borderRadius: 2,
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 16,
                  fontWeight: 'bold',
                },
              },
              data: [],
              smooth: true,
              areaStyle: {},
            },
          ],
        },
      }
    },
    created() {
      this.fetchData()
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    methods: {
      handleClick(e) {
        this.$baseMessage(`点击了${e.name},这里可以写跳转`)
      },
      handleZrClick() {},
      handleChangeTheme() {
        this.$baseEventBus.$emit('theme')
      },
      async fetchData() {
        const userRes = await getUsers({
          pageNo: 0,
          pageSize: 0,
          data: {},
        })
        this.ageGroupLength = userRes.data.length
        this.filterAgeGroup(userRes.data)
      },
      filterAgeGroup(data) {
        //映射出年龄集合
        let ageList = data.map((item) => calculateAge(item.userBirthday))
        //剔除非数字
        ageList = ageList.filter((age) => !isNaN(age))

        this.ageGroup.series[0].data = ageGroupStatistics(ageList)
      },
    },
  }
</script>
<style lang="scss" scoped>
  .index-container {
    padding: 0 !important;
    margin: 0 !important;
    background: #f5f7f8 !important;

    ::v-deep {
      .el-alert {
        padding: $base-padding;

        &--info.is-light {
          min-height: 82px;
          padding: $base-padding;
          margin-bottom: 15px;
          color: #909399;
          background-color: $base-color-white;
          border: 1px solid #ebeef5;
        }
      }

      .el-card__body {
        .echarts {
          width: 100%;
          height: 115px;
        }
      }
    }

    .card {
      ::v-deep {
        .el-card__body {
          .echarts {
            width: 100%;
            height: 305px;
          }
        }
      }
    }

    .bottom {
      padding-top: 20px;
      margin-top: 5px;
      color: #595959;
      text-align: left;
      border-top: 1px solid $base-border-color;
    }

    .table {
      width: 100%;
      color: #666;
      border-collapse: collapse;
      background-color: #fff;

      td {
        position: relative;
        min-height: 20px;
        padding: 9px 15px;
        font-size: 14px;
        line-height: 20px;
        border: 1px solid #e6e6e6;

        &:nth-child(odd) {
          width: 20%;
          text-align: right;
          background-color: #f7f7f7;
        }
      }
    }

    .icon-panel {
      height: 117px;
      text-align: center;
      cursor: pointer;

      svg {
        font-size: 40px;
      }

      p {
        margin-top: 10px;
      }
    }

    .bottom-btn {
      button {
        margin: 5px 10px 15px 0;
      }
    }
  }
</style>
