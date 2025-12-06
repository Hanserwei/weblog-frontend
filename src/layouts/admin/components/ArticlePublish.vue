<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="card"
    class="full-screen-modal"
    :style="{ width: '100vw', height: '100vh', margin: 0, borderRadius: 0 }"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <n-input
          v-model:value="formModel.title"
          type="text"
          placeholder="请输入文章标题..."
          class="font-bold text-lg flex-1 mr-5"
          maxlength="40"
          show-count
          size="large"
        />
        <n-space>
          <n-button @click="closeModal">取消</n-button>
          <n-button type="primary" :loading="publishing" @click="handlePublish">
            <template #icon>
              <n-icon><PaperPlaneOutline /></n-icon>
            </template>
            发布
          </n-button>
        </n-space>
      </div>
    </template>

    <n-spin :show="modalLoading" description="正在加载文章详情...">
      <div class="flex flex-col h-full" style="height: calc(100vh - 80px)">
        <div class="flex-1 overflow-hidden border-b border-gray-200">
          <MdEditor
            v-model="formModel.content"
            placeholder="请输入文章内容..."
            :toolbars="toolbars"
            @onUploadImg="onUploadImg"
            class="h-full"
          />
        </div>

        <div class="h-auto py-5 px-5 bg-gray-50">
          <n-form
            ref="formRef"
            :model="formModel"
            :rules="rules"
            label-placement="left"
            label-width="80px"
          >
            <n-form-item label="封面" path="cover">
              <n-upload
                list-type="image-card"
                :max="1"
                :custom-request="handleCoverUpload"
                :file-list="coverFileList"
                @update:file-list="handleCoverListUpdate"
                accept="image/*"
              >
                <div>
                  <n-icon size="30"><AddOutline /></n-icon>
                </div>
              </n-upload>
            </n-form-item>

            <n-form-item label="摘要" path="summary">
              <n-input
                v-model:value="formModel.summary"
                type="textarea"
                placeholder="请输入文章摘要（可选）"
                :autosize="{ minRows: 2, maxRows: 3 }"
              />
            </n-form-item>

            <n-grid :cols="2" :x-gap="24">
              <n-form-item-gi label="分类" path="categoryId">
                <n-select
                  v-model:value="formModel.categoryId"
                  :options="categoryOptions"
                  placeholder="---请选择---"
                  clearable
                  :loading="categoryLoading"
                />
              </n-form-item-gi>

              <n-form-item-gi label="标签" path="tags">
                <n-select
                  v-model:value="formModel.tags"
                  multiple
                  filterable
                  tag
                  placeholder="请输入标签（不存在的标签回车即可添加）"
                  :options="tagOptions"
                  :loading="tagLoading"
                  :on-search="handleTagSearch"
                  :on-create="handleTagCreate"
                />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </div>
      </div>
    </n-spin>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import {
  useMessage,
  type FormInst,
  type FormRules,
  type UploadCustomRequestOptions,
  type UploadFileInfo,
  type SelectOption,
  NSpin,
} from 'naive-ui'
import { PaperPlaneOutline, AddOutline } from '@vicons/ionicons5'
import { MdEditor, type ToolbarNames } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

// API 引入
import { publishArticle, updateArticle, findArticleDetail } from '@/api/admin/article'
import { findCategorySelectList, type SelectCategoryRspVO } from '@/api/admin/category'
import { searchTag, findTagsByIds, type SelectTagRspVO } from '@/api/admin/tag'
import { UploadFile } from '@/api/admin/file'

// Props & Emits
const props = defineProps<{
  visible: boolean
  articleId?: number | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
  (e: 'success'): void
}>()

// 状态定义
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const publishing = ref(false)
const modalLoading = ref(false)

const showModal = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})

// 表单模型接口
interface LocalFormModel {
  title: string
  content: string
  cover: string
  summary: string
  categoryId: number | null
  // 混合类型：number 代表现有标签ID，string 代表新创建的标签名
  tags: (string | number)[]
}

const formModel = reactive<LocalFormModel>({
  title: '',
  content: '',
  cover: '',
  summary: '',
  categoryId: null,
  tags: [],
})

const coverFileList = ref<UploadFileInfo[]>([])
const categoryOptions = ref<SelectOption[]>([])
const categoryLoading = ref(false)
const tagOptions = ref<SelectOption[]>([])
const tagLoading = ref(false)

// Toolbars 配置 (省略，保持不变)
const toolbars: ToolbarNames[] = [
  'bold',
  'underline',
  'italic',
  '-',
  'title',
  'strikeThrough',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'mermaid',
  'katex',
  '-',
  'revoke',
  'next',
  'save',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'htmlPreview',
  'catalog',
]

const rules: FormRules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { max: 40, message: '标题不能超过 40 个字符', trigger: 'blur' },
  ],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
  categoryId: [{ required: true, type: 'number', message: '请选择文章分类', trigger: 'change' }],
  tags: [{ required: true, type: 'array', message: '请至少选择一个标签', trigger: 'change' }],
  cover: [{ required: true, message: '请上传文章封面', trigger: 'change' }],
}

// Watchers
watch(
  () => props.visible,
  async (newVal) => {
    if (newVal) {
      if (props.articleId) {
        modalLoading.value = true
        try {
          await loadCategories()
          await fetchDetail(props.articleId)
        } finally {
          modalLoading.value = false
        }
      } else {
        resetForm()
        loadCategories()
      }
    }
  },
)

function resetForm() {
  formModel.title = ''
  formModel.content = ''
  formModel.cover = ''
  formModel.summary = ''
  formModel.categoryId = null
  formModel.tags = []
  coverFileList.value = []
  tagOptions.value = []
}

function dedupeTagOptions(list: SelectOption[]) {
  const seen = new Set<string>()
  const result: SelectOption[] = []
  list.forEach((opt) => {
    const key = String(opt.value)
    if (!seen.has(key)) {
      seen.add(key)
      result.push(opt)
    }
  })
  return result
}

// === 新增：处理新标签创建 ===
function handleTagCreate(label: string): SelectOption {
  // 返回 label 作为 value，这样 formModel.tags 里存的就是字符串
  const option = { label, value: label }
  // 保留已经选中的老标签，防止后续搜索覆盖掉展示用 label
  tagOptions.value = dedupeTagOptions([...tagOptions.value, option])
  return option
}
// ==========================

async function fetchDetail(id: number) {
  try {
    const res = await findArticleDetail({ id })
    if (res.success && res.data) {
      const data = res.data
      formModel.title = data.title || ''
      formModel.content = data.content || ''
      formModel.summary = data.summary || ''
      formModel.categoryId = data.categoryId || null
      formModel.cover = data.cover || ''

      if (data.cover) {
        coverFileList.value = [
          { id: 'cover', name: '已上传封面', status: 'finished', url: data.cover },
        ]
      } else {
        coverFileList.value = []
      }

      if (data.tagIds && data.tagIds.length > 0) {
        const tagRes = await findTagsByIds({ tagIds: data.tagIds })
        if (tagRes.success && tagRes.data) {
          const tags = tagRes.data.map((item) => ({
            label: item.name || '',
            value: item.id || 0,
          }))
          tagOptions.value = tags
          formModel.tags = data.tagIds
        } else {
          formModel.tags = data.tagIds
        }
      } else {
        formModel.tags = []
      }
    }
  } catch (e) {
    message.error('获取文章详情失败')
    console.error(e)
  }
}

async function loadCategories() {
  categoryLoading.value = true
  try {
    const res = await findCategorySelectList()
    if (res.success) {
      const list = res.data
      categoryOptions.value = list.map((item: SelectCategoryRspVO) => ({
        label: item.label,
        value: item.value,
      }))
    }
  } finally {
    categoryLoading.value = false
  }
}

async function handleTagSearch(query: string) {
  if (!query) return
  tagLoading.value = true
  try {
    const res = await searchTag({ key: query })
    if (res.success) {
      const list = res.data
      const selectedOptions = tagOptions.value.filter((opt) =>
        formModel.tags.some((tag) => tag === opt.value),
      )
      const searchedOptions = list.map((item: SelectTagRspVO) => ({
        label: item.label,
        value: item.value, // 这里是 ID (number)
      }))
      // 合并搜索结果与已选择的标签，避免已选标签因 options 变更只显示 ID
      tagOptions.value = dedupeTagOptions([...selectedOptions, ...searchedOptions])
    }
  } finally {
    tagLoading.value = false
  }
}

async function onUploadImg(files: File[], callback: (urls: string[]) => void) {
  const resUrls: string[] = []
  await Promise.all(
    files.map(async (file) => {
      try {
        const res = await UploadFile(file)
        if (res.success && res.data.url) resUrls.push(res.data.url)
        else message.error(`图片 ${file.name} 上传失败`)
      } catch (e) {
        console.error(e)
        message.error(`图片 ${file.name} 上传出错`)
      }
    }),
  )
  callback(resUrls)
}

async function handleCoverUpload(options: UploadCustomRequestOptions) {
  const { file, onFinish, onError } = options
  if (!file.file) return onError()
  try {
    const res = await UploadFile(file.file as File)
    if (res.success && res.data.url) {
      formModel.cover = res.data.url
      coverFileList.value = [
        { id: 'cover', name: 'cover.png', status: 'finished', url: res.data.url },
      ]
      onFinish()
    } else {
      onError()
    }
  } catch (e) {
    console.error(e)
    onError()
  }
}

function handleCoverListUpdate(newList: UploadFileInfo[]) {
  coverFileList.value = newList
  if (newList.length === 0) formModel.cover = ''
}

function handlePublish() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      publishing.value = true
      try {
        const baseReq = {
          ...formModel,
          categoryId: formModel.categoryId as number,
          // 此时 formModel.tags 已经是混合了 ID(number) 和 新标签名(string) 的数组
          // 直接传给后端即可
          tags: formModel.tags,
        }

        if (props.articleId) {
          await updateArticle({ ...baseReq, id: props.articleId })
          message.success('更新成功！')
        } else {
          await publishArticle(baseReq)
          message.success('发布成功！')
        }
        emit('success')
        closeModal()
      } finally {
        publishing.value = false
      }
    } else {
      message.error('请检查必填项')
    }
  })
}

function closeModal() {
  showModal.value = false
}
</script>

<style scoped>
.full-screen-modal :deep(.n-card__content) {
  padding: 0;
  display: flex;
  flex-direction: column;
}
.full-screen-modal :deep(.n-card-header) {
  padding: 10px 20px;
  border-bottom: 1px solid #eee;
}
:deep(.md-editor) {
  height: 100%;
}
</style>
