export default class TimelineMemory {
  constructor(storageKey = 'TimelineMemory') {
    this.storageKey = storageKey;
    this.data = this.loadFromStorage();
  }

  init() {
    const posts = [
      { date: '04.08.2023 16:18:22', body: 'это текст сообщения 1', geo: '[51.312312, -0.12321]' },
      { date: '05.08.2023 17:19:23', body: 'это текст сообщения 2', geo: '[52.312312, -0.12321]' },
      { date: '06.08.2023 18:20:24', body: 'это текст сообщения 3', geo: '[53.312312, -0.12321]' },
      { date: '07.08.2023 19:21:25', body: 'это текст сообщения 4', geo: '[54.312312, -0.12321]' },
      { date: '08.08.2023 20:22:26', body: 'это текст сообщения 5', geo: '[55.312312, -0.12321]' },
    ];

    if (this.data.length === 0) { this.addAllItems(posts); }
  }

  loadFromStorage() {
    const storedData = localStorage.getItem(this.storageKey);
    return storedData ? JSON.parse(storedData) : [];
  }

  saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  addItem(item) {
    this.data.push(item);
    this.saveToStorage();
  }

  addAllItems(items) {
    for (let i = 0; i < items.length; i += 1) {
      this.addItem(items[i]);
    }
  }

  getAllItems() {
    return this.data;
  }

  removeItem(index) {
    if (index >= 0 && index < this.data.length) {
      this.data.splice(index, 1);
      this.saveToStorage();
    }
  }

  clear() {
    this.data = [];
    localStorage.removeItem(this.storageKey);
  }
}
