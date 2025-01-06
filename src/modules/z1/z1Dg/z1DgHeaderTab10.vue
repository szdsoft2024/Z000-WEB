<template>
  <div class="app-sub-container" style="margin-top: 0px; overflow: auto">
    <el-form class="app-el-form">
      <el-row>
        <szd-input-form-item-col label="业务单号" :span="8" v-model="objData.header1.bussDocId" disabled :descSpan="12" />
        <szd-input-form-item-col
          label="承担公司"
          :span="8"
          required
          :descSpan="12"
          :desc="objData.header1.cmpyExpName"
          v-model="objData.header1.cmpyExp"
          :disabled="SR.GH0"
          :show-help="!SR.GH0"
          @help="szdSh({ a: 'CORE_CMPY', b: objData.header1, c: ['cmpyExp-cmpy', 'cmpyExpName-cmpyName'] })" />
        <szd-input-form-item-col
          label="承担部门"
          :span="8"
          required
          :descSpan="12"
          :desc="objData.header1.cstcExpName"
          v-model="objData.header1.cstcExp"
          :disabled="SR.GH1"
          :show-help="!SR.GH1"
          @help="
            szdSh({ a: 'CORE_CSTC', b: objData.header1, c: ['cstcExp-cstc', 'cstcExpName-cstcName'], d: [['cmpy', objData.header1.cmpyExp]] })
          " />
      </el-row>
      <el-row>
        <szd-input-form-item-col
          label="业务人"
          :span="8"
          required
          :descSpan="12"
          :desc="objData.header1.userName"
          v-model="objData.header1.userId"
          :disabled="SR.GH1"
          :show-help="!SR.GH1"
          @help="szdSh({ a: 'CORE_USER', b: objData.header1, c: ['userId', 'userName'] })" />
        <szd-input-form-item-col
          label="业务类型"
          :span="8"
          required
          :descSpan="12"
          :desc="objData.header1.bstpName"
          v-model="objData.header1.bstp"
          disabled />
        <szd-input-form-item-col
          label="动态流程"
          :span="8"
          :descSpan="12"
          :desc="objData.header1.wfDyName"
          v-model="objData.header1.wfDyId"
          :disabled="objData.header.bussStatus != 'A'"
          :show-help="objData.header.bussStatus == 'A'"
          @help="
            szdSh({
              a: 'CORE_WFDY',
              b: objData.header,
              c: ['wfDyId', 'wfDyName'],
              d: [
                ['bstp', objData.header.bstp],
                ['userId', objData.header.userId]
              ]
            })
          " />
      </el-row>
      <el-row>
        <szd-date-form-item-col
          label="业务日期"
          :span="8"
          required
          :descSpan="12"
          v-model="objData.header1.bussDate"
          type="date"
          :disabled="SR.GH1" />
        <szd-select-form-item-col
          :span="8"
          label="币种"
          :descSpan="12"
          v-model="objData.header1.curr"
          baseField="CORE_CURR"
          :disabled="SR.GH1"
          required />
        <szd-select-form-item-col label="单据状态" :span="8" :descSpan="12" v-model="objData.header1.bussStatus" baseField="SEXP_DOC_STAU" disabled />
      </el-row>
      <el-row>
        <szd-input-form-item-col label="业务标题" :span="8" v-model="objData.header1.title" :maxlength="50" :disabled="SR.GH1" />
      </el-row>
      <el-row>
        <szd-textarea-form-item-col
          label="备注"
          :span="16"
          label-width="12.5%"
          v-model="objData.header1.remark"
          :disabled="SR.GH1"
          :maxlength="150"
          :rows="2" />
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: ["objData", "SR", "wfOper"],
    components: {
    },
    data() {
      return {};
    },
    methods: {
    }
  };
</script>
