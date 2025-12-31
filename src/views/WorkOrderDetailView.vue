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
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${{ totalPartsCost.toFixed(2) }}</td>
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
            <!-- Searchable Part Dropdown -->
            <div class="relative">
              <label for="partSearch" class="block text-sm font-medium text-gray-700 mb-1">
                Part Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="partSearch"
                v-model="partSearchQuery"
                @input="searchInventory"
                @focus="showDropdown = true"
                @blur="handleBlur"
                autocomplete="off"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search for a part..."
              />

              <!-- Loading indicator -->
              <div v-if="isSearching" class="absolute right-3 top-9">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>

              <!-- Dropdown Results -->
              <div
                v-if="showDropdown && (inventoryResults.length > 0 || partSearchQuery.length >= 2)"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                <div v-if="inventoryResults.length === 0 && partSearchQuery.length >= 2 && !isSearching" class="px-4 py-3 text-sm text-gray-500">
                  No parts found matching "{{ partSearchQuery }}"
                </div>
                <div
                  v-for="invItem in inventoryResults"
                  :key="invItem.id"
                  @mousedown.prevent="selectPart(invItem)"
                  class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ invItem.description }}</p>
                      <p v-if="invItem.part_number" class="text-xs text-gray-500">Part #: {{ invItem.part_number }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-semibold text-green-600">${{ formatPrice(invItem.unit_price) }}</p>
                      <p class="text-xs text-gray-500">Qty: {{ invItem.quantity ?? 0 }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Selected Part Info -->
            <div v-if="selectedInventoryItem" class="bg-green-50 border border-green-200 rounded-md p-3">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-sm font-medium text-green-800">Selected: {{ selectedInventoryItem.description }}</p>
                  <p v-if="selectedInventoryItem.part_number" class="text-xs text-green-600">Part #: {{ selectedInventoryItem.part_number }}</p>
                </div>
                <button
                  type="button"
                  @click="clearSelectedPart"
                  class="text-green-600 hover:text-green-800"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
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

// Inventory search state
const partSearchQuery = ref('')
const inventoryResults = ref([])
const isSearching = ref(false)
const showDropdown = ref(false)
const selectedInventoryItem = ref(null)
let searchTimeout = null

// Form data for new part
const newPart = ref({
  name: '',
  unit_cost: null,
  quantity: null
})

// Computed property for total parts cost
const totalPartsCost = computed(() => {
  return items.value.reduce((total, item) => {
    return total + (parseFloat(item.unit_cost) * item.quantity)
  }, 0)
})

const formatPrice = (price) => {
  if (price == null) return '0.00'
  return parseFloat(price).toFixed(2)
}

const searchInventory = () => {
  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  // Don't search if query is too short
  if (partSearchQuery.value.length < 2) {
    inventoryResults.value = []
    return
  }

  // Debounce the search
  searchTimeout = setTimeout(async () => {
    isSearching.value = true
    try {
      const query = partSearchQuery.value.toLowerCase()

      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .or(`description.ilike.%${query}%,part_number.ilike.%${query}%`)
        .order('description', { ascending: true })
        .limit(10)

      if (error) {
        console.error('Error searching inventory:', error)
        inventoryResults.value = []
      } else {
        inventoryResults.value = data || []
      }
    } catch (err) {
      console.error('Search error:', err)
      inventoryResults.value = []
    } finally {
      isSearching.value = false
    }
  }, 300)
}

const selectPart = (invItem) => {
  selectedInventoryItem.value = invItem
  partSearchQuery.value = invItem.description
  newPart.value.name = invItem.description
  newPart.value.unit_cost = invItem.unit_price || 0
  showDropdown.value = false
  inventoryResults.value = []
}

const clearSelectedPart = () => {
  selectedInventoryItem.value = null
  partSearchQuery.value = ''
  newPart.value.name = ''
  newPart.value.unit_cost = null
}

const handleBlur = () => {
  // Delay hiding dropdown to allow click events on dropdown items
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

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
    partSearchQuery.value = ''
    selectedInventoryItem.value = null
    inventoryResults.value = []

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
