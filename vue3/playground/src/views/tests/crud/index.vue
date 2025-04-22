<template>
    <Button :style="{ margin: '10px' }" @click="showModal">新增Test数据</Button>
    <Modal v-model:open="open" title="新增Test数据" @ok="onOk">
        <Form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
            <FormItem label="Name">
                <Input v-model:value="formState.name" />
            </FormItem>
            <FormItem label="Age">
                <InputNumber v-model:value="formState.age"></InputNumber>
            </FormItem>
            <FormItem label="address">
                <Input v-model:value="formState.address" />
            </FormItem>
            <FormItem label="tags">
                <CheckboxGroup v-model:value="formState.tags">
                    <Checkbox value="Vue">Vue</Checkbox>
                    <Checkbox value="WebApi">WebApi</Checkbox>
                    <Checkbox value="WPF">WPF</Checkbox>
                    <Checkbox value="WinForm">WinForm</Checkbox>
                    <Checkbox value="UniApp">UniApp</Checkbox>
                    <Checkbox value="MAUI">MAUI</Checkbox>
                    <Checkbox value="Cloud">Cloud</Checkbox>
                </CheckboxGroup>
            </FormItem>
        </Form>
    </Modal>
    <Table :columns="columns" :data-source="data">
        <template #headerCell="{ column }">
            <template v-if="column.key === 'name'">
                <span>
                    Name
                </span>
            </template>
        </template>

        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
                <a>
                    {{ record.name }}
                </a>
            </template>
            <template v-else-if="column.key === 'tags'">
                <span>
                    <Tag v-for="tag in record.tags" :key="tag"
                        :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'">
                        {{ tag.toUpperCase() }}
                    </Tag>
                </span>
            </template>
            <template v-else-if="column.key === 'action'">
                <span>
                    <a>Update</a>
                    <Divider type="vertical" />
                    <a @click="deleteData(record.id)">Delete</a>
                    <Divider type="vertical" />
                    <a class="ant-dropdown-link">
                        More actions
                    </a>
                </span>
            </template>
        </template>

    </Table>

</template>
<script lang="ts" setup>
import type { TestData } from '@vben/types';
import { Tag, Table, Divider, Button, CheckboxGroup, Modal, Checkbox, Form, FormItem, Input, InputNumber } from 'ant-design-vue';
import { ref, onMounted } from 'vue';
import { getTestDataById, getTestDatas, deleteTestData, updateTestData, createTestData } from '#/api/tests';
const data = ref([] as TestData[])
const labelCol = { style: { width: '100px' } };
const wrapperCol = { span: 16 };
const formState = ref<TestData>({
    id: 0,
    name: '',
    age: 0,
    address: '',
    tags: [],
})
const open = ref<boolean>(false)
    const columns = [
    {
        name: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
    },
    {
        title: 'Action',
        key: 'action',
    },
]



const showModal = () => {
    open.value = true
}
// const onOk = async () => {
//     await createTestData(formState.value);
//     await refreshTable()
//     open.value = false
// }
// const deleteData=async(id:number)=>{
//     await deleteTestData(id);
//     await refreshTable()
// }
// const refreshTable = async () => {
//     const res = await getTestDatas();
//     data.value = [...res]
// }

// onMounted(()=>refreshTable)
</script>