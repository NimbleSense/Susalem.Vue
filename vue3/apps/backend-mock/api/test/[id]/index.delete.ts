import { mockData } from "../mockTestData";

export default defineEventHandler(event => {
    const id=getRouterParam(event,'id')
    const index = mockData.findIndex(item => item.id === Number(id));
    mockData.splice(index, 1)
     return useResponseSuccess(true);
});