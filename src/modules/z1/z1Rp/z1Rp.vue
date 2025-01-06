<template>
  <div class="app-container szd__tb__wrapper">
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
      row-key="bussId"
      border
      stripe/>
  </div>
</template>

<script>
  import { listApply } from "../api/z1.js";

  export default {
    name: "Z000_Z1_01B",
    data() {
      return {
        routerCodeDg: "Z000_Z1_01A",
        //查询参数
        queryParams: {
          ranges: {
            cmpy: [],
            cstc: [],
            userId: [],
            bussDate: [],
            bstp: [],
            status: []
          }
        },
        schLay: {
          layout: { report: "Z000_Z1_01B", span: 8, more: 3 },
          schCat: [
            { field: "cmpyExp", label: "承担公司", type: "string", help: { a: "CORE_CMPY", c: "cmpy" } },
            { field: "cstcExp", label: "承担部门", type: "string", help: { a: "CORE_CSTC", c: "cstc" } },
            { field: "userId", label: "报账人", type: "string", help: { a: "CORE_USER", c: "userId" } },
            { field: "bussDate", label: "业务日期", type: "date" },
            { field: "bstp", label: "业务类型", type: "string", help: { a: "CORE_BSTP", c: "bstp" } },
            { field: "bussStatus", label: "单据状态", type: "string", help: { a: "SEXP_DOC_STAU" } }
          ]
        },
        tableParams: {
          layout: { report: "Z000_Z1_01B", showSummary: true, selection: "2", optionCell: "optionCell" },
          toolbar: {
            btns: [
              { fCode: "add", label: "新增", icon: "Plus" },
            ]
          },
          fieldCat: [
            { field: "bussDocId", label: "业务单号", minWidth: 150 },
            { field: "cmpyExpName", label: "承担公司", minWidth: 200 },
            { field: "cstcExpName", label: "承担部门", minWidth: 180 },
            { field: "userId", label: "报账人", minWidth: 120 },
            { field: "bstp", label: "业务类型", minWidth: 200 },
            { field: "bussDate", label: "业务日期", minWidth: 100 },
            { field: "bussStatus", label: "单据状态", minWidth: 120 },
            { field: "createBy", label: "制单人", minWidth: 120 },
            { field: "createTime", label: "制单时间", minWidth: 130 },
            { field: "updateBy", label: "更改人", minWidth: 120 },
            { field: "updateTime", label: "更改时间", minWidth: 130 },
            { field: "bussId", label: "业务ID", minWidth: 150 },
            {
              field: "opration",
              label: "操作",
              type: "button",
              fixed: "right",
              align: "center",
              minWidth: 120,
              ctrlParam: [
                { fCode: "view", label: "显示", icon: "View" },
                { fCode: "edit", label: "修改", icon: "Edit" }
              ]
            }
          ],
          // 分页
          page: {
            total: 0,
            pageNum: 1,
            pageSize: 20
          }
        },
        dataList: [],
        listSel: []
      }
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
        }
      },
      // 表格请求回调
      handleRequestImp(obj) {
        this.getList();
      },
      // 行回调
      handleRowEventImp(obj) {
        switch (obj.fCode) {
          case "view":
            this.handleUpdRow(obj.row, "V");
            break;
          case "edit":
            this.handleUpdRow(obj.row, "U");
            break;
        }
      },
      //查询列表
      getList() {
        this.queryParams.pageNum = this.tableParams.page.pageNum;
        this.queryParams.pageSize = this.tableParams.page.pageSize;
        listApply(this.queryParams).then(response => {
          if (response.code === 200) {
            this.dataList = response.rows;
            this.tableParams.page.total = response.total;
          }
        });
      },
      //新增
      handleAdd() {
        const userData = this.$store.state.loginUser.user;
        this.szdWf.goDoc(this.routerCodeDg, "", userData.userId, "C");
      },
      //修改
      handleUpdRow(rowData, option) {
        const userData = this.$store.state.loginUser.user;
        this.szdWf.goDoc(rowData.routerCode, rowData.bussId, userData.userId, option);
      },
      handleSelRow(selection) {
        this.listSel = selection;
      },
    }
  };
</script>
