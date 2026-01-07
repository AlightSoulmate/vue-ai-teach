<template>
	<div class="student-detail">
		<!-- 学生基本信息卡片 -->
		<el-card class="info-card">
			<template #header>
				<div class="card-header">
					<el-avatar :size="64" :src="studentInfo.avatar">
						{{ studentInfo.name.charAt(0) }}
					</el-avatar>
					<div class="student-basic-info">
						<h2>{{ studentInfo.name }}</h2>
						<p>学号：{{ studentInfo.studentId }}</p>
					</div>
				</div>
			</template>
			<div class="info-content">
				<div class="info-item">
					<span>班级：</span>{{ studentInfo.className }}
				</div>
				<div class="info-item">
					<span>评价次数：</span>{{ ratingHistory.length }}
				</div>
				<div class="info-item">
					<span>提交报告：</span>{{ reportHistory.length }}
				</div>
			</div>
		</el-card>

		<!-- 历史评价记录 -->
		<el-card class="history-card">
			<template #header>
				<div class="section-header">
					<h3>历史评价记录</h3>
					<el-tag>共 {{ ratingHistory.length }} 条</el-tag>
				</div>
			</template>
			<el-timeline>
				<el-timeline-item v-for="rating in ratingHistory" :key="rating.id" :timestamp="rating.rate_time"
					:type="getRatingType(rating.rating)">
					<el-card class="timeline-card">
						<template #header>
							<div class="rating-header">
								<span>工具ID: {{ rating.tool_id }}</span>
								<el-rate v-model="rating.rating" disabled :colors="rateColors"></el-rate>
							</div>
						</template>
						<p class="rating-comment">{{ rating.comment }}</p>
					</el-card>
				</el-timeline-item>
			</el-timeline>
		</el-card>

		<!-- 历史报告记录 -->
		<el-card class="history-card">
			<template #header>
				<div class="section-header">
					<h3>历史报告记录</h3>
					<el-tag>共 {{ reportHistory.length }} 条</el-tag>
				</div>
			</template>
			<el-table :data="reportHistory" style="width: 100%">
				<el-table-column prop="toolid" label="工具ID" width="120" />
				<el-table-column prop="datetime" label="提交时间" width="180" />
				<el-table-column prop="content" label="报告内容">
					<template #default="scope">
						<el-button link type="primary" @click="viewReport(scope.row)">
							查看报告
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<!-- 报告详情对话框 -->
		<el-dialog v-model="dialogVisible" title="报告详情" width="50%">
			<div class="report-content">{{ currentReport.content }}</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTeacherStore } from '@/stores/useTeacherStore'

const teacherStore = useTeacherStore()

// 模拟学生基本信息
const studentInfo = ref({
	name: '张三',
	studentId: '2021001001',
	className: '软件工程2班',
	avatar: ''
})

// 模拟历史评价记录
const ratingHistory = ref([
	{
		id: 1,
		user: 'zhang_san',
		rating: 4.5,
		comment: '这个AI工具的响应速度很快，界面也很友好，但在某些专业领域的回答还不够准确。',
		rate_time: '2024-03-01 14:30:00',
		tool_id: 'T001'
	},
	{
		id: 2,
		user: 'zhang_san',
		rating: 5,
		comment: '非常好用的工具，在完成作业时帮助很大。',
		rate_time: '2024-02-28 16:20:00',
		tool_id: 'T002'
	}
])

// 模拟历史报告记录
const reportHistory = ref([
	{
		toolid: 'T001',
		datetime: '2024-03-01 15:00:00',
		content: '这是一份详细的评价报告内容...'
	},
	{
		toolid: 'T002',
		datetime: '2024-02-28 17:00:00',
		content: '另一份详细的评价报告内容...'
	}
])

// 评分颜色配置
const rateColors = ['#F56C6C', '#E6A23C', '#67C23A']

// 根据评分获取时间线类型
const getRatingType = (rating: number) => {
	if (rating >= 4) return 'success'
	if (rating >= 3) return 'warning'
	return 'danger'
}

// 报告查看相关
const dialogVisible = ref(false)
const currentReport = ref({
	content: ''
})

const viewReport = (report: any) => {
	currentReport.value = report
	dialogVisible.value = true
}
</script>

<style scoped lang="scss">
.student-detail {
	padding: 20px;
	max-width: 1200px;
	margin: 0 auto;

	.info-card {
		margin-bottom: 20px;

		.card-header {
			display: flex;
			align-items: center;
			gap: 20px;
		}

		.student-basic-info {
			h2 {
				margin: 0 0 8px 0;
			}

			p {
				margin: 0;
				color: #666;
			}
		}

		.info-content {
			display: flex;
			gap: 40px;
			margin-top: 20px;

			.info-item {
				span {
					color: #666;
					margin-right: 8px;
				}
			}
		}
	}

	.history-card {
		margin-bottom: 20px;

		.section-header {
			display: flex;
			justify-content: space-between;
			align-items: center;

			h3 {
				margin: 0;
			}
		}

		.timeline-card {
			.rating-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.rating-comment {
				margin: 10px 0 0;
				color: #666;
			}
		}
	}

	.report-content {
		max-height: 400px;
		overflow-y: auto;
		padding: 20px;
		background: #f8f9fa;
		border-radius: 4px;
	}
}
</style>