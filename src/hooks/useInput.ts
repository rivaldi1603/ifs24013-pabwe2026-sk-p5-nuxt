import { ref } from "vue";

export function useInput<T>(initialValue: T) {
  const value = ref<T>(initialValue);
  
  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    value.value = target.value as unknown as T;
  };
  
  return [value, onInput] as const;
}
