export function formatDate(date) {
    let formatDate = new Date(date).toLocaleDateString();
    return formatDate;
}