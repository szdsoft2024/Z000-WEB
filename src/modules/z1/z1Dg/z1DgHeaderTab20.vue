<template>
  <div class="app-sub-container" style="margin-top: 0px; overflow: auto">
    <el-form class="app-el-form">
      <el-row>
        <szd-input-form-item-col
          label="制单人公司"
          :span="8"
          :descSpan="12"
          :desc="objData.header2.cmpyCreateName"
          v-model="objData.header2.cmpyCreate"
          disabled />

        <szd-input-form-item-col
          label="制单人部门"
          :span="8"
          :descSpan="12"
          :desc="objData.header2.cstcCreateName"
          v-model="objData.header2.cstcCreate"
          disabled />
        <szd-input-form-item-col label="付款单号" :span="8" v-model="objData.header2.wfSapPayDoc" disabled />
      </el-row>
      <el-row>
        <szd-input-form-item-col
          label="业务发生公司"
          :span="8"
          :descSpan="12"
          :desc="objData.header2.cmpyBussName"
          v-model="objData.header2.cmpyBuss"
          :disabled="SR.GH1"
          :show-help="!SR.GH1"
          @help="szdSh({ a: 'CORE_CMPY', b: objData.header2, c: ['cmpyBuss-cmpy', 'cmpyBussName-cmpyName'] })" />

        <szd-input-form-item-col
          label="业务发生部门"
          :span="8"
          :descSpan="12"
          :desc="objData.header2.cstcBussName"
          v-model="objData.header2.cstcBuss"
          :disabled="SR.GH1"
          :show-help="!SR.GH1"
          @help="szdSh({ a: 'CORE_CSTC', b: objData.header2, c: ['cstcBuss-cstc', 'cstcBussName-cstcName'], d: [['cmpy', objData.header2.cmpyBuss]] }) " />
          <szd-input-form-item-col
            label="申请金额"
            :span="8"
            v-model="objData.header2.amtApply"
            disabled
            type="number"
            :numDot="true"
            :numDec="2" />
      </el-row>

    </el-form>
  </div>
</template>
<script>
  export default {
    props: ["objData", "SR", "wfOper"],
    data() {
      return {};
    },
    methods: {}
  };
</script>
