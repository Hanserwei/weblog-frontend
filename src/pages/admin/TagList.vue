<template>
  <div>
    <n-card :bordered="true" class="mb-5" size="small">
      <div class="flex items-center">
        <n-text>标签名称</n-text>
        <div class="ml-3 w-52 mr-5">
          <n-input v-model:value="searchTagName" placeholder="请输入（模糊查询）" clearable />
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
        <n-button type="primary" @click="openAddModal">
          <template #icon>
            <n-icon>
              <Add />
            </n-icon>
          </template>
          新增
        </n-button>
      </div>

      <n-data-table
        :columns="columns"
        :data="tableData"
        :loading="tableLoading"
        :bordered="true"
        :striped="true"
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

    <n-modal v-model:show="showAddModal">
      <n-card
        style="width: 600px"
        title="新增标签"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form ref="addTagFormRef" :model="addTagForm" :rules="rules">
          <n-form-item label="标签名称" path="tags">
            <n-dynamic-tags v-model:value="addTagForm.tags" :max="10" />
            <template #feedback> 输入标签名称后按回车键添加，最多添加 10 个 </template>
          </n-form-item>
        </n-form>

        <template #footer>
          <n-space justify="end">
            <n-button @click="showAddModal = false">取消</n-button>
            <n-button type="primary" :loading="btnLoading" @click="handleAddSubmit">提交</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted, reactive } from 'vue'
import moment from 'moment'
import {
  NButton,
  NIcon,
  type DataTableColumns,
  NModal,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSpace,
  NDynamicTags, // 修改点：引入 NDynamicTags
  useMessage,
  useDialog,
  type FormRules,
  type FormInst,
  type FormItemRule,
} from 'naive-ui'
import { Search, Refresh, Add, Trash } from '@vicons/ionicons5'
import { addTag, deleteTag, getTagPageList, type FindTagPageListRspVO } from '@/api/admin/tag'

// ================= 全局 Hooks =================
const message = useMessage()
const dialog = useDialog()

// ================= 状态定义 (State) =================

// --- 表格与搜索相关 ---
const searchTagName = ref<string>('')
const pickDate = ref<[number, number] | null>(null)
const current = ref(1)
const total = ref(0)
const size = ref(10)
const tableData = ref<FindTagPageListRspVO[]>([])
const tableLoading = ref(false)

// --- 新增弹窗相关 ---
const showAddModal = ref(false)
const btnLoading = ref(false)
const addTagFormRef = ref<FormInst | null>(null)

// 修改点：表单数据改为 tags 数组
const addTagForm = reactive({
  tags: [] as string[],
})

// ================= 常量与配置 (Config) =================

// 修改点：更新校验规则
const rules: FormRules = {
  tags: [
    {
      required: true,
      type: 'array',
      message: '请至少添加一个标签',
      trigger: 'change',
    },
    {
      validator: (rule: FormItemRule, value: string[]) => {
        // 校验数组中每个标签的长度
        if (value.length === 0) return true
        for (const tag of value) {
          if (tag.length > 20) {
            return new Error(`标签 "${tag}" 超过 20 个字符`)
          }
        }
        return true
      },
      trigger: 'change',
    },
  ],
}

// 日期选择快捷项
const rangeShortcuts = {
  最近一周: () => {
    const end = moment().endOf('day').valueOf()
    const start = moment().subtract(1, 'week').startOf('day').valueOf()
    return [start, end]
  },
  最近一个月: () => {
    const end = moment().endOf('day').valueOf()
    const start = moment().subtract(1, 'month').startOf('day').valueOf()
    return [start, end]
  },
  最近三个月: () => {
    const end = moment().endOf('day').valueOf()
    const start = moment().subtract(3, 'months').startOf('day').valueOf()
    return [start, end]
  },
}

// 表格列配置
const columns: DataTableColumns<FindTagPageListRspVO> = [
  {
    title: '标签名称',
    key: 'name',
    width: 180,
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h(
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
      )
    },
  },
]

// ================= 事件处理 (Events) =================

// --- 搜索 & 重置 ---
const handleSearch = () => {
  current.value = 1
  getTableData()
}

const handleReset = () => {
  searchTagName.value = ''
  pickDate.value = null
  current.value = 1
  getTableData()
}

// --- 分页处理 ---
const handlePageChange = (page: number) => {
  current.value = page
  getTableData()
}

const handlePageSizeChange = (pageSize: number) => {
  size.value = pageSize
  current.value = 1
  getTableData()
}

// --- 新增逻辑 ---
const openAddModal = () => {
  addTagForm.tags = [] // 修改点：重置为空数组
  showAddModal.value = true
}

const handleAddSubmit = (e: MouseEvent) => {
  e.preventDefault()
  addTagFormRef.value?.validate(async (errors) => {
    if (!errors) {
      btnLoading.value = true
      try {
        // 修改点：直接将 tags 数组传给后端接口
        const res = await addTag({ tags: addTagForm.tags })
        if (res.success) {
          showAddModal.value = false
          message.success('新增成功')
          getTableData()
        }
      } finally {
        btnLoading.value = false
      }
    } else {
      console.log('表单校验失败', errors)
    }
  })
}

// --- 删除逻辑 ---
const handleDelete = (row: FindTagPageListRspVO) => {
  dialog.warning({
    title: '警告',
    content: '是否确定要删除该标签？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const res = await deleteTag({ id: row.id })
      if (res.success) {
        message.success('删除成功')
        getTableData()
      }
    },
    onNegativeClick: () => {},
  })
}

// ================= API 请求 (Functions) =================

function getTableData() {
  tableLoading.value = true

  getTagPageList({
    current: current.value,
    size: size.value,
    startDate: pickDate.value ? moment(pickDate.value[0]).format('YYYY-MM-DD') : null,
    endDate: pickDate.value ? moment(pickDate.value[1]).format('YYYY-MM-DD') : null,
    name: searchTagName.value,
  })
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

// ================= 生命周期 (Lifecycle) =================
onMounted(() => {
  getTableData()
})
</script>
