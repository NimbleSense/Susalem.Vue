import { mockData } from "./mockTestData";
import type { TestData } from "../../../../packages/types/src/testData"
export default defineEventHandler(async (event) => {
console.log(event)
    const data =await readBody<TestData>(event)
    console.log(data)
    data.id=mockData.length+1
    console.log(data)
    mockData.push(data)
    return useResponseSuccess(data);
});
