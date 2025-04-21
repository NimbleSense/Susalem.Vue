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
        name:'ApiTest',
        path:'/apitest',
        component: () => import('#/views/tests/apiTest/index.vue'),
        meta: {
          affixTab: true,
          icon: 'mdi:home',
          title: 'Api Test',
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