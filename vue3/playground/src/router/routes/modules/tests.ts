import type { RouteRecordRaw } from 'vue-router';
import { BasicLayout } from '#/layouts';


const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'mdi:home',
      title: 'Test',
    },
    name: 'Test',
    path: '/',
    children:[
      {
        name:'CrudTest',
        path:'/crud',
        component: () => import('#/views/tests/crud/index.vue'),
        meta: {
          affixTab: true,
          icon: 'mdi:home',
          title: 'Crud Test',
        },
      },
      {
        name:'Diagram',
        path:'/diagramtest',
        component: () => import('#/views/tests/diagramTest/index.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:area-chart',
          title: 'Diagram Test',
        },
      }
    ]
  },
];

export default routes;