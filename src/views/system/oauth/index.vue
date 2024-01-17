<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="第三方系统的唯一ID" prop="uuid">
        <el-input
          v-model="queryParams.uuid"
          placeholder="请输入第三方系统的唯一ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="第三方用户来源" prop="source">
        <el-input
          v-model="queryParams.source"
          placeholder="请输入第三方用户来源"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:oauth:add']"
        >新增</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:oauth:edit']"
        >修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:oauth:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:oauth:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="oauthList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="第三方系统的唯一ID" align="center" prop="uuid" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="第三方用户来源" align="center" prop="source" />
      <el-table-column label="用户的授权令牌" align="center" prop="accessToken" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:oauth:edit']"
          >修改</el-button> -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:oauth:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改第三方认证对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="第三方系统的唯一ID" prop="uuid">
          <el-input v-model="form.uuid" placeholder="请输入第三方系统的唯一ID" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="第三方用户来源" prop="source">
          <el-input v-model="form.source" placeholder="请输入第三方用户来源" />
        </el-form-item>
        <el-form-item label="用户的授权令牌" prop="accessToken">
          <el-input v-model="form.accessToken" placeholder="请输入用户的授权令牌" />
        </el-form-item>
        <el-form-item label="第三方用户的授权令牌的有效期，部分平台可能没有" prop="expireIn">
          <el-input v-model="form.expireIn" placeholder="请输入第三方用户的授权令牌的有效期，部分平台可能没有" />
        </el-form-item>
        <el-form-item label="刷新令牌，部分平台可能没有" prop="refreshToken">
          <el-input v-model="form.refreshToken" placeholder="请输入刷新令牌，部分平台可能没有" />
        </el-form-item>
        <el-form-item label="第三方用户的 open id，部分平台可能没有" prop="openId">
          <el-input v-model="form.openId" placeholder="请输入第三方用户的 open id，部分平台可能没有" />
        </el-form-item>
        <el-form-item label="第三方用户的 ID，部分平台可能没有" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入第三方用户的 ID，部分平台可能没有" />
        </el-form-item>
        <el-form-item label="个别平台的授权信息，部分平台可能没有" prop="accessCode">
          <el-input v-model="form.accessCode" placeholder="请输入个别平台的授权信息，部分平台可能没有" />
        </el-form-item>
        <el-form-item label="第三方用户的 union id，部分平台可能没有" prop="unionId">
          <el-input v-model="form.unionId" placeholder="请输入第三方用户的 union id，部分平台可能没有" />
        </el-form-item>
        <el-form-item label="第三方用户授予的权限，部分平台可能没有" prop="scope">
          <el-input v-model="form.scope" placeholder="请输入第三方用户授予的权限，部分平台可能没有" />
        </el-form-item>
        <el-form-item label="id token，部分平台可能没有" prop="idToken">
          <el-input v-model="form.idToken" placeholder="请输入id token，部分平台可能没有" />
        </el-form-item>
        <el-form-item label="小米平台用户的附带属性，部分平台可能没有" prop="macAlgorithm">
          <el-input v-model="form.macAlgorithm" placeholder="请输入小米平台用户的附带属性，部分平台可能没有" />
        </el-form-item>
        <el-form-item label="小米平台用户的附带属性，部分平台可能没有" prop="macKey">
          <el-input v-model="form.macKey" placeholder="请输入小米平台用户的附带属性，部分平台可能没有" />
        </el-form-item>
        <el-form-item label="用户的授权code，部分平台可能没有" prop="code">
          <el-input v-model="form.code" placeholder="请输入用户的授权code，部分平台可能没有" />
        </el-form-item>
        <el-form-item label="Twitter平台用户的附带属性，部分平台可能没有" prop="oauthToken">
          <el-input v-model="form.oauthToken" placeholder="请输入Twitter平台用户的附带属性，部分平台可能没有" />
        </el-form-item>
        <el-form-item label="Twitter平台用户的附带属性，部分平台可能没有" prop="oauthTokenSecret">
          <el-input v-model="form.oauthTokenSecret" placeholder="请输入Twitter平台用户的附带属性，部分平台可能没有" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOauth, getOauth, delOauth, addOauth, updateOauth } from "@/api/system/oauth";

export default {
  name: "Oauth",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 第三方认证表格数据
      oauthList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uuid: null,
        userId: null,
        source: null,
        accessToken: null,
        expireIn: null,
        refreshToken: null,
        openId: null,
        uid: null,
        accessCode: null,
        unionId: null,
        scope: null,
        tokenType: null,
        idToken: null,
        macAlgorithm: null,
        macKey: null,
        code: null,
        oauthToken: null,
        oauthTokenSecret: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        uuid: [
          { required: true, message: "第三方系统的唯一ID不能为空", trigger: "blur" }
        ],
        userId: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        source: [
          { required: true, message: "第三方用户来源不能为空", trigger: "blur" }
        ],
        accessToken: [
          { required: true, message: "用户的授权令牌不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询第三方认证列表 */
    getList() {
      this.loading = true;
      listOauth(this.queryParams).then(response => {
        this.oauthList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        uuid: null,
        userId: null,
        source: null,
        accessToken: null,
        expireIn: null,
        refreshToken: null,
        openId: null,
        uid: null,
        accessCode: null,
        unionId: null,
        scope: null,
        tokenType: null,
        idToken: null,
        macAlgorithm: null,
        macKey: null,
        code: null,
        oauthToken: null,
        oauthTokenSecret: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加第三方认证";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOauth(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改第三方认证";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOauth(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOauth(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除第三方认证编号为"' + ids + '"的数据项？').then(function() {
        return delOauth(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/oauth/export', {
        ...this.queryParams
      }, `oauth_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
