<script setup lang="ts">
import { FileManager } from "./lib";
</script>

<template>
  <div class="wrapper">
    <div class="inner">
      <FileManager mode="read" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .inner {
    width: 80%;
    height: 80%;
  }
}
</style>
