<template>
  <!-- 创建表 -->
  <el-dialog title="创建表" v-model="visible" width="1200px" top="5vh" append-to-body>
    <el-form label-width="120px">
      <el-form-item label="数据表名">
        <el-input v-model="tableConfig.name" placeholder="请输入数据表名"></el-input>
      </el-form-item>
      <el-form-item label="驱动类型">
        <el-select v-model="tableConfig.engine" placeholder="请选择驱动类型">
          <el-option label="InnoDB" value="InnoDB"></el-option>
          <!-- 可以添加更多选项 -->
        </el-select>
      </el-form-item>
      <el-form-item label="自增增量">
        <el-input-number
          v-model="tableConfig.autoIncrementStep"
          label="自增增量"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="数据表备注">
        <el-input v-model="tableConfig.comment" placeholder="请输入数据表备注"></el-input>
      </el-form-item>
      <el-form-item label="字段配置">
        <el-button type="text" @click="addField">添加字段</el-button>
        <el-table :data="fields" style="width: 100%" border>
          <el-table-column prop="name" label="字段名">
            <template #default="{ row, $index }">
              <el-input
                v-model="row.name"
                size="small"
                placeholder="请输入字段名"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="字段类型">
            <template #default="{ row, $index }">
              <!-- <el-input v-model="row.type" size="small" placeholder="请输入字段类型"></el-input> -->
              <el-autocomplete
                v-model="row.type"
                :fetch-suggestions="querySearch"
                clearable
                class="inline-input w-50"
                placeholder="请输入字段类型"
                @select="handleSelect"
              />
            </template>
          </el-table-column>
          <el-table-column prop="isNotNull" label="是否非空">
            <template #default="{ row, $index }">
              <el-switch v-model="row.isNotNull"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="isAutoIncrement" label="是否自增">
            <template #default="{ row, $index }">
              <el-switch v-model="row.isAutoIncrement"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="isPrimary" label="是否主键">
            <template #default="{ row, $index }">
              <el-switch v-model="row.isPrimary"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="comment" label="字段备注">
            <template #default="{ row, $index }">
              <el-input
                v-model="row.comment"
                size="small"
                placeholder="请输入字段备注"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template #default="{ row, $index }">
              <el-button type="text" @click="removeField($index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="handleCreateTable">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { createTable } from "@/api/tool/gen";
import { modal } from "@/plugins/index";
const emit = defineEmits(["ok"]);

// 遮罩层
const visible = ref(false);

// 表配置
const tableConfig = reactive({
  name: "",
  engine: "InnoDB",
  autoIncrementStep: 1,
  comment: "",
});

// 字段配置
const fields = ref([
  {
    name: "id",
    type: "bigint",
    isNotNull: true,
    isAutoIncrement: true,
    isPrimary: true,
    comment: "主键",
    defaultValue: "", // 添加默认值属性
  },
  {
    name: "create_by",
    type: "varchar(64)",
    isNotNull: false,
    isAutoIncrement: false,
    isPrimary: false,
    comment: "创建者",
    defaultValue: "''", // 添加默认值属性
  },
  {
    name: "create_time",
    type: "datetime",
    isNotNull: false,
    isAutoIncrement: false,
    isPrimary: false,
    comment: "创建时间",
    defaultValue: "", // 添加默认值属性
  },
  {
    name: "update_by",
    type: "varchar(64)",
    isNotNull: false,
    isAutoIncrement: false,
    isPrimary: false,
    comment: "更新者",
    defaultValue: "''", // 添加默认值属性
  },
  {
    name: "update_time",
    type: "datetime",
    isNotNull: false,
    isAutoIncrement: false,
    isPrimary: false,
    comment: "更新时间",
    defaultValue: "", // 添加默认值属性
  },
  {
    name: "remark",
    type: "varchar(500)",
    isNotNull: false,
    isAutoIncrement: false,
    isPrimary: false,
    comment: "备注",
    defaultValue: "null", // 添加默认值属性
  },
  {
    name: "",
    type: "",
    isNotNull: false,
    isAutoIncrement: false,
    isPrimary: false,
    comment: "",
  },
]);

// 动态添加字段
const addField = () => {
  fields.value.push({
    name: "",
    type: "",
    isNotNull: false,
    isAutoIncrement: false,
    isPrimary: false,
    comment: "",
  });
};

// 移除字段
const removeField = (index) => {
  fields.value.splice(index, 1);
};

/** 创建按钮操作 */
const handleCreateTable = () => {
  if (!tableConfig.name) {
    modal.msgError("请输入数据表名");
    return;
  }

  // 构造SQL语句
  let sql = `CREATE TABLE \`${tableConfig.name}\` (\n`;
  let primaryKey = "";
  fields.value.forEach((field, i) => {
    sql += `  \`${field.name}\` ${field.type}${field.isNotNull ? " NOT NULL" : ""}${
      field.isAutoIncrement ? " AUTO_INCREMENT" : ""
    }${field.isPrimary ? " PRIMARY KEY" : ""} COMMENT '${field.comment}'`;
    sql += i < fields.value.length - 1 ? ",\n" : "\n";
    if (field.isPrimary && !primaryKey) {
      primaryKey = field.name;
    }
  });

  if (!primaryKey && fields.value.some((field) => field.isPrimary)) {
    modal.msgError("多个主键定义，请检查字段配置");
    return;
  }

  sql += `) ENGINE=${tableConfig.engine} AUTO_INCREMENT=${
    tableConfig.autoIncrementStep + 1
  } COMMENT='${tableConfig.comment}';`;

  console.log(sql);
  createTable({ sql }).then((res) => {
    modal.msgSuccess(res.msg);
    if (res.code === 200) {
      visible.value = false;
      emit("ok");
    }
  });
};

// 显示弹框
const show = () => {
  visible.value = true;
};

defineExpose({ show });

//自动补全输入框
interface RestaurantItem {
  value: string;
}

const state1 = ref("");

const restaurants = ref<RestaurantItem[]>([]);
const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? restaurants.value.filter(createFilter(queryString))
    : restaurants.value;
  // call callback function to return suggestions
  cb(results);
};
const createFilter = (queryString: string) => {
  return (restaurant: RestaurantItem) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
  };
};
const loadAll = () => {
  return [
    { value: "bigint" },
    { value: "binary" },
    { value: "bit" },
    { value: "blob" },
    { value: "boolean" },
    { value: "char" },
    { value: "date" },
    { value: "datetime" },
    { value: "decimal" },
    { value: "double" },
    { value: "enum" },
    { value: "float" },
    { value: "geometry" },
    { value: "geography" },
    { value: "geometrycollection" },
    { value: "int" },
    { value: "integer" } /* int与integer可以视为相同 */,
    { value: "json" },
    { value: "longblob" },
    { value: "longtext" },
    { value: "linestring" },
    { value: "mediumblob" },
    { value: "mediumint" },
    { value: "mediumtext" },
    { value: "multilinestring" },
    { value: "multipolygon" },
    { value: "nchar" },
    { value: "numeric" },
    { value: "nvarchar" },
    { value: "point" },
    { value: "polygon" },
    { value: "real" },
    { value: "set" },
    { value: "smallint" },
    { value: "text" },
    { value: "time" },
    { value: "timestamp" },
    { value: "tinyblob" },
    { value: "tinyint" },
    { value: "tinytext" },
    { value: "varbinary" },
    { value: "varchar" },
    { value: "year" },
  ];
};

const handleSelect = (item: RestaurantItem) => {
  console.log(item);
};

onMounted(() => {
  restaurants.value = loadAll();
});
</script>
