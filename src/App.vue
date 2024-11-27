<script setup lang="ts">
// import { FileManager } from "../dist/file-manager.es.js";
import { FileManager } from "./lib";

const handleFileSelect = (fileList: any) => {
  console.log(fileList);
};
</script>

<template>
  <div class="wrapper">
    <div class="inner">
      <FileManager
        @file-select="handleFileSelect"
        action="/basic-api"
        :content-height="600"
      />
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
