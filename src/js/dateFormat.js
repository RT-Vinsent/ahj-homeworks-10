export default function dateFormat() {
  const dateObj = new Date();
  const date = dateObj.toLocaleDateString();
  const time = dateObj.toLocaleTimeString();

  return `${date} ${time}`;
}
