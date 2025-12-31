<template>
  <div class="work-order-list">
    <h1>Work Orders</h1>
    
    <!-- Loading state -->
    <div v-if="loading" class="status-message">Loading work orders…</div>

    <!-- Error state -->
    <div v-else-if="error" class="error-message">
      <p>❌ Error: {{ error }}</p>
      <button @click="fetchWorkOrders">Retry</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="workOrders.length === 0" class="empty-message">
      <p>No work orders found. Create your first work order!</p>
    </div>

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
import { supabase } from '@/supabaseClient' // adjust this path if your Supabase client lives elsewhere

// reactive state
const workOrders = ref([])
const loading = ref(true)
const error = ref(null)

// fetch data from Supabase
const fetchWorkOrders = async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('work_orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Error fetching work orders:', fetchError)
      error.value = fetchError.message
    } else {
      workOrders.value = data || []
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    error.value = 'An unexpected error occurred while loading work orders'
  } finally {
    loading.value = false
  }
}

// run on component mount
onMounted(() => {
  fetchWorkOrders()
})
</script>

<style scoped>
.work-order-list {
  padding: 20px;
}

.status-message,
.error-message,
.empty-message {
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
  text-align: center;
}

.status-message {
  background-color: #e3f2fd;
  color: #1976d2;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
}

.error-message button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #c62828;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-message button:hover {
  background-color: #b71c1c;
}

.empty-message {
  background-color: #f5f5f5;
  color: #666;
}

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
