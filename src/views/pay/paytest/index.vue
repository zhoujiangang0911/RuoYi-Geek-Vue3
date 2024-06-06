<script setup>
import profile from '@/assets/images/profile.jpg'
const data = ref('123')
</script>
<template>
    <div class="app-container">
        <el-row>
            <el-col :span="12">
                <el-form>
                    <el-form-item label="支付链接">
                        <el-input v-model="data"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="12">
                <QRCodeView :data="data" :logo="profile"></QRCodeView>
            </el-col>
        </el-row>
    </div>
</template>