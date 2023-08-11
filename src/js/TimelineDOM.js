/* eslint-disable no-console */
export default class TimelineDOM {
  constructor() {
    this.container = null; // for container
    this.textSubmitListeners = []; /* массив для callback-а функции onClickBtns */
    this.popUpSubmitListeners = []; /* массив для callback-а функции onPopUpSubmit */
  }

  // присваиваем классу контейнер
  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  // проверка на наличие контейнера
  checkBinding() {
    if (this.container === null) {
      throw new Error('ListEditPlay not bind to DOM');
    }
  }

  // отрисовка HTML
  drawUI() {
    this.checkBinding();

    this.container.innerHTML = `
      <header class="header">
        <p>Домашнее задание к занятию "10. Geolocation, Notification, Media"</p>
        <p>Timeline</p>
      </header>
      <div class="timeline-container">
        <div class="timeline"></div>
        <form class="timeline-form">
          <input class="timeline-body-message"/>
          <div class="timeline-btns">
            <div class="timeline-btn" data-id="audio">🎙️</div>
            <div class="timeline-btn" data-id="video">🎥</div>
            <div class="timeline-btn" data-id="text" type="submit">✉</div>
          </div>
        </form>
        <form class="popup close">
          <div class="popup-container">
            <div class="popup-header">Что-то пошло не так</div>
            <div class="popup-text">
              К сожалению, нам не удалось определить ваше местоположение, 
              пожалуйста, дайте разрешение на использование геолокации, 
              либо введите координаты вручную.
            </div>
            <div class="popup-text">Широта и долгота через запятую</div>
            <input type="text" class="popup-geo"/>
            <div class="popup-buttons">
              <button class="popup-btn" data-id="popup-submit" type="submit" autofocus>ОК</button>
              <button class="popup-btn" data-id="popup-cansel" type="cancel">Отмена</button>
            </div>
          </div>
        </form>
      </div>
    `;

    this.timeline = this.container.querySelector('.timeline');
    this.timelineForm = this.container.querySelector('.timeline-form');
    this.timelineBody = this.container.querySelector('.timeline-body-message');
    // this.btns = this.container.querySelector('.timeline-btns');
    this.popUp = this.container.querySelector('.popup');
    this.popUpGeoText = this.container.querySelector('.popup-geo');

    this.btnAudio = this.container.querySelector('[data-id="audio"]');
    this.btnVideo = this.container.querySelector('[data-id="video"]');
    this.btnText = this.container.querySelector('[data-id="text"]');

    this.timelineForm.addEventListener('submit', (event) => this.onTextSubmit(event));
    this.btnText.addEventListener('click', (event) => this.onTextSubmit(event));
    this.timelineBody.addEventListener('focus', () => this.onFocusClear('timelineBody'));
    this.popUpGeoText.addEventListener('focus', () => this.onFocusClear('popUpGeoText'));

    this.popUp.addEventListener('submit', (event) => this.onPopUpSubmit(event));
  }

  /*
  *  метод для отрисовки сообщения
  *  получает объект сообщения с date, body, geo
  *  вставляет сообщение в ленту
  */
  renderMessage(message) {
    const { date, body, geo } = message;

    const messageEl = document.createElement('div');
    messageEl.classList.add('message-container');
    messageEl.innerHTML = `
      <div class="message">
        <div class="message-date">${date}</div>
        <div class="message-body">${body}</div>
        <div class="message-geo">${geo} 👁</div>
      </div>
    `;
    // this.timeline.appendChild(messageEl);
    this.timeline.prepend(messageEl);
    this.timeline.scrollTo(0, -999999);
  }

  /* callback метода onClickBtns для автоматического вызова в классе ChatControl */
  addTextSubmitListeners(callback) { this.textSubmitListeners.push(callback); }

  /*
  *  метод для отправки сообщения
  *  передаёт введённое сообщение
  *  в метод onClickBtns класса TimelineControl
  */
  onTextSubmit(e) {
    e.preventDefault();
    const body = this.timelineBody.value;
    this.timelineBody.value = '';

    this.textSubmitListeners.forEach((o) => o.call(null, body));
  }

  /* callback метода onClickBtns для автоматического вызова в классе ChatControl */
  addPopUpSubmitListeners(callback) { this.popUpSubmitListeners.push(callback); }

  /*
  *  метод для формы введения геолокации
  *  передаёт введённую вручную геолокацию
  *  в метод onPopUpSubmit класса TimelineControl
  */
  onPopUpSubmit(e) {
    e.preventDefault();
    const submitEl = e.submitter;
    const dataID = submitEl.dataset.id;
    const geoStr = this.popUpGeoText.value;
    this.popUpSubmitListeners.forEach((o) => o.call(null, { dataID, geoStr }));
  }

  /*
  *  метод для вывода сообщения в placeholder внутри input
  *  используется для вывода ошибки
  *  принимает имя переменной и текст
  */
  message(input, text) {
    this[input].placeholder = text;
  }

  /*
  *  метод для удаления текста ошибки и класса ошибки у инпута
  *  срабатывает автоматически при фокусировке инпута
  */
  onFocusClear(input) {
    this.message(input, '');
    this[input].classList.remove('error-add');
  }

  /*
  *  метод добавляет текст ошибки и класс ошибки инпута
  */
  errorInputAdd(input, text) {
    this[input].value = '';
    this.message(input, text);
    this[input].classList.add('error-add');
  }

  /*
  *  метод для открытия попапа
  */
  popupOpen() {
    this.message('popUpGeoText', '00.00000, 00.00000');
    this.popUp.classList.remove('close');
  }

  /*
  *  метод для закрытия попапа
  */
  popupClose() {
    this.onFocusClear('popUpGeoText');
    this.popUpGeoText.value = '';
    this.popUp.classList.add('close');
  }
}
