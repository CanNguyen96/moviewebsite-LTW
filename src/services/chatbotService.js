import axiosInstance from '../utils/axiosConfig';

export const chatbotService = {
    sendMessage: async (message, history = []) => {
        const response = await axiosInstance.post('/chatbot/chat', {
            message,
            history
        });
        return response.data;
    }
};
