import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/supabaseClient.js'
import MainLayout from '@/layouts/MainLayout.vue'
import JobsView from '@/views/JobsView.vue'
import CalendarView from '@/views/CalendarView.vue'

const AdminView = () => import('@/views/AdminView.vue')
const AdminSettingsView = () => import('@/views/AdminSettingsView.vue')
const InvoiceEditorView = () => import('@/views/InvoiceEditorView.vue')
const CustomersView = () => import('@/views/CustomersView.vue')
const SuppliersView = () => import('@/views/SuppliersView.vue')
const ReportsView = () => import('@/views/ReportsView.vue')
const InvoicesListView = () => import('@/views/InvoicesListView.vue')
const JobArchiveView = () => import('@/views/JobArchiveView.vue')
const LoginView = () => import('@/views/LoginView.vue')

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'jobs', component: JobsView },
      { path: 'calendar', name: 'calendar', component: CalendarView },
      { path: 'customers', name: 'customers', component: CustomersView },
      { path: 'suppliers', name: 'suppliers', component: SuppliersView },
      { path: 'reports', name: 'reports', component: ReportsView },
      { path: 'invoices', name: 'invoices', component: InvoicesListView },
      { path: 'invoice/:id', name: 'invoice', component: InvoiceEditorView, props: true },
      { path: 'archive', name: 'archive', component: JobArchiveView },
      {
        path: 'admin',
        name: 'admin',
        component: AdminView
      },
      {
        path: 'admin/settings',
        name: 'admin-settings',
        component: AdminSettingsView
      },
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()

    // Check if route requires authentication
    if (to.meta.requiresAuth || to.meta.requiresAdmin) {
      if (!user) {
        // Not logged in, redirect to login
        return next('/login')
      }

      // Check if route requires admin access
      if (to.meta.requiresAdmin) {
        // Get the user's profile to check their role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError)
          alert('Error checking permissions.')
          return next('/')
        }

        // Check if user has admin role
        if (profile.role !== 'admin') {
          alert('Access denied. Admin privileges required.')
          return next('/')
        }
      }

      // User is authenticated (and admin if required), allow access
      next()
    } else if (to.meta.requiresGuest) {
      // Route is for guests only (like login page)
      if (user) {
        // Already logged in, redirect to home
        return next('/')
      }
      next()
    } else {
      // Public route, allow access
      next()
    }
  } catch (error) {
    console.error('Navigation guard error:', error)
    alert('An error occurred while checking permissions.')
    next('/login')
  }
})

export default router
