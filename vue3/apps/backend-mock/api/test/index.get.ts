import { mockData } from "./mockTestData";

export default defineEventHandler(() => {
    return useResponseSuccess(mockData);
});
