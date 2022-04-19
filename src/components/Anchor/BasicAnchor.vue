<template>
  <div>
    <div style=" float: right;width: 160px">
      <n-anchor
        id="tea"
        :top="88"
        :bound="200"
        :offset-target="testref"
        affix
        ignore-gap
        :show-background="showBackground"
      >
        <n-anchor-link title="演示" href="#演示">
          <n-anchor-link title="基础用法" href="#basic" />
          <n-anchor-link title="忽略间隔" href="#ignore-gap" />
          <n-anchor-link title="固定" href="#affix" />
          <n-anchor-link title="滚动到" href="#scrollto" />
        </n-anchor-link>
        <n-anchor-link title="Props" href="#Props" />
      </n-anchor>
    </div>
    <div>
      <div style="position: fixed">
        <h1 id="test">Header</h1>
      </div>
      <div ref="testref">
        <div id="basic">
          <p>basic</p>
          <Form></Form>
        </div>
        <div id="ignore-gap">
          <p>ignore-gap</p>
          <Form></Form>
        </div>
        <div id="affix">
          <p>affix</p>
          <Form></Form>
        </div>
        <div id="scrollto">
          <p>scrollto</p>
          <Form></Form>
        </div>
        <div id="Props">
          <p>Props</p>
          <Form></Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue'
import Form from './test/Form.vue'
const testref = ref(null)
const showRail = ref(true)
const showBackground = ref(true)
</script>
