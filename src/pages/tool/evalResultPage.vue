<template>
	<div class="eval-container">
		<!-- 添加 v-loading 指令显示加载状态 -->
		<el-loading v-if="loading" />

		<template v-else>
			<!-- 用户信息和下载区域 -->
			<div class="user-info-section">
				<div class="user-info">
					<h3>评价报告信息</h3>
					<p>提交用户：{{ userInfo.nickname }}（{{ userInfo.username }}）</p>
					<p>所属班级：{{ userInfo.className }}</p>
				</div>
				<div class="download-section">
					<el-alert title="🚀请务必点击下载文件以持久化保存该页面信息" type="info" :closable="false" class="download-tip" />
					<el-button type="primary" @click="handleDownload">
						下载评价报告
					</el-button>
				</div>
			</div>

			<!-- 评分内容区域 -->
			<template v-if="evalData">
				<!-- 总分展示 -->
				<div class="score-overview">
					<div class="total-score">
						<h1>{{ evalData?.total_score || 0 }}</h1>
						<p>Total Score 总分</p>
					</div>
					<div class="summary-card">
						<h3>Summary 总结</h3>
						<p>{{ evalData?.summary || '暂无总结' }}</p>
					</div>
				</div>

				<!-- 修改基础信息评分卡片的数据访问 -->
				<div class="score-details">
					<el-card class="score-card">
						<template #header>
							<div class="card-header">
								<span>Basic Information 基础信息</span>
								<span class="section-score">{{ evalData?.basic_info?.basic_score || 0 }} 分</span>
							</div>
						</template>
						<div class="score-items">
							<div class="score-item">
								<span>目标对象</span>
								<el-rate v-model="evalData.basic_info.object" disabled />
							</div>
							<div class="score-item">
								<span>分类准确性</span>
								<el-rate v-model="evalData.basic_info.category" disabled />
							</div>
							<div class="score-item">
								<span>使用场景</span>
								<el-rate v-model="evalData.basic_info.using" disabled />
							</div>
							<div class="score-item">
								<span>选择理由</span>
								<el-rate v-model="evalData.basic_info.rationale" disabled />
							</div>
						</div>
						<div class="item_summary">
							<span>原因：</span>
							<span>{{ evalData.basic_info.basic_summary }}</span>
						</div>
					</el-card>

					<!-- 核心功能评分 -->
					<el-card class="score-card">
						<template #header>
							<div class="card-header">
								<span>Core Functions 核心功能</span>
								<span class="section-score">{{ evalData.core_function.core_score }} 分</span>
							</div>
						</template>
						<div class="score-items">
							<div class="score-item">
								<span>功能完整性</span>
								<el-rate v-model="evalData.core_function.function" :max="10" disabled />
							</div>
							<div class="score-item">
								<span>效果评估</span>
								<el-rate v-model="evalData.core_function.effect_evaluation" :max="10" disabled />
							</div>
							<div class="score-item">
								<span>改进建议</span>
								<el-rate v-model="evalData.core_function.recommend" :max="10" disabled />
							</div>
						</div>
						<div class="item_summary">
							<span>原因：</span>
							<span>{{ evalData.core_function.core_summary }}</span>
						</div>
					</el-card>

					<!-- 用户体验评分 -->
					<el-card class="score-card">
						<template #header>
							<div class="card-header">
								<span>User Experience 用户体验</span>
								<span class="section-score">{{ evalData.user_experience.experience_score }} 分</span>
							</div>
						</template>
						<div class="score-items">
							<div class="score-item">
								<span>操作效率</span>
								<el-rate v-model="evalData.user_experience.operation_efficiency" :max="10" disabled />
							</div>
							<div class="score-item">
								<span>错误处理</span>
								<el-rate v-model="evalData.user_experience.error_handling" :max="10" disabled />
							</div>
							<div class="score-item">
								<span>文档支持</span>
								<el-rate v-model="evalData.user_experience.document_support" :max="10" disabled />
							</div>
						</div>
						<div class="item_summary">
							<span>原因：</span>
							<span>{{ evalData.user_experience.user_summary }}</span>
						</div>
					</el-card>

					<!-- 实用价值评分 -->
					<el-card class="score-card">
						<template #header>
							<div class="card-header">
								<span>Practical Value 实用价值</span>
								<span class="section-score">{{ evalData.practical_value.practical_score }} 分</span>
							</div>
						</template>
						<div class="score-items">
							<div class="score-item">
								<span>成本效益</span>
								<el-rate v-model="evalData.practical_value.cost_effectiveness" :max="5" disabled />
							</div>
							<div class="score-item">
								<span>场景适应性</span>
								<el-rate v-model="evalData.practical_value.scenario_adaptability" :max="5" disabled />
							</div>
						</div>
						<div class="item_summary">
							<span>原因：</span>
							<span>{{ evalData.practical_value.practical_summary }}</span>
						</div>
					</el-card>

					<!-- 结论评分 -->
					<el-card class="score-card">
						<template #header>
							<div class="card-header">
								<span>Conclusion 结论</span>
								<span class="section-score">{{ evalData.conclusion.conclusion_score }} 分</span>
							</div>
						</template>
						<div class="score-items">
							<div class="score-item">
								<span>优缺点分析</span>
								<el-rate v-model="evalData.conclusion.strength_weakness" :max="10" disabled />
							</div>
							<div class="score-item">
								<span>应用场景</span>
								<el-rate v-model="evalData.conclusion.scenario" :max="10" disabled />
							</div>
						</div>
						<div class="item_summary">
							<span>原因：</span>
							<span>{{ evalData.conclusion.conclusion_summary }}</span>
						</div>
					</el-card>
				</div>
			</template>

			<!-- 加载失败提示 -->
			<el-empty v-else description="暂无评估数据" />
		</template>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useFileStreamStore } from '@/stores/useFileStreamStore'
import { useScoreStore } from '@/stores/useScoreStore'
import { ElMessage } from 'element-plus'

const scoreStore = useScoreStore()
const fileStreamStore = useFileStreamStore()
const downloading = ref(false)
const loading = ref(true) // 添加加载状态

// 用户信息
const userInfo = ref({
	nickname: 'null',
	username: 'null',
	className: 'null'
})

// 下载处理函数
const handleDownload = async () => {
	if (!evalData.value) {
		ElMessage.warning('暂无可下载的评估数据')
		return
	}

	downloading.value = true
	try {
		await fileStreamStore.downloadReport({
			userInfo: userInfo.value,
			evalData: evalData.value,
		})
		ElMessage.success('下载成功')
	} catch (error) {
		ElMessage.error('下载失败：' + error)
	} finally {
		downloading.value = false
	}
}

// 初始化时提供完整的数据结构
const evalData = ref({
	basic_info: {
		basic_score: 0,
		object: 0,
		category: 0,
		using: 0,
		rationale: 0,
		basic_summary: ""
	},
	core_function: {
		core_score: 0,
		function: 0,
		effect_evaluation: 0,
		recommend: 0,
		core_summary: ""
	},
	user_experience: {
		experience_score: 0,
		operation_efficiency: 0,
		error_handling: 0,
		document_support: 0,
		user_summary: ""
	},
	practical_value: {
		practical_score: 0,
		cost_effectiveness: 0,
		scenario_adaptability: 0,
		practical_summary: ""
	},
	conclusion: {
		conclusion_score: 0,
		strength_weakness: 0,
		scenario: 0,
		conclusion_summary: ""
	},
	total_score: 0,
	summary: ""
})

onMounted(async () => {
	loading.value = true
	try {
		let user = JSON.parse(localStorage.getItem('user') || '{}')

		userInfo.value = {
			nickname: user.nickname || "未知",
			username: user.username || "未知",
			className: user.cno || "未知",
		}

		// 等待数据加载
		await new Promise(resolve => setTimeout(resolve, 1000))
		const newData = scoreStore.evalData
		if (newData) {
			evalData.value = {
				...evalData.value, // 保留默认值
				...newData // 使用新数据覆盖
			}
		}
	} catch (error) {
		ElMessage.error('数据加载失败')
	} finally {
		loading.value = false
	}
	console.log('用户信息:', userInfo.value)
	console.log('评估数据:', evalData.value)
})
</script>

<style scoped lang="scss">
.eval-container {
	padding: 24px;
	max-width: 1200px;
	margin: 0 auto;
}

.user-info-section {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 24px;
	padding: 20px;
	background: var(--el-bg-color);
	border-radius: 8px;
	box-shadow: var(--el-box-shadow-light);

	.user-info {
		h3 {
			margin: 0 0 12px;
			color: var(--el-text-color-primary);
		}

		p {
			margin: 8px 0;
			color: var(--el-text-color-regular);
		}
	}

	.download-section {
		display: flex;
		flex-direction: column;
		gap: 12px;

		.download-tip {
			margin-bottom: 8px;
		}
	}
}

.score-overview {
	display: flex;
	gap: 24px;
	margin-bottom: 24px;

	.total-score {
		background: var(--el-color-primary);
		color: white;
		padding: 24px;
		border-radius: 8px;
		text-align: center;
		min-width: 200px;

		h1 {
			font-size: 48px;
			margin: 0;
		}

		p {
			margin: 8px 0 0;
			opacity: 0.8;
		}
	}

	.summary-card {
		flex: 1;
		background: var(--el-bg-color);
		padding: 24px;
		border-radius: 8px;
		box-shadow: var(--el-box-shadow-light);

		h3 {
			margin: 0 0 16px;
			color: var(--el-text-color-primary);
		}

		p {
			margin: 0;
			line-height: 1.6;
			color: var(--el-text-color-regular);
		}
	}
}

.score-details {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 24px;
	margin-bottom: 24px;
}

.score-card {
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.section-score {
			font-weight: bold;
			color: var(--el-color-primary);
		}
	}
}

.score-items {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.score-item {
	display: flex;
	justify-content: space-between;
	align-items: center;

	span {
		color: var(--el-text-color-regular);
	}
}

.item_summary {
	display: flex;
	margin: 5px 0 5px 0;
	margin-top:15px;
}

@media screen and (max-width: 768px) {
	.eval-container {
		padding: 16px;
	}

	.user-info-section {
		flex-direction: column;
		gap: 16px;

		.download-section {
			width: 100%;
		}
	}

	.score-overview {
		flex-direction: column;
	}

	.score-details {
		grid-template-columns: 1fr;
	}
}
</style>