<script setup lang="ts">
import { App, Flex } from 'ant-design-vue'
import { Sender, Bubble } from 'ant-design-x-vue'
import { UserOutlined } from '@ant-design/icons-vue'
import { ref, h } from 'vue'
import { requestService } from '../services/ai'
import type { CSSProperties } from 'vue'

const value = ref('开启文档显示离线用户头像')
const loading = ref<boolean>(false)
const { message } = App.useApp()
const submit = async () => {
  reset()
  bubble.value.push({
    content: value.value,
    placement: 'end',
    avatar: {
      icon: h(UserOutlined),
      style: barAvatar,
    },
  })
  loading.value = true
  const result = await requestService(value.value)
  loading.value = false
  if (result.final_answer) {
    bubble.value.push({
      content: result.final_answer,
      placement: 'start',
      avatar: {
        icon: h(UserOutlined),
        style: fooAvatar,
      },
    })
  }
}

const fooAvatar: CSSProperties = {
  color: '#f56a00',
  backgroundColor: '#fde3cf',
}

const barAvatar: CSSProperties = {
  color: '#fff',
  backgroundColor: '#87d068',
}
const base = {
  content: '请输入你的问题',
  placement: 'start',
  avatar: {
    icon: h(UserOutlined),
    style: fooAvatar,
  },
}
const bubble = ref<any>([base])

const reset = () => (bubble.value = [base])

const change = (v) => {
  value.value = v
}

const cancel = () => {
  loading.value = false
  message.error('Cancel sending!')
}
</script>

<template>
  <Flex
    class="w-480px m-10 h-[calc(100%-20px)] overflow-auto"
    vertical
    gap="middle"
  >
    <div class="flex-1 overflow-auto">
      <Bubble
        v-for="(item, index) in bubble"
        :key="index"
        class="mb-15px"
        :avatar="item.avatar"
        :content="item.content"
        :placement="item.placement"
      ></Bubble>
    </div>
    <div class="h-300px">
      <Sender
        :value="value"
        :loading="loading"
        @change="change"
        @cancel="cancel"
        @submit="submit"
      ></Sender>
    </div>
  </Flex>
</template>
