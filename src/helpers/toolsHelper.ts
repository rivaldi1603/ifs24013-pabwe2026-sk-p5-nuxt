import Swal from "sweetalert2";

export function showSuccessDialog(title: string, text?: string) {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#3085d6",
  });
}

export function showErrorDialog(title: string, text?: string) {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#d33",
  });
}

export function showConfirmDialog(title: string, text: string) {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
  });
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
