<template>
  <n-card :bordered="false" title="博客设置">
    <n-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-placement="left"
      label-width="120px"
      require-mark-placement="right-hanging"
      size="medium"
    >
      <n-form-item label="博客名称" path="name">
        <n-input v-model:value="formModel.name" placeholder="请输入博客名称" />
      </n-form-item>

      <n-form-item label="作者名" path="author">
        <n-input v-model:value="formModel.author" placeholder="请输入作者名" />
      </n-form-item>

      <n-form-item label="博客 LOGO" path="logo">
        <n-upload
          list-type="image-card"
          :max="1"
          :custom-request="handleLogoUpload"
          :file-list="logoFileList"
          @update:file-list="handleLogoListUpdate"
        >
          <div>
            <n-icon size="30">
              <AddOutline />
            </n-icon>
          </div>
        </n-upload>
      </n-form-item>

      <n-form-item label="作者头像" path="avatar">
        <n-upload
          list-type="image-card"
          :max="1"
          :custom-request="handleAvatarUpload"
          :file-list="avatarFileList"
          @update:file-list="handleAvatarListUpdate"
        >
          <div>
            <n-icon size="30">
              <AddOutline />
            </n-icon>
          </div>
        </n-upload>
      </n-form-item>

      <n-form-item label="介绍语" path="introduction">
        <n-input
          v-model:value="formModel.introduction"
          type="textarea"
          placeholder="请输入博客介绍语"
          :autosize="{ minRows: 3, maxRows: 5 }"
        />
      </n-form-item>

      <n-divider />

      <n-form-item label="开启 GitHub 访问">
        <n-switch v-model:value="switches.github" />
      </n-form-item>
      <n-collapse-transition :show="switches.github">
        <n-form-item label="GitHub 主页" path="githubHomepage">
          <n-input v-model:value="formModel.githubHomepage" placeholder="请输入 GitHub 主页地址" />
        </n-form-item>
      </n-collapse-transition>

      <n-form-item label="开启 Gitee 访问">
        <n-switch v-model:value="switches.gitee" />
      </n-form-item>
      <n-collapse-transition :show="switches.gitee">
        <n-form-item label="Gitee 主页" path="giteeHomepage">
          <n-input v-model:value="formModel.giteeHomepage" placeholder="请输入 Gitee 主页地址" />
        </n-form-item>
      </n-collapse-transition>

      <n-form-item label="开启知乎访问">
        <n-switch v-model:value="switches.zhihu" />
      </n-form-item>
      <n-collapse-transition :show="switches.zhihu">
        <n-form-item label="知乎主页" path="zhihuHomepage">
          <n-input v-model:value="formModel.zhihuHomepage" placeholder="请输入知乎主页地址" />
        </n-form-item>
      </n-collapse-transition>

      <n-form-item label="开启 CSDN 访问">
        <n-switch v-model:value="switches.csdn" />
      </n-form-item>
      <n-collapse-transition :show="switches.csdn">
        <n-form-item label="CSDN 主页" path="csdnHomepage">
          <n-input v-model:value="formModel.csdnHomepage" placeholder="请输入 CSDN 主页地址" />
        </n-form-item>
      </n-collapse-transition>

      <div class="flex justify-start ml-[120px]">
        <n-button type="primary" :loading="submitLoading" @click="handleSubmit"> 保存 </n-button>
      </div>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  useMessage,
  type FormInst,
  type FormRules,
  type UploadCustomRequestOptions,
  type UploadFileInfo,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NUpload,
  NIcon,
  NSwitch,
  NButton,
  NDivider,
  NCollapseTransition,
} from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'
import {
  FindBlogSettings,
  UpdateBlogSettings,
  type UpdateBlogSettingsReqVO,
} from '@/api/admin/setting'
import { UploadFile } from '@/api/admin/file'

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const submitLoading = ref(false)

// 用于回显图片的列表
const logoFileList = ref<UploadFileInfo[]>([])
const avatarFileList = ref<UploadFileInfo[]>([])

const switches = reactive({
  github: false,
  gitee: false,
  zhihu: false,
  csdn: false,
})

const formModel = ref<UpdateBlogSettingsReqVO>({
  name: '',
  author: '',
  logo: '',
  avatar: '',
  introduction: '',
  githubHomepage: '',
  giteeHomepage: '',
  zhihuHomepage: '',
  csdnHomepage: '',
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入博客名称', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者名', trigger: 'blur' }],
  logo: [{ required: true, message: '请上传博客 LOGO', trigger: 'change' }],
  avatar: [{ required: true, message: '请上传作者头像', trigger: 'change' }],
  introduction: [{ required: true, message: '请输入博客介绍语', trigger: 'blur' }],
}

onMounted(() => {
  initData()
})

async function initData() {
  try {
    const res = await FindBlogSettings()
    if (res.success && res.data) {
      const data = res.data

      formModel.value = {
        name: data.name || '',
        author: data.author || '',
        logo: data.logo || '',
        avatar: data.avatar || '',
        introduction: data.introduction || '',
        githubHomepage: data.githubHomepage || '',
        giteeHomepage: data.giteeHomepage || '',
        zhihuHomepage: data.zhihuHomepage || '',
        csdnHomepage: data.csdnHomepage || '',
      }

      // 回显图片：如果有 URL，手动构造一个 status 为 finished 的文件对象
      if (data.logo) {
        logoFileList.value = [
          {
            id: 'logo',
            name: 'logo.png',
            status: 'finished',
            url: data.logo,
          },
        ]
      }
      if (data.avatar) {
        avatarFileList.value = [
          {
            id: 'avatar',
            name: 'avatar.png',
            status: 'finished',
            url: data.avatar,
          },
        ]
      }

      switches.github = !!data.githubHomepage
      switches.gitee = !!data.giteeHomepage
      switches.zhihu = !!data.zhihuHomepage
      switches.csdn = !!data.csdnHomepage
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * 通用上传处理
 */
async function handleUpload(options: UploadCustomRequestOptions, type: 'logo' | 'avatar') {
  const { file, onFinish, onError } = options

  if (!file.file) {
    message.error('文件无效')
    onError()
    return
  }

  try {
    // 调用我们在上一步修正后的 API (内部已封装 FormData)
    const res = await UploadFile(file.file as File)

    if (res.success && res.data.url) {
      message.success('上传成功')

      // 1. 更新表单模型 (用于提交)
      formModel.value[type] = res.data.url

      // 2. 关键：更新 Upload 组件的 fileList，确保显示正常
      // 注意：customRequest 成功后，组件不会自动把服务器返回的 url 填进去，我们需要手动更新
      const newFile: UploadFileInfo = {
        id: file.id,
        name: file.name,
        status: 'finished',
        url: res.data.url, // 必须把 url 赋回去，否则预览可能出问题
      }

      if (type === 'logo') {
        logoFileList.value = [newFile]
      } else {
        avatarFileList.value = [newFile]
      }

      onFinish()
    } else {
      message.error('上传失败')
      onError()
    }
  } catch (error) {
    console.error(error)
    message.error('上传出错')
    onError()
  }
}

const handleLogoUpload = (options: UploadCustomRequestOptions) => handleUpload(options, 'logo')
const handleAvatarUpload = (options: UploadCustomRequestOptions) => handleUpload(options, 'avatar')

/**
 * 监听图片列表变化 (主要用于处理删除操作)
 * 当用户点击垃圾桶删除图片时，同步清空 formModel 中的字段
 */
const handleLogoListUpdate = (newList: UploadFileInfo[]) => {
  logoFileList.value = newList
  if (newList.length === 0) {
    formModel.value.logo = ''
  }
}

const handleAvatarListUpdate = (newList: UploadFileInfo[]) => {
  avatarFileList.value = newList
  if (newList.length === 0) {
    formModel.value.avatar = ''
  }
}

function handleSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      submitLoading.value = true

      const postData = { ...formModel.value }
      if (!switches.github) postData.githubHomepage = ''
      if (!switches.gitee) postData.giteeHomepage = ''
      if (!switches.zhihu) postData.zhihuHomepage = ''
      if (!switches.csdn) postData.csdnHomepage = ''

      try {
        const res = await UpdateBlogSettings(postData)
        if (res.success) {
          message.success('保存成功')
          initData()
        }
      } finally {
        submitLoading.value = false
      }
    } else {
      message.error('请检查必填项')
    }
  })
}
</script>
