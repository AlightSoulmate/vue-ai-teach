import { ElMessage } from "element-plus";
import service from "./config";
import type { promises } from "dns";

// 3.1 get all courses
export const getAllCourses = async (Authorization: string): Promise<any> => {
	try {
		const response = await service.get("/courses", {
			headers: {
				Authorization,
			},
		});
		return response.data.courses;
	} catch (error: any) {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					ElMessage.error("登录状态过期，请重新登录!");
					localStorage.removeItem("user");
					break;
				case 403:
					ElMessage.error("没有权限访问");
					break;
				case 404:
					ElMessage.error("请求的资源不存在");
					break;
				case 500:
					ElMessage.error("服务器内部错误");
					break;
				default:
					ElMessage.error(`请求失败: ${error.message}`);
			}
		}
		return Promise.reject(error);
	}
}

// 3.4 add course
export const addCourse = async (Authorization: string, name: string, description: string, cno: string): Promise<any> => {
	try {
		const response = await service.post("/course", {
			Authorization,
			name,
			description,
			cno
		});
		return response.data;
	} catch (error: any) {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					ElMessage.error("登录状态过期，请重新登录!");
					localStorage.removeItem("user");
					break;
				case 403:
					ElMessage.error("没有权限访问");
					break;
				case 404:
					ElMessage.error("请求的资源不存在");
					break;
				case 500:
					ElMessage.error("服务器内部错误");
					break;
				default:
					ElMessage.error(`请求失败: ${error.message}`);
			}
		}
		return Promise.reject(error);
	}
}

// 3.5 update course
export const updateCourse = async (
	Authorization: string,
	course_id: number,
	name: string,
	description: string,
	cno: string
): Promise<any> => {
	try {
		const response = await service.put(`/course/${course_id}`, {
			Authorization,
			name,
			description,
			cno
		});
		return response.data;
	} catch (error: any) {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					ElMessage.error("登录状态过期，请重新登录!");
					localStorage.removeItem("user");
					break;
				case 403:
					ElMessage.error("没有权限访问");
					break;
				case 404:
					ElMessage.error("请求的资源不存在");
					break;
				case 500:
					ElMessage.error("服务器内部错误");
					break;
				default:
					ElMessage.error(`请求失败: ${error.message}`);
			}
		}
		return Promise.reject(error);
	}
}

// 3.12 get rate-records of all students in a course
export const getRateRecords = async (Authorization: string, courseId: number): Promise<any> => {
	try {
		const response = await service.get(`/class/ratings/${courseId}`, {
			headers: {
				Authorization,
			},
		});
		return response.data;
	} catch (error: any) {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					ElMessage.error("登录状态过期，请重新登录!");
					localStorage.removeItem("user");
					break;
				case 403:
					ElMessage.error("没有权限访问");
					break;
				case 404:
					ElMessage.error("请求的资源不存在");
					break;
				case 500:
					ElMessage.error("服务器内部错误");
					break;
				default:
					ElMessage.error(`请求失败: ${error.message}`);
			}
		}
		return Promise.reject(error);
	}
}

// 1.14 获取特定班级历史评价记录的数量和报告提交次数的数量
export const getHistoryByClass = async (Authorization: string, class_id: number): Promise<any> => {
	try {
		const response = await service.get(`/student/history/${class_id}`, {
			headers: {
				Authorization,
			},
		});
		return response.data;
	} catch (error: any) {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					ElMessage.error("登录状态过期，请重新登录!");
					localStorage.removeItem("user");
					break;
				case 403:
					ElMessage.error("没有权限访问");
					break;
				case 404:
					ElMessage.error("请求的资源不存在");
					break;
				case 500:
					ElMessage.error("服务器内部错误");
					break;
				default:
					ElMessage.error(`请求失败: ${error.message}`);
			}
		}
		return Promise.reject(error);
	}
}

//  4.4 获取指定学生的评价记录
export const getSpecificStuRatingRecords = async (Authorization: string, username: string): Promise<any> => {
	try {
		const response = await service.get(`/rating/history`, {
			params: {
				username,
			},
			headers: {
				Authorization,
			},
		});
		return response.data;
	} catch (error: any) {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					ElMessage.error("登录状态过期，请重新登录!");
					localStorage.removeItem("user");
					break;
				case 403:
					ElMessage.error("没有权限访问");
					break;
				case 404:
					ElMessage.error("请求的资源不存在");
					break;
				case 500:
					ElMessage.error("服务器内部错误");
					break;
				default:
					ElMessage.error(`请求失败: ${error.message}`);
			}
		}
		return Promise.reject(error);
	}
}

//  1.13 获取指定学生的报告记录
export const getSpecificStuEvaluateRecords = async (Authorization: string, username: string): Promise<any> => {
	try {
		const response = await service.get(`/evaluate/history/`, {
			params: {
				username,
			},
			headers: {
				Authorization,
			},
		});
		return response.data;
	} catch (error: any) {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					ElMessage.error("登录状态过期，请重新登录!");
					localStorage.removeItem("user");
					break;
				case 403:
					ElMessage.error("没有权限访问");
					break;
				case 404:
					ElMessage.error("请求的资源不存在");
					break;
				case 500:
					ElMessage.error("服务器内部错误");
					break;
				default:
					ElMessage.error(`请求失败: ${error.message}`);
			}
		}
		return Promise.reject(error);
	}
}

// 创建作业 5.1
export const createAssignment = async (
	formData: FormData,
	Authorization:string
): Promise<any> => {
	try {
		const response = await service.post(
		  `/homework`, formData, {
			headers: {
				Authorization
			},
	    });
		return response.data;
	} catch (error: any) {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					ElMessage.error("登录状态过期，请重新登录!");
					localStorage.removeItem("user");
					break;
				case 403:
					ElMessage.error("没有权限访问");
					break;
				case 404:
					ElMessage.error("请求的资源不存在");
					break;
				case 500:
					ElMessage.error("服务器内部错误");
					break;
				default:
					ElMessage.error(`请求失败: ${error.message}`);
			}
		}
		return Promise.reject(error);
	}
};

// 5.3 获取特定课程的所有已发布作业
export const getHomeworks = async(Authorization: string, courseId?: number): Promise<any> => {
	try {
		let url = '/homeworks';
		if (courseId) {
			url += `?course_id=${courseId}`;
		}
		
		const response = await service.get(url, {
			headers: { Authorization }
		});
		return response.data;
	} catch (error: any) {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					ElMessage.error("登录状态过期，请重新登录!");
					localStorage.removeItem("user");
					break;
				case 403:
					ElMessage.error("没有权限访问");
					break;
				case 404:
					ElMessage.error("请求的资源不存在");
					break;
				case 500:
					ElMessage.error("服务器内部错误");
					break;
				default:
					ElMessage.error(`请求失败: ${error.message}`);
			}
		}
		return Promise.reject(error);
	}
}
// 查看具体作业提交情况
export const getHomeworkStudents = async( Authorization : string, homeworkId : number):Promise<any>=>{
	try{
		const response= await service.get(`/homeworks/${homeworkId}` ,{
			headers:{Authorization}
		});
		return response.data;
	}catch(error:any){
		if(error.response){
			switch(error.response.status){
				case 401:
          ElMessage.error("登录状态过期，请重新登录!");
          localStorage.removeItem("user");
          break;
        case 403:
          ElMessage.error("没有权限访问");
          break;
        case 404:
          ElMessage.error("请求的资源不存在");
          break;
        case 500:
          ElMessage.error("服务器内部错误");
          break;
        default:
          ElMessage.error(`请求失败: ${error.message}`);
			}
		}
		return Promise.reject(error);
	}
	
}
//5.6教师提交需要批改的作业
export const submitHomeworkForAIReview = async (
	Authorization: string,
	submit_record_id: number
): Promise<any> => {
	try {
		const formData = new FormData();
		formData.append('submit_record_id', submit_record_id.toString());
		console.log(formData.get('submit_record_id'))
		// 发送请求
		const response = await service.post('/homework/review', formData, {
			headers: {
				Authorization
			}
		});

		return response.data;
	} catch (error: any) {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					ElMessage.error("登录状态过期，请重新登录!");
					localStorage.removeItem("user");
					break;
				case 403:
					ElMessage.error("没有权限访问");
					break;
				case 404:
					ElMessage.error("请求的资源不存在");
					break;
				case 500:
					ElMessage.error("大模型接口调用时出错");
					break;
				default:
					ElMessage.error(`请求失败: ${error.message}`);
			}
		}
		return Promise.reject(error);
	}
};

// 5.7 教师轮询特定作业批改情况
export const pollHomeworkReview = async (
	Authorization: string,
	mission_uid: string
): Promise<any> => {
	try {
		const response = await service.get('/homework/review', {
			params: {
				mission_uid
			},
			headers: {
				Authorization
			}
		});
		return response.data;
	} catch (error: any) {
		// 202状态码表示正在处理，这是正常的，需要继续轮询
		if (error.response && error.response.status === 202) {
			return {
				status: 202,
				message: "正在处理"
			};
		}
		
		if (error.response) {
			switch (error.response.status) {
				case 401:
					ElMessage.error("登录状态过期，请重新登录!");
					localStorage.removeItem("user");
					break;
				case 403:
					ElMessage.error("没有权限访问");
					break;
				case 404:
					ElMessage.error("请求的资源不存在");
					break;
				case 500:
					ElMessage.error("服务器内部错误");
					break;
				default:
					// 对于其他错误，不显示错误消息，让调用方处理
					break;
			}
		}
		return Promise.reject(error);
	}
};

// 5.8 教师将作业批量上传至ai批改
export const submitBatchHomeworkForAIReview = async (
	Authorization: string,
	submit_record_ids: number[]
): Promise<any> => {
	try {
		const formData = new FormData();
		submit_record_ids.forEach(id => {
			formData.append('submit_record_id', id.toString());
		});
		console.log(formData.get('submit_record_id'))
		const response = await service.post('/homeworks/review', formData, {
			headers: {
				Authorization,
			}
		});
		return response.data;
	} catch (error: any) {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					ElMessage.error("登录状态过期，请重新登录!");
					localStorage.removeItem("user");
					break;
				case 403:
					ElMessage.error("没有权限访问");
					break;
				case 404:
					ElMessage.error("请求的资源不存在");
					break;
				case 500:
					ElMessage.error("大模型接口调用时出错");
					break;
				default:
					ElMessage.error(`请求失败: ${error.message}`);
			}
		}
		return Promise.reject(error);
	}
};

// 5.9 教师轮询批量作业批改情况
export const pollBatchHomeworkReview = async (
	Authorization: string,
	mission_uid: string
): Promise<any> => {
	try {
		const response = await service.get('/homeworks/review', {
			params: {
				mission_uid
			},
			headers: {
				Authorization
			}
		});
		
		if (response.status === 202) {
			return {
				status: 202,
				message: "正在处理"
			};
		}
		
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.status === 202) {
			return {
				status: 202,
				message: "正在处理"
			};
		}
		
		if (error.response) {
			switch (error.response.status) {
				case 401:
					ElMessage.error("登录状态过期，请重新登录!");
					localStorage.removeItem("user");
					break;
				case 403:
					ElMessage.error("没有权限访问");
					break;
				case 404:
					ElMessage.error("请求的资源不存在");
					break;
				case 500:
					ElMessage.error("服务器内部错误");
					break;
				default:
					break;
			}
		}
		return Promise.reject(error);
	}
};

//5.10教师提交作业标准文件
export const submitHomeworkStandardFile = async (
	Authorization: string,
	file: File,
	homework_id: number
): Promise<any> => {
	try {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('homework_id', homework_id.toString());
		const response = await service.post('/homework/standard/file', formData, {
			headers: {
				Authorization,
				'Content-Type': 'multipart/form-data'
			}
		});

		return response.data;
	} catch (error: any) {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					ElMessage.error("登录状态过期，请重新登录!");
					localStorage.removeItem("user");
					break;
				case 403:
					ElMessage.error("没有权限访问");
					break;
				case 404:
					ElMessage.error("请求的资源不存在");
					break;
				case 500:
					ElMessage.error("大模型接口调用时出错");
					break;
				default:
					ElMessage.error(`请求失败: ${error.message}`);
			}
		}
		return Promise.reject(error);
	}
};

