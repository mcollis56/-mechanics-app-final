<template>
  <div class="work-order-list">
    <h1>Work Orders</h1>
    <div v-if="loading">Loading...</div>
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
            <td>{{ order.id }}</td>
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
import { supabase } from '../supabaseClient'

const workOrders = ref([])
const loading = ref(true)
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

onMounted(() => {
  fetchWorkOrders()
})
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
}
</style>
