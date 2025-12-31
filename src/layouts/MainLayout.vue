<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '../supabaseClient.js';

const route = useRoute();
const router = useRouter();
const appName = import.meta.env.VITE_APP_NAME || 'Mechanic App';
const currentUser = ref(null);

const fetchCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    currentUser.value = profile;
  } catch (err) {
    console.error('Error fetching current user:', err);
  }
};

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push('/login');
  } catch (err) {
    alert(`Error logging out: ${err.message}`);
    console.error('Error logging out:', err);
  }
};

onMounted(fetchCurrentUser);
</script>

<template>
  <div class="main-layout flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
      <!-- Logo/Header -->
      <div class="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 class="text-xl font-bold text-gray-900">{{ appName }}</h1>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2">
        <RouterLink
          to="/"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="route.path === '/'
            ? 'bg-purple-50 text-purple-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Jobs Board
        </RouterLink>

        <RouterLink
          to="/work-orders"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="route.path.startsWith('/work-orders')
            ? 'bg-purple-50 text-purple-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-5 8l2 2 4-4" />
          </svg>
          Work Orders
        </RouterLink>

        <RouterLink
          to="/calendar"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="route.path === '/calendar'
            ? 'bg-purple-50 text-purple-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Calendar
        </RouterLink>

        <RouterLink
          to="/customers"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="route.path === '/customers'
            ? 'bg-purple-50 text-purple-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Customers
        </RouterLink>

        <RouterLink
          to="/vehicles"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="route.path === '/vehicles'
            ? 'bg-purple-50 text-purple-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Vehicles
        </RouterLink>

        <RouterLink
          to="/suppliers"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="route.path === '/suppliers'
            ? 'bg-purple-50 text-purple-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Suppliers
        </RouterLink>

        <RouterLink
          to="/inventory"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="route.path === '/inventory'
            ? 'bg-purple-50 text-purple-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Inventory
        </RouterLink>

        <RouterLink
          to="/invoices"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="route.path === '/invoices'
            ? 'bg-purple-50 text-purple-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Invoices
        </RouterLink>

        <RouterLink
          to="/archive"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="route.path === '/archive'
            ? 'bg-purple-50 text-purple-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          Archive
        </RouterLink>

        <RouterLink
          to="/reports"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="route.path === '/reports'
            ? 'bg-purple-50 text-purple-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Reports
        </RouterLink>

        <RouterLink
          to="/admin"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="route.path === '/admin'
            ? 'bg-purple-50 text-purple-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Admin
        </RouterLink>
      </nav>

      <!-- User Section -->
      <div class="px-4 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center flex-1 min-w-0">
            <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {{ currentUser?.email?.[0]?.toUpperCase() || 'U' }}
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-700 truncate">
                {{ currentUser?.email || 'Loading...' }}
              </p>
              <p class="text-xs text-gray-500 capitalize">
                {{ currentUser?.role || 'mechanic' }}
              </p>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Log out"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.main-layout {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
</style>
