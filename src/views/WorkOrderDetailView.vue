<template>
  <div class="work-order-detail" v-if="workOrder">
    <h1>Work Order Detail</h1>
    <p><strong>ID:</strong> {{ workOrder.id }}</p>
    <p><strong>Status:</strong> {{ workOrder.status }}</p>
    <p><strong>Summary:</strong> {{ workOrder.summary }}</p>
    <p><strong>Labour Notes:</strong> {{ workOrder.labour_notes }}</p>

    <h2>Parts</h2>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }} - {{ item.quantity }} x {{ item.unit_cost }}
      </li>
    </ul>

    <h2>Notes</h2>
    <ul>
      <li v-for="note in notes" :key="note.id">
        [{{ note.source }}] {{ note.content }}
      </li>
    </ul>

    <button v-if="workOrder.status === 'draft'" @click="startJob">Start Job</button>
    <button v-else-if="workOrder.status === 'in_progress'" @click="completeJob">Complete Job</button>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/newSupabaseClient.js'

const route = useRoute()
const router = useRouter()
const workOrder = ref(null)
const items = ref([])
const notes = ref([])

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

const startJob = async () => {
  const id = workOrder.value.id
  const { error } = await supabase
    .from('work_orders')
    .update({ status: 'in_progress' })
    .eq('id', id)
  if (!error) {
    workOrder.value.status = 'in_progress'
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
  }
}

onMounted(() => {
  fetchData()
})
</script>
