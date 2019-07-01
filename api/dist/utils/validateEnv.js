import { cleanEnv, str } from "envalid";
function validateEnv() {
    cleanEnv(process.env, {
        MONGO_PASS: str(),
        MONGO_USER: str(),
        MONGO_DB: str(),
    });
}
export default validateEnv;
//# sourceMappingURL=validateEnv.js.map