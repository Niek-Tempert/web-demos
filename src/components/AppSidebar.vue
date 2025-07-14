<script setup lang="ts">
import { User, Shrimp, Brush } from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "About me",
    url: "/",
    icon: User,
  },
  {
    title: "Rust Demo",
    url: "/rust",
    icon: Shrimp,
    external: true
  },
  {
    title: "Artstation",
    url: "https://www.artstation.com/niektempert",
    icon: Brush,
    external: true
  }
];
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <SidebarMenuButton asChild>
                <RouterLink :to="item.url" v-if="!item.external">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </RouterLink>
                <a :href="item.url" target="_blank" v-else>
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>