<template>
  <div class="main-wf-app">
    <div class="main-wf-main">
      <div style="padding-bottom: 5px; display: flex">
        <!-- 工具栏 -->
        <szd-wf-button :routerCode="objData.routerCode" :wfOper="wfOper" :bussBase="objData.header" @submit="submitForm" @consume="wfConsume" />
      </div>
      <szd-tabs-wrap :top-height="SR.height_head" v-model:top="SR.SRH.Tab" v-model:bottom="SR.SRI.Tab">
        <template v-slot:top>
          <!-- 抬头 -->
          <z1DgHeader :objData="objData" :SR="SR" :wfOper="wfOper" />
        </template>
        <template v-slot:bottom>
          <!-- 项目信息 -->
          <z1DgItem ref="z1DgItem" :objData="objData" :SR="SR" :wfOper="wfOper" />
        </template>
      </szd-tabs-wrap>
    </div>
    <!-- 状态栏 -->
    <szd-foot-status v-model="footStatus" />
  </div>
</template>

<script>
  import { getApply, checkApply, saveApply } from "../api/z1.js";
  import z1DgHeader from "./z1DgHeader.vue";
  import z1DgItem from "./z1DgItem.vue";

  export default {
    name: "Z000_Z1_01A",
    components: {
      z1DgHeader,
      z1DgItem
    },
    data() {
      return {
        routerCode: "Z000_Z1_01A",
        wfOper: {},
        SR: {
          height_head: 280, //抬头高度
          SRH: {
            Tab: "Tab1",
            height: 0
          },
          SRI: {
            Tab: "Tab1",
            height: 0
          },
          GH0: false,
          GH1: false,
          GI1: false
        },
        objData: {
          header: {},
          header1: {},
          header2: {},
          config: {},
          itemList: [],
          routerCode: this.$route.name
        },
        footStatus: []
      };
    },

    created() {
      this.szdWf.getUrlParams(this.wfOper);
      if (!this.wfOper.bussId) {
        this.szdSh({
          a: "CORE_BSTP",
          b: this.objData.header,
          c: ["bstp", "bstpName", "wfDyId-wfId"],
          d: [["routerCode", this.objData.routerCode]],
          f: 1
        }).then(res => {
          const returnData = res.data;
          if (returnData && returnData.length > 0) {
            this.szdWf.init(this.objData.routerCode, this.objData.header.bstp).then(res => {
              this.wfOper = res;
              this.initDataDef();
            });
          } else {
            this.szdRouter.closeFrameTag();
          }
        });
      } else {
        this.getData();
      }
    },

    methods: {
      getData() {
        let json = {
          bussId: this.wfOper.bussId,
          userId: this.wfOper.userId,
          option: this.wfOper.option
        };
        // 获取数据
        getApply(json).then(response => {
          if (response.code === 200) {
            this.objData = response.data.data;
            //拆分header
            this.wfOper = response.data.wfOper;
            this.objData.header1 = response.data.data.header;
            this.objData.header2 = response.data.data.header;
            this.objData.config = response.data.wfOper.wfFst;
          }
          this.setStatus();
        });
      },

      //设置屏幕编辑状态
      setStatus() {
        this.SR.GH0 = false;
        this.SR.GH1 = false;
        this.SR.GI1 = false;
        if (this.wfOper.option == "V" || this.wfOper.wfBtn.btn_save != "U") {
          this.SR.GH0 = true;
          this.SR.GH1 = true;
          this.SR.GI1 = true;
        } else {
          if (!!this.wfOper.bussDocId) {
            this.SR.GH0 = true;
          }
        }
      },

      initDataDef() {
        const userData = this.$store.state.loginUser.user;
        this.objData.header = {
          bstp: this.objData.header.bstp,
          bstpName: this.objData.header.bstpName,
          userId: userData.userId,
          userName: userData.userName,
          bussDate: this.szdDate.getDay(),
          curr: "CNY",
          status: "0",
          bussStatus: "A",
          wfDyId: this.wfOper.wfDef.wfDyId,
          wfDyName: this.wfOper.wfDef.wfDyName,
          cmpyExp: userData.cmpy,
          cmpyNameExp: userData.cmpyName,
          cstcExp: userData.cstc,
          cstcNameExp: userData.cstcName,
          cmpyCreate: userData.cmpy,
          cmpyNameCreate: userData.cmpyName,
          cstcCreate: userData.cstc,
          cstcNameCreate: userData.cstcName
        };
        this.objData.header1 = this.objData.header;
        this.objData.header2 = this.objData.header;
        this.objData.config = this.wfOper.wfFst;
      },

      //消费记录
      wfConsume() {
        // 选择消费记录
        this.szdWf.consume(this.objData.header, this.objData.invList).then(res => {
          this.$refs.z1DgItem.szdWfConsume(res);
        });
      },

      //保存数据
      submitForm(wfEvt) {
        // 合并两个head
        this.mergeHeader();
        if (this.szdWf.btnCheck(wfEvt) || this.submitFormCheck()) {
          if (wfEvt.operate == "btn_check") {
            checkApply(this.objData, wfEvt).then(response => {
              if (response.status === "S") {
                this.$message.success(response.msg);
              } else if (response.status === "E") {
                this.$message.error(response.msg);
              } else if (response.status === "W") {
                this.szdMsgBox(response.data);
              }
            });
          } else {
            saveApply(this.objData, wfEvt).then(response => {
              if (response.code === 200) {
                this.wfOper.bussId = response.data.bussId;
                this.szdWf.retInfo(response.data).then(resRet => {
                  if (resRet) {
                    if (resRet !== true && resRet.nextUserId) {
                      wfEvt.nextUserId = resRet.nextUserId;
                      this.submitForm(wfEvt);
                    } else {
                      this.getData();
                    }
                  }
                });
              }
            });
          }
        }
      },

      mergeHeader() {
        this.objData.header = JSON.parse(JSON.stringify(this.objData.header1));
        this.objData.header.cmpyCreate = this.objData.header2.cmpyCreate;
        this.objData.header.cstcCreate = this.objData.header2.cstcCreate;
        this.objData.header.cmpyBuss = this.objData.header2.cmpyBuss;
        this.objData.header.cstcBuss = this.objData.header2.cstcBuss;
        this.objData.header.amtApply = this.objData.header2.amtApply;
      },

      //检查提交数据
      submitFormCheck() {
        // 检查抬头数据
        if (!this.submitFormCheckHead()) return false;
        // 检查项目数据
        if (!this.submitFormCheckItem()) return false;
        return true;
      },
      // 检查抬头数据
      submitFormCheckHead() {
        if (this.szdCheck.nullMsg$t(this.objData.header.cmpyExp, "承担公司不能为空")) return false;
        if (this.szdCheck.nullMsg$t(this.objData.header.cstcExp, "承担部门不能为空")) return false;
        if (this.szdCheck.nullMsg$t(this.objData.header.userId, "报账人不能为空")) return false;
        if (this.szdCheck.nullMsg$t(this.objData.header.bstp, "业务类型不能为空")) return false;
        if (this.szdCheck.nullMsg$t(this.objData.header.bussDate, "业务日期不能为空")) return false;
        if (this.szdCheck.nullMsg$t(this.objData.header.curr, "币种不能为空")) return false;
        return true;
      },
      // 检查项目数据
      submitFormCheckItem() {
        for (let i = 0; i < this.objData.itemList.length; i++) {
          if (this.szdCheck.nullMsg$t(this.objData.itemList[i].bsub, "项目信息-业务小类不能为空")) return false;
          if (this.szdCheck.nullMsg$t(this.objData.itemList[i].taxr, "项目信息-税率不能为空")) return false;
          if (this.szdCheck.nullMsg$t(this.objData.itemList[i].amtApply, "项目信息-金额(含税)不能为空")) return false;
        }
        return true;
      },

    }
  };
</script>
