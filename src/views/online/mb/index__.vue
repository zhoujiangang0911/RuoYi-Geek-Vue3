<script setup>
import sqlInput from '@/views/online/mb/sql-input.vue'
const text = ref(`
SELECT
COUNT(enter_id) AS count,
#{depIdL} as deptId

<if test="type == 'voluntary_class'">
,voluntary_class
</if>

FROM enter_voluntary
WHERE dept_id IN (
 SELECT dept_id FROM sys_dept WHERE find_in_set(#{depIdL}, ancestors)
)
GROUP BY

<if test="type == 'voluntary_class'">
voluntary_class
</if>

UNION ALL

SELECT
COUNT(enter_id) AS count,
#{depIdR} as deptId
<if test="type == 'voluntary_class'">
,voluntary_class
</if>
FROM enter_voluntary
WHERE dept_id IN (
  SELECT dept_id FROM sys_dept WHERE find_in_set(#{depIdR}, ancestors)
)
GROUP BY
<if test="type == 'voluntary_class'">
voluntary_class
</if>;
`)
const texts = ref([])
const htmls = ref([])
const length = ref(0)
const htmlBox = ref(null)
const textBox = ref(null)
function change(value) {
    texts.value = value.texts
    htmls.value = value.htmls
    length.value = value.length
    console.log(value);
    textBox.value.scrollTop = value.scrollTop
    textBox.value.scrollLeft = value.scrollLeft
    htmlBox.value.scrollTop = value.scrollTop
    htmlBox.value.scrollLeft = value.scrollLeft
}
</script>
<template>
    <div>
        <el-row>
            <el-col :span="8">
                <sql-input v-model="text" @change="change" height="600px"></sql-input>
            </el-col>
            <el-col :span="8">
                <div class="debugBox" ref="textBox">
                    <el-row v-for="index in length" :key="index">
                        <el-col :span="1">{{ index }}</el-col>
                        <el-col :span="23">
                            <div style='min-height: 1em;' :key="index" v-text="texts[index - 1]"></div>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="debugBox sql-show" ref="htmlBox">
                    <el-row v-for="index in length" :key="index">
                        <el-col :span="1">{{ index }}</el-col>
                        <el-col :span="23">
                            <div style='min-height: 1em;' v-html="htmls[index - 1]"></div>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<style lang="scss" scoped>
.debugBox {
    border: 1px solid black;
    height: 500px;
    font-size: 18px;
    height: 600px;
    overflow: auto;
    font-size: 18px;
    line-height: 1em;
    font-family: 'Microsoft YaHei';
    white-space: nowrap;
}

:deep(.sql-show) {
    .code-if {
        color: green;
    }

    .code-sql {
        color: aqua;
    }

    .code-params {
        color: bisque;
    }

}
</style>