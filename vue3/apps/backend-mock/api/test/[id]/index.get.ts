import { mockData } from "../mockTestData";

export default defineEventHandler(event => {
    const id=getRouterParam(event,'id')
    const data = mockData.find(item => item.id === Number(id));
     return useResponseSuccess(data);
});