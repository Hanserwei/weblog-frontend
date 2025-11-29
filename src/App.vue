<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, zhCN, dateZhCN } from 'naive-ui'
</script>
<style lang="css" scoped>
/* 自定义顶部加载 Loading 颜色 */
#nprogress .bar {
  background: #409eff !important;
}
</style>
