<template>
  <div class="app-sub-container szd__tb__wrapper" style="margin-top: 0px">
    <!-- 功能按钮 -->
    <div class="main-table-title">
      <div class="main-table-title-left" style="width: 50%">
        <div>项目信息</div>
      </div>
      <div class="main-table-title-right" style="width: 50%">
        <el-button :disabled="SR.GI1" type="primary" link @click="addRow" icon="Plus">新增</el-button>
        <el-button :disabled="SR.GI1" type="primary" link @click="delRow" icon="Delete">删除</el-button>
      </div>
    </div>
    <!-- 表格输出 -->
    <el-table ref="refTable" border stripe :data="objData.itemList" @selection-change="handleSelRow" class="flex-1">
      <el-table-column align="center" type="selection" width="40" fixed="left" />
      <el-table-column label="行项目" prop="itemNo" min-width="60" align="center" fixed="left">
        <template v-slot="scope">
          <el-button type="primary" link @click="handleUpdRow(scope.row)">{{ scope.row.itemNo }}</el-button>
        </template>
      </el-table-column>
      <!-- 业务小类 -->
      <el-table-column v-if="!listCtrl.bsub" label="业务小类" prop="bsub" min-width="250">
        <template v-slot:header><span class="main-required">*</span>业务小类</template>
        <template v-slot="scope">
          <szd-input-form-item-col
            :span="24"
            :descSpan="12"
            v-model="scope.row.bsub"
            :desc="scope.row.bsubName"
            :disabled="SR.GI1"
            :show-help="!SR.GH1"
            @help="
              szdSh({
                a: 'CORE_BSUB01',
                b: scope.row,
                c: ['bsub', 'bsubName'],
                d: [
                  ['bstp', objData.header.bstp],
                  ['structCode', moduleName]
                ]
              })
            " />
        </template>
      </el-table-column>
      <el-table-column v-if="!listCtrl.taxr" label="税率" prop="taxr" min-width="80">
        <template v-slot:header><span class="main-required">*</span>税率</template>
        <template v-slot="scope">
          <szd-select
            valFirst="true"
            v-model="scope.row.taxr"
            baseField="CORE_TAXR"
            :clearable="false"
            noSval="true"
            @change="handleChangeTaxRate(scope.row)"
            :disabled="SR.GI1" />
        </template>
      </el-table-column>
      <!-- 申请金额 -->
      <el-table-column v-if="!listCtrl.amtApply" prop="amtApply" label="金额(含税)" min-width="120" align="right">
        <template v-slot:header><span class="main-required">*</span>金额(含税)</template>
        <template v-slot="scope">
          <szd-input
            type="number"
            v-model="scope.row.amtApply"
            numDot
            :numDec="2"
            :numMax="100000000000"
            :numMin="-100000000000"
            :disabled="SR.GI1"
            @change="handleChangeAmtApply(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column v-if="!listCtrl.amtApplyTax" prop="amtApplyTax" label="税额" min-width="120" align="right">
        <template v-slot="scope">
          <szd-input
            type="number"
            v-model="scope.row.amtApplyTax"
            numDot
            :numDec="2"
            :numMax="100000000000"
            :numMin="-100000000000"
            :disabled="SR.GI1"
            @change="handleChangeAmtApplyTax(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column v-if="!listCtrl.amtApplyNoTax" prop="amtApplyNoTax" label="金额(不含税)" min-width="120" align="right">
        <template v-slot="scope">
          <szd-input type="number" v-model="scope.row.amtApplyNoTax" numDot :numDec="2" disabled />
        </template>
      </el-table-column>
      <!-- 摘要 -->
      <el-table-column v-if="!listCtrl.summary" label="摘要" prop="summary" min-width="150">
        <template v-slot="scope">
          <el-input v-model="scope.row.summary" maxlength="150" :disabled="SR.GI1" />
        </template>
      </el-table-column>
      <!-- 会计科目 -->
      <el-table-column v-if="!listCtrl.accs" label="会计科目" prop="accs" min-width="250">
        <template v-slot="scope">
          <el-row>
            <el-col :span="10">
              <el-input v-model="scope.row.accs" :disabled="SR.GI1">
                <template #suffix>
                  <el-icon v-if="!SR.GI1" @click="szdSh({ a: 'CORE_ACCS', b: scope.row, c: ['accs', 'accsName'] })">
                    <Search />
                  </el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="14">
              <szd-desc v-model="scope.row.accsName" />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 特别总账标识 -->
      <el-table-column v-if="!listCtrl.accSubjectFlag" label="特别总账标识" prop="accSubjectFlag" min-width="120">
        <template v-slot="scope">
          <szd-select v-model="scope.row.accSubjectFlag" baseField="CORE_VCH_ACCGL" :disabled="SR.GI1" />
        </template>
      </el-table-column>

      <!-- 供应商 -->
      <el-table-column v-if="!listCtrl.supp" label="供应商" prop="supp" min-width="250">
        <template v-slot="scope">
          <el-row>
            <el-col :span="10">
              <el-input v-model="scope.row.supp" :disabled="SR.GI1">
                <template #suffix>
                  <el-icon v-if="!SR.GI1" @click="szdSh({ a: 'CORE_SUPP', b: scope.row, c: ['supp', 'suppName'] })">
                    <Search />
                  </el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="14">
              <szd-desc v-model="scope.row.suppName" />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 客户 -->
      <el-table-column v-if="!listCtrl.cust" label="客户" prop="cust" min-width="250">
        <template v-slot="scope">
          <el-row>
            <el-col :span="10">
              <el-input v-model="scope.row.cust" :disabled="SR.GI1">
                <template #suffix>
                  <el-icon v-if="!SR.GI1" @click="szdSh({ a: 'CORE_CUST', b: scope.row, c: ['cust', 'custName'] })">
                    <Search />
                  </el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="14">
              <szd-desc v-model="scope.row.custName" />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 成本中心 -->
      <el-table-column v-if="!listCtrl.cstc" label="成本中心" prop="cstc" min-width="250">
        <template v-slot="scope">
          <el-row>
            <el-col :span="10">
              <el-input v-model="scope.row.cstc" :disabled="SR.GI1">
                <template #suffix>
                  <el-icon v-if="!SR.GI1" @click="szdSh({ a: 'CORE_CSTC', b: scope.row, c: ['cstc', 'cstcName'] })">
                    <Search />
                  </el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="14">
              <szd-desc v-model="scope.row.cstcName" />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 利润中心 -->
      <el-table-column v-if="!listCtrl.prfc" label="利润中心" prop="prfc" min-width="250">
        <template v-slot="scope">
          <el-row>
            <el-col :span="10">
              <el-input v-model="scope.row.prfc" :disabled="SR.GI1">
                <template #suffix>
                  <el-icon v-if="!SR.GI1" @click="szdSh({ a: 'CORE_PRFC', b: scope.row, c: ['prfc', 'prfcName'] })">
                    <Search />
                  </el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="14">
              <szd-desc v-model="scope.row.prfcName" />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 业务范围 -->
      <el-table-column v-if="!listCtrl.busc" label="业务范围" prop="busc" min-width="250">
        <template v-slot="scope">
          <el-row>
            <el-col :span="10">
              <el-input v-model="scope.row.busc" :disabled="SR.GI1">
                <template #suffix>
                  <el-icon v-if="!SR.GI1" @click="szdSh({ a: 'CORE_BUSC', b: scope.row, c: ['busc', 'buscName'] })">
                    <Search />
                  </el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="14">
              <szd-desc v-model="scope.row.buscName" />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 段 -->
      <el-table-column v-if="!listCtrl.segmentCode" label="段" prop="segmentCode" min-width="250">
        <template v-slot="scope">
          <el-row>
            <el-col :span="10">
              <el-input v-model="scope.row.segmentCode" :disabled="SR.GI1">
                <template #suffix>
                  <el-icon v-if="!SR.GI1" @click="szdSh({ a: 'CORE_SEGM', b: scope.row, c: ['segmentCode-segm', 'segmentName-segmName'] })">
                    <Search />
                  </el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="14">
              <szd-desc v-model="scope.row.segmentName" />
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column v-if="!listCtrl.remark" prop="remark" label="备注" min-width="150">
        <template v-slot="scope">
          <el-input v-model="scope.row.remark" maxlength="150" :disabled="SR.GI1" />
        </template>
      </el-table-column>
      <el-table-column v-if="!listCtrl.invNo" prop="remark" label="发票号码" min-width="150">
        <template v-slot="scope">
          <el-input v-model="scope.row.invNo" maxlength="32" :disabled="SR.GI1" />
        </template>
      </el-table-column>
      <el-table-column v-if="!listCtrl.invCode" prop="remark" label="发票代码" min-width="150">
        <template v-slot="scope">
          <el-input v-model="scope.row.invCode" maxlength="32" :disabled="SR.GI1" />
        </template>
      </el-table-column>

    </el-table>
    <z1ItemTab10Info :objData="objData" :SR="SR" :wfOper="wfOper" ref="z1ItemTab10Info" @itemChgRow="itemChgRow" />
  </div>
</template>
<script>
  import z1ItemTab10Info from "./z1ItemTab10Info.vue";

  export default {
    props: ["objData", "SR", "wfOper"],
    components: {
      z1ItemTab10Info
    },
    data() {
      return {
        listSel: [],
        listCtrl: {},
        moduleName: "z000_item"
      };
    },
    methods: {
      addRow() {
        let itemNo_max = this.getMaxItemNo();
        itemNo_max = itemNo_max + 1;
        let item = {
          itemNo: itemNo_max,
          amtApply: 0,
          amtApplyTax: 0,
          amtApplyNoTax: 0,
        };
        this.setBsub(item);
        this.objData.itemList.push(item);
        this.$emit("updChgRow", "FCalcAmt");
      },
      // 设置默认小类
      setBsub(item) {
        if (this.objData.defaultBsub) {
          let bsub = this.objData.defaultBsub.find(e => {
            return e.structCode == this.moduleName;
          });
          if (bsub) {
            item.bsub = bsub.bsub;
          }
        }
      },
      // 计算最大行号
      getMaxItemNo() {
        let itemNo_max = 0;
        if (this.objData.itemList != undefined && this.objData.itemList != null && this.objData.itemList.length > 0) {
          for (let i = 0; i < this.objData.itemList.length; i++) {
            if (itemNo_max < this.toNum(this.objData.itemList[i].itemNo)) {
              itemNo_max = this.toNum(this.objData.itemList[i].itemNo);
            }
          }
        }
        return itemNo_max;
      },
      //附加消费记录-项目信息
      appendAitem(wfSelData) {
        if (wfSelData.invImgSel) {
          let itemNo_max = this.getMaxItemNo();
          let error = "";
          for (let i = 0; i < wfSelData.invImgSel.length; i++) {
            let inv = this.objData.itemList.find(e => {
              return e.invCode == wfSelData.invImgSel[i].invCode && e.invNo == wfSelData.invImgSel[i].invNo;
            });
            if (!inv) {
              itemNo_max = itemNo_max + 1;
              wfSelData.invImgSel[i]["itemNo"] = itemNo_max;
              // this.objData.itemList.push(wfSelData.invImgSel[i]);
              // 发票字段转换业务字段
              let bussItem = this.convertInvToBuss(wfSelData.invImgSel[i]);
              this.objData.itemList.push(bussItem);
            } else {
              error = error + "发票代码为：" + wfSelData.invImgSel[i].invCode + "发票号码为：" + wfSelData.invImgSel[i].invNo + "、";
            }
          }
          if (error) {
            this.$message.warning(error.substring(0, error.length - 1) + "的发票重复,未添加成功");
          }
          this.$emit("updChgRow", "FCalcAmt");
        }
        if (wfSelData.invFolSel) {
          let itemNo_max = this.getMaxItemNo();
          let error = "";
          for (let i = 0; i < wfSelData.invFolSel.length; i++) {
            let inv = this.objData.itemList.find(e => {
              return e.invCode == wfSelData.invFolSel[i].invCode && e.invNo == wfSelData.invFolSel[i].invNo;
            });
            if (!inv) {
              itemNo_max = itemNo_max + 1;
              wfSelData.invFolSel[i]["itemNo"] = itemNo_max;
              // this.objData.itemList.push(wfSelData.invFolSel[i]);
              // 发票字段转换业务字段
              let bussItem = this.convertInvToBuss(wfSelData.invFolSel[i]);
              this.objData.itemList.push(bussItem);
            } else {
              error = error + "发票代码为：" + wfSelData.invFolSel[i].invCode + "发票号码为：" + wfSelData.invFolSel[i].invNo + "、";
            }
          }
          if (error) {
            this.$message.warning(error.substring(0, error.length - 1) + "的发票重复,未添加成功");
          }
          this.$emit("updChgRow", "FCalcAmt");
        }
      },
      delRow() {
        if (this.listSel.length === 0) {
          return this.$mW("请至少选择一行需要处理的数据");
        }
        this.objData.itemList = this.objData.itemList.filter(item => !this.listSel.some(ele => ele === item));
        this.$emit("updChgRow", "FCalcAmt");
      },
      handleSelRow(selection) {
        this.listSel = selection;
      },
      handleUpdRow(row) {
        this.$refs.z1ItemTab10Info.acceptData(row);
      },
      // 更新
      itemChgRow(row, fname) {
        switch (fname) {
          case "taxr":
            this.handleChangeTaxRate(row);
            break;
          case "amtApply":
            this.handleChangeAmtApply(row);
            break;
          case "amtApplyTax":
            this.handleChangeAmtApplyTax(row);
            break;
        }
      },
      // 初始化金额
      initAmt(row) {
        row.amtApply = this.toNum(row.amtApply);
        row.amtApplyTax = this.toNum(row.amtApplyTax);
      },
      // 申请金额
      handleChangeTaxRate(row) {
        this.initAmt(row);
        row.amtApplyTax = this.toNum(this.szdCalc.taxInc(row.amtApply, row.taxr));
        this.calcSumRow(row);
      },
      handleChangeAmtApply(row) {
        this.initAmt(row);
        row.amtApplyTax = this.toNum(this.szdCalc.taxInc(row.amtApply, row.taxr));
        this.calcSumRow(row);
      },
      handleChangeAmtApplyTax(row) {
        this.initAmt(row);
        this.calcSumRow(row);
      },
      calcSumRow(row) {
        row.amtApplyNoTax = this.toNum(row.amtApply) - this.toNum(row.amtApplyTax);
        this.$emit("updChgRow", "FCalcAmt");
      },
      toNum(num) {
        if (!num || isNaN(num)) {
          return 0;
        }
        return Number(num);
      },
      // 消费记录字段转换业务字段
      convertInvToBuss(inv) {
        let bussItem = {};
        bussItem.itemNo = inv.itemNo;
        bussItem.bsub = inv.bsub;
        bussItem.amtApply = inv.invAmt;
        bussItem.amtApplyTax = inv.invAmtTax;
        bussItem.amtApplyNoTax = inv.invAmtNoTax;
        bussItem.invNo = inv.invNo;
        bussItem.invCode = inv.invCode;
        return bussItem;
      },
    }
  };
</script>
