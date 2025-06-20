export enum ErrorCategory {
    Validation = "ValidationError",
    Database = "DatabaseError",
    Authentication = "AuthenticationError",
    NotFound = "NotFoundError",
    Internal = "InternalError",
    Network = "NetworkError",
    Unknown = "UnknownError"
}

export enum ErrorCode {
    UsernameTaken = "USERNAME_TAKEN",
    InvalidCredentials = "INVALID_CREDENTIALS",
    UserNotFound = "USER_NOT_FOUND",
}

export class AppError extends Error {
    public readonly code: ErrorCode;
    public readonly category: ErrorCategory;
    public readonly statusCode: number;

    constructor(
        code: ErrorCode,
        message: string,
        options?: {
            category?: ErrorCategory;
            statusCode?: number;
            cause?: Error;
        }
    ) {
        super(message);
        this.code = code;
        this.category = options?.category ?? ErrorCategory.Validation;
        this.statusCode = options?.statusCode ?? 400;
        if (options?.cause) this.cause = options.cause;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}