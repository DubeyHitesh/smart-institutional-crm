const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  }

  // Auth endpoints
  async login(username, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: { username, password },
    });
    this.setToken(data.token);
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // User endpoints
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: userData,
    });
  }

  async updateProfile(userData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: userData,
    });
  }

  async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: userData,
    });
  }

  async deleteUser(userId) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Class endpoints
  async getClasses() {
    return this.request('/classes');
  }

  async getMyClasses() {
    return this.request('/classes/my-classes');
  }

  async createClass(classData) {
    return this.request('/classes', {
      method: 'POST',
      body: classData,
    });
  }

  async updateClass(classId, classData) {
    return this.request(`/classes/${classId}`, {
      method: 'PUT',
      body: classData,
    });
  }

  async assignTeacherToClass(classId, teacherId) {
    return this.request(`/classes/${classId}/assign-teacher`, {
      method: 'PUT',
      body: { teacherId },
    });
  }

  async addStudentToClass(classId, studentId) {
    return this.request(`/classes/${classId}/add-student`, {
      method: 'PUT',
      body: { studentId },
    });
  }

  async removeStudentFromClass(classId, studentId) {
    return this.request(`/classes/${classId}/remove-student`, {
      method: 'PUT',
      body: { studentId },
    });
  }

  async deleteClass(classId) {
    return this.request(`/classes/${classId}`, {
      method: 'DELETE',
    });
  }

  // Schedule endpoints
  async getSchedules() {
    return this.request('/schedules');
  }

  async getMySchedule() {
    return this.request('/schedules/my-schedule');
  }

  async getClassSchedule(classId) {
    return this.request(`/schedules/class/${classId}`);
  }

  async createSchedule(scheduleData) {
    return this.request('/schedules', {
      method: 'POST',
      body: scheduleData,
    });
  }

  async createWeeklySchedule(scheduleData) {
    return this.request('/schedules/create-weekly', {
      method: 'POST',
      body: scheduleData,
    });
  }

  async updateSchedule(scheduleId, scheduleData) {
    return this.request(`/schedules/${scheduleId}`, {
      method: 'PUT',
      body: scheduleData,
    });
  }

  async deleteAllSchedules() {
    return this.request('/schedules', {
      method: 'DELETE',
    });
  }

  async deleteSchedule(scheduleId) {
    return this.request(`/schedules/${scheduleId}`, {
      method: 'DELETE',
    });
  }

  async deleteNotice(noticeId) {
    return this.request(`/notices/${noticeId}`, {
      method: 'DELETE',
    });
  }

  async deleteAccount() {
    return this.request('/auth/delete-account', {
      method: 'DELETE',
    });
  }

  // Subject endpoints
  async getSubjects() {
    return this.request('/subjects');
  }

  async createSubject(subjectData) {
    return this.request('/subjects', {
      method: 'POST',
      body: subjectData,
    });
  }

  async assignTeacherToSubject(subjectId, teacherId) {
    return this.request(`/subjects/${subjectId}/assign`, {
      method: 'PUT',
      body: { teacherId },
    });
  }

  async unassignTeacherFromSubject(subjectId) {
    return this.request(`/subjects/${subjectId}/unassign`, {
      method: 'PUT',
    });
  }

  async deleteSubject(subjectId) {
    return this.request(`/subjects/${subjectId}`, {
      method: 'DELETE',
    });
  }

  // Message endpoints
  async sendMessage(messageData) {
    return this.request('/messages/send', {
      method: 'POST',
      body: messageData,
    });
  }

  async getMessages(userId) {
    return this.request(`/messages/${userId}`);
  }

  async getUnreadCounts() {
    return this.request('/messages/unread/counts');
  }

  async deleteConversation(userId) {
    return this.request(`/messages/conversation/${userId}`, {
      method: 'DELETE',
    });
  }

  async deleteSelectedMessages(messageIds) {
    return this.request('/messages/selected', {
      method: 'DELETE',
      body: { messageIds },
    });
  }

  logout() {
    this.removeToken();
  }
}

const apiService = new ApiService();
export default apiService;