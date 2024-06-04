<script setup>
import profile from '@/assets/images/profile.jpg'
const data = ref('123')
</script>
<template>
    <div>
        <el-input v-model="data"></el-input>
        <QRCodeView :data="data" :logo="profile"></QRCodeView>
    </div>
</template>