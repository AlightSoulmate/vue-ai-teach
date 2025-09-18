import { ElMessage } from "element-plus";
import service from "./config";

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