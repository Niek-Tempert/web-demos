<script setup lang="ts">
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <SidebarProvider v-if="!$route.meta.noLayout">
    <AppSidebar />
    <SidebarInset>
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger />
        </div>
      </header>
      <RouterView />
    </SidebarInset>
  </SidebarProvider>
  <RouterView v-else/>
</template>