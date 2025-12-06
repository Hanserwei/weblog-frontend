<template>
  <div>
    <n-card :bordered="true" class="mb-5" size="small">
      <div class="flex items-center">
        <n-text>文章标题</n-text>
        <div class="ml-3 w-52 mr-5">
          <n-input v-model:value="searchTitle" placeholder="请输入（模糊查询）" clearable />
        </div>

        <n-text>创建日期</n-text>
        <div class="ml-3 w-auto mr-5">
          <n-date-picker
            v-model:value="pickDate"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :shortcuts="rangeShortcuts"
            clearable
          />
        </div>

        <n-space>
          <n-button type="primary" class="ml-3" @click="handleSearch">
            <template #icon>
              <n-icon><Search /></n-icon>
            </template>
            查询
          </n-button>

          <n-button class="ml-3" @click="handleReset">
            <template #icon>
              <n-icon><Refresh /></n-icon>
            </template>
            重置
          </n-button>
        </n-space>
      </div>
    </n-card>

    <n-card :bordered="true" class="mb-5">
      <div class="mb-5">
        <n-button type="primary" @click="handleWriteArticle">
          <template #icon>
            <n-icon>
              <Pencil />
            </n-icon>
          </template>
          写文章
        </n-button>
      </div>
      <ArticlePublish
        v-model:visible="showPublishModal"
        @success="handlePublishSuccess"
        :articleId="updateArticleId"
      />

      <n-data-table
        :columns="columns"
        :data="tableData"
        :loading="tableLoading"
        :bordered="true"
        :striped="true"
        remote
      />

      <div class="mt-10 flex justify-center">
        <n-pagination
          v-model:page="current"
          v-model:page-size="size"
          :item-count="total"
          :page-sizes="[10, 20, 30, 50]"
          show-quick-jumper
          show-size-picker
          @update:page="handlePageChange"
          @update:page-size="handlePageSizeChange"
        />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import ArticlePublish from '@/layouts/admin/components/ArticlePublish.vue'
import { ref, h, onMounted } from 'vue'
import moment from 'moment'
import {
  NButton,
  NIcon,
  type DataTableColumns,
  NCard,
  NInput,
  NSpace,
  useMessage,
  useDialog,
  NImage,
  NDatePicker,
  NDataTable,
  NPagination,
} from 'naive-ui'
import { Search, Refresh, Pencil, Trash, CreateOutline } from '@vicons/ionicons5'
import {
  findArticlePageList,
  deleteArticle,
  type FindArticlePageListRspVO,
  type FindArticlePageListReqVO,
} from '@/api/admin/article'

// ================= 全局 Hooks =================
const message = useMessage()
const dialog = useDialog()

// ================= 状态定义 (State) =================

const showPublishModal = ref(false)
const updateArticleId = ref<number | null>(null)

// --- 搜索条件 ---
const searchTitle = ref<string>('')
const pickDate = ref<[number, number] | null>(null)

// --- 分页与表格 ---
const current = ref(1)
const total = ref(0)
const size = ref(10)
const tableData = ref<FindArticlePageListRspVO[]>([])
const tableLoading = ref(false)

// ================= 常量与配置 (Config) =================

// 日期快捷选项
const rangeShortcuts = {
  最近一周: (): [number, number] => {
    const end = moment().endOf('day').valueOf()
    const start = moment().subtract(1, 'week').startOf('day').valueOf()
    return [start, end]
  },
  最近一个月: (): [number, number] => {
    const end = moment().endOf('day').valueOf()
    const start = moment().subtract(1, 'month').startOf('day').valueOf()
    return [start, end]
  },
  最近三个月: (): [number, number] => {
    const end = moment().endOf('day').valueOf()
    const start = moment().subtract(3, 'months').startOf('day').valueOf()
    return [start, end]
  },
}

// 表格列配置
const columns: DataTableColumns<FindArticlePageListRspVO> = [
  {
    title: '封面',
    key: 'cover',
    width: 100,
    render(row) {
      if (row.cover) {
        return h(NImage, {
          src: row.cover,
          width: 120,
          height: 90,
          style: { borderRadius: '4px', objectFit: 'cover' },
          previewDisabled: false,
        })
      }
      return '无封面'
    },
  },
  {
    title: '标题',
    key: 'title',
    width: 300,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '发布时间',
    key: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    fixed: 'right',
    render(row) {
      return h(NSpace, null, {
        default: () => [
          h(
            NButton,
            {
              size: 'small',
              onClick: () => handleEdit(row),
            },
            {
              default: () => '编辑',
              icon: () => h(NIcon, null, { default: () => h(CreateOutline) }),
            },
          ),
          h(
            NButton,
            {
              type: 'error',
              size: 'small',
              onClick: () => handleDelete(row),
            },
            {
              default: () => '删除',
              icon: () => h(NIcon, null, { default: () => h(Trash) }),
            },
          ),
        ],
      })
    },
  },
]

// ================= 事件处理 (Events) =================

const handleSearch = () => {
  current.value = 1
  getTableData()
}

const handleReset = () => {
  searchTitle.value = ''
  pickDate.value = null
  current.value = 1
  getTableData()
}

const handlePageChange = (page: number) => {
  current.value = page
  getTableData()
}

const handlePageSizeChange = (pageSize: number) => {
  size.value = pageSize
  current.value = 1
  getTableData()
}

const handleWriteArticle = () => {
  updateArticleId.value = null
  showPublishModal.value = true
}

const handleEdit = (row: FindArticlePageListRspVO) => {
  if (row.id) {
    updateArticleId.value = row.id
    showPublishModal.value = true
  }
}

const handleDelete = (row: FindArticlePageListRspVO) => {
  dialog.warning({
    title: '警告',
    content: `是否确定要删除文章《${row.title}》？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      // id 可能为 undefined，增加判断
      if (!row.id) return

      try {
        const res = await deleteArticle({ id: row.id })
        if (res.success) {
          message.success('删除成功')
          getTableData()
        }
      } catch (error) {
        console.error(error)
      }
    },
  })
}

// ================= API 请求 (Functions) =================

function getTableData() {
  tableLoading.value = true

  // 1. 构造请求参数，类型严格匹配 FindArticlePageListReqVO
  const params: FindArticlePageListReqVO = {
    current: current.value,
    size: size.value,
    startDate: pickDate.value ? moment(pickDate.value[0]).format('YYYY-MM-DD') : undefined,
    endDate: pickDate.value ? moment(pickDate.value[1]).format('YYYY-MM-DD') : undefined,
    title: searchTitle.value,
  }

  findArticlePageList(params)
    .then((res) => {
      if (res.success) {
        tableData.value = res.data
        current.value = res.current
        total.value = res.total
      }
    })
    .finally(() => {
      tableLoading.value = false
    })
}

// 发布成功后的回调
const handlePublishSuccess = () => {
  // 刷新列表
  getTableData()
}

// ================= 生命周期 (Lifecycle) =================
onMounted(() => {
  getTableData()
})
</script>
