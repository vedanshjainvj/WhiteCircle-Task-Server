import dotenv from "dotenv"

// ----------------------------------- Initilization of .env file -------------------------------------------
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://whitecircle.vedanshjain.me"
];

export const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            console.log(origin)
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    "Access-Control-Allow-Origin": "*",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'withCredentials']
};

dotenv.config();

export const envProvider = {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
    NODE_ENV: process.env.NODE_ENV
}

export const baseOptionsforDynamicOptions = {
    discriminatorKey: "optionstype",
    collection: "dynamicOptionsModel",
    timestamps: true
}
