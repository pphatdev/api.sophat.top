import { VERSION } from "../db/configs/index.js"

export class Response {

    static success = (data, total = null, ...options) => {
        return {
            status: 200,
            success: true,
            version: VERSION,
            total: parseFloat(total || 0),
            result: data,
            ...options
        }
    }

    static detailSuccess = (data, ...options) => {
        return {
            status: 200,
            success: true,
            version: VERSION,
            result: data[0] || {},
            ...options
        }
    }

    static notFound = (data, ...options) => {
        return {
            status: 404,
            success: true,
            version: VERSION,
            result: data,
            ...options
        }
    }

    static insetSuccess = (...options) => {
        return {
            status: 200,
            date: this.date,
            result: options
        }
    }

    static insetFailed = (...options) => {
        return {
            status: 400,
            date: this.date,
            result: options
        }
    }

    static serverError = (message = "", ...options) => {
        return {
            status: 500,
            success: false,
            version: VERSION,
            result: message,
            ...options
        }
    }

    static authSuccess = (data, ...options) => {
        return {
            status: 200,
            success: true,
            version: VERSION,
            result: data,
            ...options
        }
    }

    static authClient = (message, ...options) => {
        return {
            status: 400,
            success: false,
            version: VERSION,
            result: message,
            ...options
        }
    }

    static unAuth = (message, ...options) => {
        return {
            status: 401,
            success: false,
            version: VERSION,
            result: message,
            ...options
        }
    }

    static invalidToken = (message, ...options) => {
        return {
            status: 403,
            success: false,
            version: VERSION,
            result: message,
            ...options
        }
    }

    static validateError = (data) => {
        let errors = {};
        data.forEach(error => {
            errors[error.path] = (()=> {
                if (!error?.message) {
                    const field = error.type.charAt(0).toUpperCase() + error.type.slice(1).toLowerCase();
                    return `${field} is ${(error?.msg)?.toLowerCase()}`
                }
                return `${error?.message.replace(/"/g, '')}`
            })();
        });

        return {
            status: 422,
            success: false,
            version: VERSION,
            result: errors
        };
    }

    static updateFailed = (message, ...options) => {
        return {
            status: 400,
            success: false,
            version: VERSION,
            result: message,
            ...options
        }
    }

    static updateSuccess = (data, ...options) => {
        return {
            status: 200,
            success: true,
            version: VERSION,
            result: data,
            ...options
        }
    }

    static deleteSuccess = (data, ...options) => {
        return {
            status: 200,
            success: true,
            version: VERSION,
            result: data,
            ...options
        }
    }

    static deleteFailed = (message, ...options) => {
        return {
            status: 400,
            success: false,
            version: VERSION,
            result: message,
            ...options
        }
    }
}