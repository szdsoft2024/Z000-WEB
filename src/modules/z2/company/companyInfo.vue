<template>
  <el-dialog
    :title="dg.title"
    v-model="dg.open"
    append-to-body
    :close-on-click-modal="false"
    @close="handleCloseForm"
    class="app-dialog-container"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="[500, 300]" />
    <el-form class="app-el-form">
      <el-row>
        <szd-input-form-item-col label="公司代码" v-model="objData.cmpy" :disabled="dg.option !== 'C'" required :span="24" :maxlength="10" />
        <szd-input-form-item-col label="公司名称" v-model="objData.cmpyName" required :span="24" :maxlength="128" />
        <szd-input-form-item-col label="公司简称" v-model="objData.cmpyNameShort" :span="24" :maxlength="64" />
        <szd-input-form-item-col
          label="所属账套"
          v-model="objData.accSet"
          showHelp
          @help="szdSh({ a: 'CORE_VCH_ACCS', b: objData, c: ['accSet-svalue', 'accSetName-sname'] })"
          required
          :span="24"
          :descSpan="12"
          :desc="objData.accSetName" />
      </el-row>
    </el-form>

    <template #footer>
      <szd-button label="保存" type="primary" @click="submitForm" />
      <szd-button label="关闭" type="primary" @click="closeForm" />
    </template>
  </el-dialog>
</template>
<script>
  import { getCompany, addCompany, updCompany } from "../api/company.js";

  export default {
    data() {
      return {
        dg: {
          title: "",
          open: false,
          option: "V", //C创建 U更改 V显示
          retcode: "", //返回码，S成功(刷新) Q或空取消操作 E 操作错误
          cmpy: ""
        },
        objData: {}
      };
    },
    methods: {
      //接受参数
      acceptData(infoParam) {
        this.initData();
        this.dg.option = infoParam.option;
        this.dg.cmpy = infoParam.cmpy;
        this.dg.retcode = "";
        if (this.dg.option !== "C") {
          this.getCompanyInfo();
        } else {
          this.dg.open = true;
        }
        this.getDesc();
      },
      //获取后台数据
      getCompanyInfo() {
        getCompany(this.dg.cmpy).then(response => {
          if (response.code === 200) {
            this.objData = response.data;
          }
          this.dg.open = true;
        });
      },
      //获取描述
      getDesc() {
        this.dg.title = this.szdTool.getTitle(this.dg.option) + this.$t("公司");
      },
      //保存数据
      submitForm() {
        if (this.submitFormCheck()) {
          if (this.dg.option === "C") {
            addCompany(this.objData).then(response => {
              if (response.code === 200) {
                this.$mS("新增数据成功");
                this.dg.cmpy = this.objData.cmpy;
                this.dg.option = "U";
                this.dg.retcode = "S";
                this.closeForm();
              }
            });
          } else {
            updCompany(this.objData).then(response => {
              if (response.code === 200) {
                this.$mS("修改数据成功");
                this.dg.retcode = "S";
                this.closeForm();
              }
            });
          }
        }
      },
      //检查提交数据
      submitFormCheck() {
        if (this.objData.cmpy === undefined || this.objData.cmpy.trim() === "") {
          this.$mE("公司代码不能为空");
          return false;
        }
        if (this.objData.cmpyName === undefined || this.objData.cmpyName.trim() === "") {
          this.$mE("公司名称不能为空");
          return false;
        }
        return true;
      },
      //关闭窗口
      closeForm() {
        this.dg.open = false;
      },
      handleCloseForm() {
        this.$emit("updResult", this.dg);
      },
      //初始化数据
      initData() {
        this.objData = {
          cmpy: "",
          cmpyName: "",
          cmpyNameShort: ""
        };
      }
    }
  };
</script>
