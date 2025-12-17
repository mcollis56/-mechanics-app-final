<template>
  <div class="work-order-create">
    <h1>Create Work Order</h1>
    <form @submit.prevent="createWorkOrder">
      <div>
        <label for="customer">Customer</label>
        <select v-model="selectedCustomer">
          <option v-for="customer in customers" :key="customer.id" :value="customer.id">
            {{ customer.name }}
          </option>
        </select>
      </div>
      <div>
        <label for="vehicle">Vehicle</label>
        <select v-model="selectedVehicle">
          <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
            {{ vehicle.rego }} - {{ vehicle.make }} {{ vehicle.model }}
          </option>
        </select>
      </div>
      <div>
        <label for="summary">Summary</label>
        <input type="text" v-model="summary" />
      </div>
      <button type="submit">Create</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const customers = ref([])
const vehicles = ref([])
const selectedCustomer = ref('')
const selectedVehicle = ref('')
const summary = ref('')

const fetchCustomers = async () => {
  const { data, error } = await supabase.from('customers').select('*')
  if (!error) {
    customers.value = data
  }
}

const fetchVehicles = async () => {
  const { data, error } = await supabase.from('vehicles').select('*')
  if (!error) {
    vehicles.value = data
  }
}

const createWorkOrder = async () => {
  if (!selectedCustomer.value || !selectedVehicle.value || !summary.value) {
    alert('Please fill out all fields.')
    return
  }
  const { error } = await supabase.from('work_orders').insert({
    customer_id: selectedCustomer.value,
    vehicle_id: selectedVehicle.value,
    summary: summary.value,
    status: 'draft'
  })
  if (error) {
    console.error('Error creating work order:', error)
    return
  }
  router.push('/work-orders')
}

onMounted(() => {
  fetchCustomers()
  fetchVehicles()
})
</script>
