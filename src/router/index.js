// import App from '@/App.vue'
import LandingView from '@/views/LandingView.vue'
import MainView from '@/views/MainView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      path: '/main',
      name: 'main',
      component: MainView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/main/user-manuals/:id',
      name: 'detail',
      component: () => import('../views/DetailView.vue')
    },
    {
      path: '/main/user-manuals/create',
      name: 'create',
      component: () => import('../views/CreateView.vue')
    },
    {
      path: '/main/user-manuals/:id/edit',
      name: 'update',
      component: () => import('../views/EditView.vue')
    },
    {
      path: '/main/user-manuals/:id/histories',
      name: 'history',
      component: () => import('../views/HistoryView.vue')
    },
    {
      path: '/main/admin/trash',
      name: 'trash',
      component: () => import('../views/Admin/TrashView.vue')
    },
    {
      path: '/unauthenticated',
      name: 'unauthenticatedView',
      component: () => import('../views/UnauthenticatedView.vue')
    },
    {
      path: '/main/user-manuals/:id/histories/:historyId/detail',
      name: 'history_detail',
      component: () => import('../views/HistoryDetailView.vue')
    },

    {
      path: '/main/admin/manage-user',
      name: 'manage-user',
      component: () => import('../views/Admin/UserManageView.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash, // Scroll ke elemen yang sesuai dengan hash
        behavior: 'smooth' // Scroll halus
      }
    } else if (savedPosition) {
      return savedPosition // Menjaga posisi saat kembali dengan tombol browser
    } else {
      return { top: 0 } // Scroll ke atas jika tidak ada hash
    }
  }
})

export default router
