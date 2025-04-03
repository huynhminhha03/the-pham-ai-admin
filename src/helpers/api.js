
import axios from 'axios';

const HOST = process.env.REACT_APP_API_URL;

export const userApis = {
    // User management
    currentUser: '/user/current-user',
    updateCurrentUser: '/user/current-user',
    updatePassword: '/user/update-password',
    deleteCurrentUser: '/user/current-user',

    // Conversation management
    allUserConversations: '/user/conversation',
    getUserConversationById: (id) => `/user/conversation/${id}`,
    createUserConversation: '/user/conversation',
    updateUserConversation: (id) => `/user/conversation/${id}`,
    deleteUserConversation: (id) => `/user/conversation/${id}`,

    // Banner management
    allUserBanners: '/user/banner/all',
    getUserBannerById: (id) => `/user/banner/${id}`,

    // Category management
    allUserCategories: '/user/category/all',
    getUserCategoryById: (id) => `/user/category/${id}`,

    // Book management
    allUserBooks: '/user/book/all',
    getUserBookById: (id) => `/user/book/${id}`,
};

export const adminApis = {
    // User management
    allUsers: '/admin/all-user',
    getUserById: (id) => `/admin/user/${id}`,
    updateUser: (id) => `/admin/user/${id}`,
    deleteUser: (id) => `/admin/user/${id}`,
    countAllUsers: '/admin/user/count-all',

    // Conversation management
    allConversations: '/admin/all-conversation',
    getConversationById: (id) => `/admin/conversation/${id}`,
    updateConversation: (id) => `/admin/conversation/${id}`,
    deleteConversation: (id) => `/admin/conversation/${id}`,
    countAllConversations: '/admin/conversation/count-all',

    // Book management
    allBooks: '/admin/all-book',
    getBookById: (id) => `/admin/book/${id}`,
    createBook: '/admin/book',
    updateBook: (id) => `/admin/book/${id}`,
    deleteBook: (id) => `/admin/book/${id}`,
    countAllBooks: '/admin/book/count-all',

    // Banner management
    allBanners: '/admin/all-banner',
    getBannerById: (id) => `/admin/banner/${id}`,
    createBanner: '/admin/banner',
    updateBanner: (id) => `/admin/banner/${id}`,
    deleteBanner: (id) => `/admin/banner/${id}`,
    countAllBanners: '/admin/banner/count-all',


    // Category management
    allCategories: '/admin/all-category',
    getCategoryById: (id) => `/admin/category/${id}`,
    createCategory: '/admin/category',
    updateCategory: (id) => `/admin/category/${id}`,
    deleteCategory: (id) => `/admin/category/${id}`,
};

export const authApis = {
    register: '/auth/register',
    login: '/auth/login',
    verifyEmail: '/auth/verify-email',
    resetPassword: '/auth/reset-password',
    forgetPassword: '/auth/forget-password',
    changePassword: '/auth/change-password',
};

const api = axios.create({
    baseURL: HOST,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});



export const authAPI = () => {
    const token = localStorage.getItem('token');
    const instance = axios.create({
        baseURL: HOST,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    instance.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export default api;