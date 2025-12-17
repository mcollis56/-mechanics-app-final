<template>
  <div class="work-order-list">
    <h1>Work Orders</h1>
    <!-- Loading state -->
    <div v-if="loading">Loading…</div>

    <!-- Table of work orders -->
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Vehicle</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in workOrders" :key="order.id">
            <!-- Clickable ID links to detail page -->
            <td>
              <router-link :to="`/work-orders/${order.id}`">
                {{ order.id }}
              </router-link>
            </td>
            <!-- Display raw fields for now; you can replace IDs with names once you join tables -->
            <td>{{ order.customer_id }}</td>
            <td>{{ order.vehicle_id }}</td>
            <td>{{ order.status }}</td>
            <td>{{ new Date(order.created_at).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/newSupabaseClient' // adjust this path if your Supabase client lives elsewhere

// reactive state
const workOrders = ref([])
const loading = ref(true)

// fetch data from Supabase
const fetchWorkOrders = async () => {
  const { data, error } = await supabase
    .from('work_orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching work orders:', error)
  } else {
    workOrders.value = data
  }
  loading.value = false
}

// run on component mount
onMounted(() => {
  fetchWorkOrders()
})
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

/* Hover effect for better UX */
tr:hover {
  background-color: #f5f5f5;
}
</style>
