<template>
  <div class="app-container flex-y">
    <!-- 查询条件 -->
    <szd-sch-area :schLay="schLay" v-model="queryParams.ranges" @handleEvent="handleSeniorSearchEventImp" />
    <!-- 表单输出 -->
    <szd-table
      :layout="tableParams.layout"
      :toolbar="tableParams.toolbar"
      :fieldCat="tableParams.fieldCat"
      v-model:data="dataList"
      v-model:page="tableParams.page"
      @handleRequest="handleRequestImp"
      @handleEvent="handleEventImp"
      @handleRowEvent="handleRowEventImp"
      @selection-change="handleSelRow"
      row-key="cmpy"
      border
      stripe />
    <!-- 信息维护 -->
    <companyInfo ref="companyInfo" @updResult="updResult"></companyInfo>
  </div>
</template>

<script>
  import { listCompany, delCompany } from "../api/company.js";
  import companyInfo from "./companyInfo.vue";

  export default {
    components: {
      companyInfo
    },
    data() {
      return {
        //查询参数
        queryParams: {
          ranges: {
            cmpy: [],
            cmpyName: [],
            accSet: []
          }
        },
        schLay: {
          layout: { report: "CORE_MDM_01A", span: 8, more: 3 },
          schCat: [
            { field: "cmpy", label: "公司代码", type: "string", help: { a: "CORE_CMPY", c: "cmpy" }},
            { field: "cmpyName", label: "公司名称", type: "string" },
            { field: "accSet", label: "所属账套", type: "string", help: { a: "CORE_VCH_ACCS" } }
          ]
        },
        tableParams: {
          layout: { report: "Z000_MDM_01A", showSummary: false, merge: "0", selection: "2" },
          toolbar: {
            btns: [
              { fCode: "add", label: "新增", icon: "Plus" },
              { fCode: "del", label: "删除", icon: "Delete" }
            ]
          },
          fieldCat: [
            { field: "cmpy", label: "公司代码", minWidth: 120 },
            { field: "cmpyName", label: "公司名称", minWidth: 200 },
            { field: "cmpyNameShort", label: "公司简称", minWidth: 200 },
            { field: "accSetName", label: "账套", minWidth: 150 },
            {
              field: "opration",
              label: "操作",
              type: "button",
              fixed: "right",
              align: "center",
              ctrlParam: [
                { fCode: "edit", label: "修改", icon: "Edit", type: "link" },
                { fCode: "del", label: "删除", icon: "Delete", type: "link" }
              ],
              width: 150
            }
          ],
          // 分页
          page: {
            total: 0,
            pageNum: 1,
            pageSize: 20
          }
        },
        //数据列表
        dataList: [],
        //列表多选
        listSel: [],
        updParams: {
          option: "V", //C创建 U更改 V显示
          cmpy: ""
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      // 高级查询按钮回调
      handleSeniorSearchEventImp(obj) {
        switch (obj) {
          case "$search":
            this.getList();
            break;
        }
      },
      // 表格按钮回调
      handleEventImp(obj) {
        switch (obj.fCode) {
          case "add":
            this.handleAdd();
            break;
          case "del":
            this.handleDel();
            break;
        }
      },
      // 表格请求回调
      handleRequestImp(obj) {
        this.getList();
      },
      // 行回调
      handleRowEventImp(obj) {
        switch (obj.fCode) {
          case "edit":
            this.handleUpdRow(obj.row);
            break;
          case "del":
            this.handleDelRow(obj.row);
            break;
        }
      },
      //查询列表
      getList() {
        this.queryParams.pageNum = this.tableParams.page.pageNum;
        this.queryParams.pageSize = this.tableParams.page.pageSize;
        listCompany(this.queryParams).then(response => {
          if (response.code === 200) {
            this.dataList = response.rows;
            this.tableParams.page.total = response.total;
          }
        });
      },
      //新增
      handleAdd() {
        this.updParams.option = "C";
        this.updParams.cmpy = "";
        this.$refs.companyInfo.acceptData(this.updParams);
      },
      //修改
      handleUpdRow(row) {
        this.updParams.option = "U";
        this.updParams.cmpy = row.cmpy;
        this.$refs.companyInfo.acceptData(this.updParams);
      },
      //处理返回结果
      updResult(resultData) {
        if (resultData.retcode == "S") {
          this.getList();
        }
      },
      //多选行
      handleSelRow(selection) {
        this.listSel = selection;
      },
      //批量删除
      handleDel() {
        if (this.listSel.length == 0) {
          return this.$mW("请至少选择一行需要处理的数据");
        }
        let idArr = [];
        this.listSel.forEach((item, index) => {
          idArr.push(item.cmpy);
        });
        this.deletePross(idArr);
      },
      //单行删除
      handleDelRow(row) {
        let idArr = [];
        idArr.push(row.cmpy);
        this.deletePross(idArr);
      },
      //删除处理
      deletePross(idArr) {
        this.szdPopDel().then(() => {
          delCompany(idArr).then(res => {
            if (res.code === 200) {
              this.getList();
              this.$mS("删除成功");
            }
          });
        });
      },
      //刷新缓存
      handleRefreshCache() {
        refreshCache().then(res => {
          if (res.code === 200) {
            this.$mS("刷新成功");
            S;
          }
        });
      }
    }
  };
</script>
