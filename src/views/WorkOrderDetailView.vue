<template>
  <div class="min-h-screen bg-gray-50 p-6" v-if="workOrder">
    <div class="max-w-4xl mx-auto">
      <!-- Work Order Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">Work Order Detail</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">ID</p>
            <p class="text-lg font-semibold text-gray-800">{{ workOrder.id }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Status</p>
            <p class="text-lg font-semibold" :class="{
              'text-yellow-600': workOrder.status === 'draft',
              'text-blue-600': workOrder.status === 'in_progress',
              'text-green-600': workOrder.status === 'completed'
            }">{{ workOrder.status }}</p>
          </div>
          <div class="md:col-span-2">
            <p class="text-sm text-gray-600">Summary</p>
            <p class="text-lg text-gray-800">{{ workOrder.summary }}</p>
          </div>
          <div class="md:col-span-2">
            <p class="text-sm text-gray-600">Labour Notes</p>
            <p class="text-lg text-gray-800">{{ workOrder.labour_notes }}</p>
          </div>
        </div>
      </div>

      <!-- Parts Section -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Parts</h2>
        
        <!-- Existing Parts List -->
        <div v-if="items.length > 0" class="mb-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in items" :key="item.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${{ parseFloat(item.unit_cost).toFixed(2) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.quantity }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${{ (parseFloat(item.unit_cost) * item.quantity).toFixed(2) }}</td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50">
                <tr>
                  <td colspan="3" class="px-6 py-4 text-right text-sm font-bold text-gray-700">Total Parts Cost:</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${{ totalPartsСost.toFixed(2) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div v-else class="mb-6 p-4 bg-gray-50 rounded-md">
          <p class="text-gray-600 text-center">No parts added yet</p>
        </div>

        <!-- Add Part Form -->
        <div class="bg-blue-50 rounded-lg p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Add New Part</h3>
          <form @submit.prevent="addPart" class="space-y-4">
            <div>
              <label for="partName" class="block text-sm font-medium text-gray-700 mb-1">
                Part Name <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="partName"
                v-model="newPart.name"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter part name"
              />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="unitCost" class="block text-sm font-medium text-gray-700 mb-1">
                  Unit Cost <span class="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  id="unitCost"
                  v-model.number="newPart.unit_cost"
                  step="0.01"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1">
                  Quantity <span class="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  id="quantity"
                  v-model.number="newPart.quantity"
                  min="1"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1"
                />
              </div>
            </div>
            
            <div class="flex justify-end">
              <button 
                type="submit"
                :disabled="isSubmitting"
                class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="!isSubmitting">Add Part</span>
                <span v-else>Adding...</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Notes Section -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Notes</h2>
        <ul v-if="notes.length > 0" class="space-y-2">
          <li v-for="note in notes" :key="note.id" class="p-3 bg-gray-50 rounded-md">
            <span class="inline-block px-2 py-1 text-xs font-semibold rounded-full mr-2"
                  :class="note.source === 'ai' ? 'bg-purple-200 text-purple-800' : 'bg-green-200 text-green-800'">
              {{ note.source }}
            </span>
            <span class="text-gray-700">{{ note.content }}</span>
          </li>
        </ul>
        <p v-else class="text-gray-600 text-center p-4 bg-gray-50 rounded-md">No notes available</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4">
        <button 
          v-if="workOrder.status === 'draft'" 
          @click="startJob"
          class="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          Start Job
        </button>
        <button 
          v-else-if="workOrder.status === 'in_progress'" 
          @click="completeJob"
          class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Complete Job
        </button>
      </div>
    </div>
  </div>
  <div v-else class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-lg text-gray-600">Loading...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'

const route = useRoute()
const router = useRouter()
const workOrder = ref(null)
const items = ref([])
const notes = ref([])
const isSubmitting = ref(false)

// Form data for new part
const newPart = ref({
  name: '',
  unit_cost: null,
  quantity: null
})

// Computed property for total parts cost
const totalPartsСost = computed(() => {
  return items.value.reduce((total, item) => {
    return total + (parseFloat(item.unit_cost) * item.quantity)
  }, 0)
})

const fetchData = async () => {
  const id = route.params.id
  const { data: orderData, error: orderError } = await supabase
    .from('work_orders')
    .select('*')
    .eq('id', id)
    .single()
  if (!orderError) {
    workOrder.value = orderData
  }
  const { data: itemsData } = await supabase
    .from('work_order_items')
    .select('*')
    .eq('work_order_id', id)
  items.value = itemsData || []
  const { data: notesData } = await supabase
    .from('job_notes')
    .select('*')
    .eq('work_order_id', id)
  notes.value = notesData || []
}

const addPart = async () => {
  // Validation
  if (!newPart.value.name || newPart.value.name.trim() === '') {
    window.alert('Part name is required and cannot be empty')
    return
  }

  if (!newPart.value.quantity || newPart.value.quantity <= 0) {
    window.alert('Quantity must be a positive number')
    return
  }

  if (newPart.value.unit_cost === null || newPart.value.unit_cost === undefined || newPart.value.unit_cost < 0) {
    window.alert('Unit cost must be a valid number')
    return
  }

  isSubmitting.value = true

  try {
    // Insert new part into work_order_items table
    const { data, error } = await supabase
      .from('work_order_items')
      .insert({
        work_order_id: route.params.id,
        name: newPart.value.name.trim(),
        unit_cost: newPart.value.unit_cost,
        quantity: newPart.value.quantity
      })
      .select()

    if (error) {
      window.alert(`Error adding part: ${error.message}`)
      return
    }

    // Reset form
    newPart.value = {
      name: '',
      unit_cost: null,
      quantity: null
    }

    // Refresh the parts list
    await fetchData()

  } catch (error) {
    window.alert(`Unexpected error: ${error.message}`)
  } finally {
    isSubmitting.value = false
  }
}

const startJob = async () => {
  const id = workOrder.value.id
  const { error } = await supabase
    .from('work_orders')
    .update({ status: 'in_progress' })
    .eq('id', id)
  if (!error) {
    workOrder.value.status = 'in_progress'
  } else {
    window.alert(`Error starting job: ${error.message}`)
  }
}

const completeJob = async () => {
  const id = workOrder.value.id
  const { error } = await supabase
    .from('work_orders')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', id)
  if (!error) {
    workOrder.value.status = 'completed'
  } else {
    window.alert(`Error completing job: ${error.message}`)
  }
}

onMounted(() => {
  fetchData()
})
</script>
