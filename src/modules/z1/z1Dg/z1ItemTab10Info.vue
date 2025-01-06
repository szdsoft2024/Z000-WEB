<template>
  <!-- 信息维护对话框 -->
  <el-dialog :title="DG.title" v-model="DG.open" append-to-body :close-on-click-modal="false" class="app-dialog-container" align-center draggable>
    <div v-szd-dialog="['60%', 500]"></div>
    <el-form class="app-el-form">
      <el-row>
        <szd-input-form-item-col
          label="业务小类"
          :span="12"
          v-model="item.bsub"
          :disabled="SR.GI1"
          required
          :show-help="!SR.GI1"
          :descSpan="12"
          :desc="item.bsubName"
          @help="
            szdSh({
              a: 'CORE_BSUB01',
              b: item,
              c: ['bsub', 'bsubName'],
              d: [
                ['bstp', objData.header.bstp],
                ['structCode', 'sexpCostItem']
              ]
            })
          " />
      </el-row>
      <!-- 申请金额 -->
      <el-row>
        <el-col :span="12">
          <el-row>
            <szd-input-form-item-col
              label="金额(含税)"
              :span="15"
              label-width="40%"
              v-model="item.amtApply"
              required
              :disabled="SR.GI1"
              type="number"
              @change="handleChange('amtApply')"
              :numDot="true"
              :numDec="2" />
            <szd-input-form-item-col
              label="税额"
              :span="9"
              v-model="item.amtApplyTax"
              :disabled="SR.GI1"
              type="number"
              @change="handleChange('amtApplyTax')"
              :numDot="true"
              :numDec="2" />
          </el-row>
        </el-col>
        <szd-input-form-item-col
          label="金额(不含税)"
          :span="12"
          v-model="item.amtApplyNoTax"
          :descSpan="12"
          disabled
          type="number"
          @change="handleChange('amtApplyNoTax')"
          :numDot="true"
          :numDec="2" />
      </el-row>

      <el-row>
        <szd-input-form-item-col label="摘要" :span="12" v-model="item.summary" :disabled="SR.GI1" :maxlength="50" />
      </el-row>
      <el-row>
        <szd-input-form-item-col
          label="会计科目"
          :span="12"
          :descSpan="12"
          :desc="item.accsName"
          v-model="item.accs"
          :disabled="SR.GI1"
          :show-help="!SR.GI1"
          @help="szdSh({ a: 'CORE_ACCS', b: item, c: ['accs', 'accsName'] })" />
        <szd-select-form-item-col
          :span="12"
          label="特别总账标识"
          v-model="item.accSubjectFlag"
          :descSpan="12"
          clearable
          baseField="CORE_VCH_ACCGL"
          :disabled="SR.GI1" />
      </el-row>

      <el-row>
        <szd-input-form-item-col
          label="供应商"
          :span="12"
          v-model="item.supp"
          :disabled="SR.GI1"
          :show-help="!SR.GI1"
          :descSpan="12"
          :desc="item.suppName"
          @help="szdSh({ a: 'CORE_SUPP', b: item, c: ['supp', 'suppName'] })" />
        <szd-input-form-item-col
          label="客户"
          :span="12"
          v-model="item.cust"
          :disabled="SR.GI1"
          :show-help="!SR.GI1"
          :descSpan="12"
          :desc="item.custName"
          @help="szdSh({ a: 'CORE_CUST', b: item, c: ['cust', 'custName'] })" />
      </el-row>
      <el-row>
        <szd-input-form-item-col
          label="成本中心"
          :span="12"
          v-model="item.cstc"
          :disabled="SR.GI1"
          :show-help="!SR.GI1"
          :descSpan="12"
          :desc="item.cstcName"
          @help="szdSh({ a: 'CORE_CSTC', b: item, c: ['cstc', 'cstcName'] })" />
        <szd-input-form-item-col
          label="利润中心"
          :span="12"
          v-model="item.prfc"
          :disabled="SR.GI1"
          :show-help="!SR.GI1"
          :descSpan="12"
          :desc="item.prfcName"
          @help="szdSh({ a: 'CORE_PRFC', b: item, c: ['prfc', 'prfcName'] })" />
      </el-row>
      <el-row>
        <szd-input-form-item-col
          label="业务范围"
          :span="12"
          v-model="item.busc"
          :disabled="SR.GI1"
          :show-help="!SR.GI1"
          :descSpan="12"
          :desc="item.buscName"
          @help="szdSh({ a: 'CORE_BUSC', b: item, c: ['busc', 'buscName'] })" />
        <szd-input-form-item-col
          label="段"
          :span="12"
          v-model="item.segmentCode"
          :disabled="SR.GI1"
          :show-help="!SR.GI1"
          :descSpan="12"
          :desc="item.segmentName"
          @help="szdSh({ a: 'CORE_SEGM', b: item, c: ['segmentCode-segm', 'segmentName-segmName'] })" />
      </el-row>
      <el-row>
        <szd-textarea-form-item-col label="备注" :span="24" label-width="12.5%" v-model="item.remark" :disabled="SR.GH1" :maxlength="150" :rows="2" />
      </el-row>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="colseForm">关 闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
  export default {
    props: ["objData", "SR", "wfOper"],
    data() {
      return {
        DG: {
          title: "",
          open: false
        },
        item: {}
      };
    },
    methods: {
      //接受参数
      acceptData(itemParam) {
        console.log("调用", itemParam);
        this.DG.open = true;
        this.DG.title = "项目信息  行项目：" + itemParam.itemNo;
        this.item = itemParam;
      },
      handleChange(fname) {
        this.$emit("costItemChgRow", this.item, fname);
      },
      //关闭
      colseForm() {
        this.DG.open = false;
      }
    }
  };
</script>
