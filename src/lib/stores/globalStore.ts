// src/lib/stores/globalStore.js
import { writable } from 'svelte/store';

// Create a writable store
export const activeUser = writable(null);
export const globalLoading = writable(false);

export function setActiveUser(user) {
	activeUser.set(user);
}

export function updateGlobalLoading(loading) {
	globalLoading.set(loading);
}

export const ROLE_ORG_ADMIN = 'admin';
