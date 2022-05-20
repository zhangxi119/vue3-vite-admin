<template>
<!-- 报表管理 -->
  <div class="dashboard-main">
    <CommonTable ref="table" :table-config="tableConfig" :query-params='queryParams' :listKey="'list'">
      <template #header>
        <div class="add-view" style="text-align: right">
          <TableTitle title="审核任务" />
          <div class="addbtn"><el-button type="success" @click="addNew()">新 增</el-button></div>
        </div>
      </template>
      <template #evalDist="{ columuData }">
        <div>
          <span>{{ columuData.provinceName }}</span>
        </div>

      </template>
      <!-- <template #progress="{ columuData }">
        <div class="link-item">
            <el-progress :text-inside="true" :stroke-width="15" :percentage="Number(columuData.progressRate?columuData.progressRate:'0')" :status="columuData.progressRate=='100'?'success':''"></el-progress>
        </div>
      </template> -->
      <template #operation="{ columuData }">
        <div class="link-item">
          <el-link type="primary"  @click="edit(columuData)">编辑</el-link>
          <el-link type="primary" class="del"  @click="del(columuData)">删除</el-link>
          <!-- <el-link type="danger" class="del" @click="showIt(columuData)">处理明细</el-link> -->
        </div>
      </template>
    </CommonTable>
    <el-dialog :visible='visible' width='65%' :title="editTitle" @close='visible = false' :close-on-click-modal="false">
      <div>
        <el-form ref="dialogForm" :rules='formDataRule' :model='formData' label-width='140px' style='padding: 20px 40px 20px 0'>
          <el-row>
            <el-col :span='12'>
              <el-form-item label='执行频次' prop='dialog_01' >
                <el-select v-model='formData.dialog_01' placeholder="请选择执行频次">
                  <el-option v-for="(item, index) in MOCK_LIST" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label='启动日期' prop='dialog_02' >
                <el-date-picker
                  v-model="formData.dialog_02"
                  type="date"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label='规则分类' prop='dialog_03' >
                <el-select v-model='formData.dialog_03' placeholder="请选择规则分类">
                  <el-option v-for="(item, index) in MOCK_LIST" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label='审核规则' prop='dialog_04' >
                <el-select v-model='formData.dialog_04' placeholder="请选择审核规则">
                  <el-option v-for="(item, index) in MOCK_LIST" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label='数据审核开始日期' prop='dialog_05' >
                <el-date-picker
                  v-model="formData.dialog_05"
                  type="date"
                  placeholder="请选择开始日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label='数据审核结束日期' prop='dialog_06' >
                <el-date-picker
                  v-model="formData.dialog_06"
                  type="date"
                  placeholder="请选择结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label='区划' prop='dialog_07' >
                <el-select v-model='formData.dialog_07' placeholder="请选择区划">
                  <el-option v-for="(item, index) in MOCK_LIST" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label='承办机构' prop='dialog_08' >
                <el-select v-model='formData.dialog_08' placeholder="请选择承办机构">
                  <el-option v-for="(item, index) in MOCK_LIST" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label='服务机构' prop='dialog_09' >
                <el-select v-model='formData.dialog_08' placeholder="请选择服务机构">
                  <el-option v-for="(item, index) in MOCK_LIST" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div style='text-align: right'>
          <el-button @click='visible = false'>取 消</el-button>
          <el-button  @click='submitForm("dialogForm")' type='primary' :loading="submitLoading">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CommonTable from '@/components/CommonTable/index2.vue';
import TabsForm from '@/components/TabsForm/index.vue';
import { getTableList, getSelectList } from '@/api/index.js';
export default {
  name: 'Disease',
  components: {
    CommonTable,
    TabsForm
  },
  data() {
    const _this = this
    //报表状态
    const MOCK_LIST = []
    // const { data } = await getSelectList({})
    // data.list.forEach(item => {
    //   MOCK_LIST.push({
    //     label: item.codeName,
    //     value: item.code
    //   })
    // })
    // console.log(MOCK_LIST, '-------------mock_list');
    // getSelectList({field: 'MOCK_LIST'}).then(res => {
    //   console.log(res, '--------------------------------select')
    //   res.data.list.forEach(item => {
    //     MOCK_LIST.push({
    //       label: item.codeName,
    //       value: item.code
    //     })
    //   })
    // })
    return {
      MOCK_LIST,
      templateList: [],
      queryParams: {},
      tableConfig: {
        api: getTableList,
        columns: [
          {
            prop: 'param_01',
            label: '审核任务编号',
            width: '150px',
          },
          {
            prop: 'param_02',
            label: '执行频次',
            width: '80px',
          },
          {
            prop: 'param_03',
            label: '启动日期',
            width: '150px',
          },
          {
            prop: 'param_04',
            label: '规则分类',
            'show-overflow-tooltip': true,
            width: '150px',
          },
          {
            prop: 'param_05',
            label: '审核规则',
            width: '150px',
          },
          {
            prop: 'param_06',
            label: '数据审核开始日期',
            width: '150px',
          },
          {
            prop: 'param_07',
            label: '数据审核结束日期',
            width: '150px',
          },
          {
            prop: 'param_08',
            label: '区划',
            width: '150px',
          },
          {
            prop: 'param_09',
            label: '承办机构',
            width: '150px',
          },
          {
            prop: 'param_10',
            label: '服务机构',
            width: '150px',
          },
          {
            prop: 'param_11',
            label: '执行次数',
            width: '80px',
          },
          {
            // prop: "operation",
            slotName: 'operation',
            label: '操作',
            fixed: 'right',
            width:"150px"
          },
        ],
        hasForm: true,
        hasSelection: false,
        formConfig: {
          beforeSubmit(params) {
            return {
              ...params,
            };
          },
          schema: [
            {
              field: 'param_02',
              component: 'Select',
              label: '区划',
              componentProps: {
                clearable: true,
                options: [],
                placeholder: '请选择区划',
              },
            },
            {
              field: 'param_01',
              component: 'Select',
              label: '承办机构',
              componentProps: {
                clearable: true,
                options: [],
                placeholder: '请选择承办机构',
              },
            },
            {
              field: 'param_04',
              component: 'Select',
              label: '规则分类',
              componentProps: {
                clearable: true,
                options: [],
                placeholder: '请选择规则分类',
              },
            },
            {
              field: 'param_08',
              component: 'Select',
              label: '审核规则',
              componentProps: {
                clearable: true,
                options: [],
                placeholder: '请选择审核规则',
              },
            },
            {
              field: 'param_09',
              component: 'Select',
              label: '服务机构',
              componentProps: {
                clearable: true,
                options: [],
                placeholder: '请选择服务机构',
              },
            },
            {
              field: 'param_10',
              component: 'DatePicker',
              label: '启动日期',
              componentProps: {
                clearable: true,
                placeholder: '请选择启动日期',
              },
            },
          ],
        },
        hasIndex: true,
      },
      // 弹框显隐标识
      editTitle: '新增',
      visible: false,
      submitLoading: false,
      // 弹框表单
      formData: {
        dialog_01: '',
        dialog_02: '',
        dialog_03: '',
        dialog_04: '',
        dialog_05: '',
        dialog_06: '',
        dialog_07: '',
        dialog_08: '',
        dialog_09: '',
      },
      // 弹框表单验证
      formDataRule: {
        dialog_01: [
          {required: true , message: '请选择'}
        ],
        dialog_02: [
          {required: true , message: '请选择'}
        ],
        dialog_03: [
          {required: true , message: '请选择'}
        ],
        dialog_04: [
          {required: true , message: '请选择'}
        ],
        dialog_05: [
          {required: true , message: '请选择'}
        ],
        dialog_06: [
          {required: true , message: '请选择'}
        ],
        dialog_07: [
          {required: true , message: '请选择'}
        ],
        dialog_08: [
          {required: true , message: '请选择'}
        ],
      },
    };
  },
  computed: {},
  created() {
    this.height = window.innerHeight * 0.7
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.initSelect()
  },
  mounted() {

  },
  methods: {
    // 初始化下拉数据
    async initSelect() {
      const { data } = await getSelectList({})
      const list = data.list.map(item => {
        return {
          label: item.codeName,
          value: item.code
        }
      })
      this.tableConfig.formConfig.schema.forEach(item => {
        if (item.component === 'Select') {
          item.componentProps.options = list
        }
      });
    },
    // 添加报表
    addNew() {
      this.visible = true
      this.editTitle = '新增'
      for( let key in this.formData) {
        this.formData[key] = ''
      }
      this.$nextTick(() => {
        this.$refs.dialogForm.clearValidate()
      })
    },
    // 编辑
    edit(item) {
      this.editTitle = '编辑';
      this.visible = true;
      for( let key in this.formData) {
        this.formData[key] = item[key]
      }

      // this.$nextTick(()=>{
      //   this.$refs.form.clearValidate()
      // })
    },
    // 删除
    del(item) {
      ElMessageBox.confirm(
        '是否删除该条报表?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          this.getTableList(item.rid)
        })
        .catch(() => {})
      // this.$confirm('是否删除该条报表?', '提示', {
      //     confirmButtonText: '确 定',
      //     cancelButtonText: '取 消',
      //     type: 'warning',}
      //   })
      //   .then(() => {
      //     this.getDictByField1Mock(item.rid)
      //   })
      //   .catch(() => {
      //   });
    },

    // 显示sql详情
    showSqlDetail(item) {
      console.log(item)
      this.sqlVisible = true;
      this.sqlDetail = item.rptQurySql;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          const params = Object.assign(this.formData)
          // 新增
          if (this.editTitle == '新增') {
            getTableList(params).then((res)=>{
              if(res.code==0){
                this.$message.success(res.message)
                this.submitLoading = false;
                this.visible = false
                this.$refs.table.getTableData()
              } else {
                this.submitLoading = false;
                this.$message.warning(res.message)
              }
            })
          } else { // 编辑
            getTableList(params).then((res)=>{
              if(res.code==0){
                this.$message.success(res.message)
                this.submitLoading = false;
                this.visible = false
                this.$refs.table.getTableData()
              } else {
                this.submitLoading = false;
                this.$message.warning(res.message)
              }
            })
          }
        } else {
          return false;
        }

      });
    },
    getDictByField1Mock(rid) {
      getTableList({rid}).then((res)=>{
        if(res.code==0){
          this.$message.success(res.message)
          this.$refs.table.getTableData()
        } else {
          this.$message.warning(res.message)
        }
      })
    }
  },
};
</script>

<style lang="scss">
@import '@/style/commonTable.scss';
.dashboard-main{
  height: 100%;
}
</style>
