import { requestClient } from '#/api/request';
import type { TestData } from '@vben/types';
export async function getTestDatas() {
    return requestClient.get<TestData[]>('/test')
}

export async function getTestDataById(id: Number) {
    return requestClient.get<TestData>(`/test/${id}`)
}

export async function createTestData(data: TestData) {
    return requestClient.post<TestData>('/test', data)
}

export async function updateTestData(id: Number, data: TestData) {
    return requestClient.put<TestData>(`/test/${id}`, data)
}

export async function deleteTestData(id: Number) {
    return requestClient.delete<boolean>(`/test/${id}`)
}

