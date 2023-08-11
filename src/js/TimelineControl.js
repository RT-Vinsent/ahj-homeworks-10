/* eslint-disable no-console */
import geoValidation from './geoValidation';
import dateFormat from './dateFormat';

export default class TimelineControl {
  constructor(timelineDOM, timelineGEO, storage) {
    this.timelineDOM = timelineDOM; /* класс который управляет DOM */
    this.timelineGEO = timelineGEO; /* класс который управляет GEO */
    this.storage = storage; /* класс который управляет storage */

    this.lastMessege = {};
  }

  /*
  *  инициализация класса
  *  отрисовывает DOM
  *  прослушивает callback-и методов из других классов
  *  и проверяет заботоспособность сервера
  */
  init() {
    this.storage.init();
    this.timelineDOM.drawUI();
    this.timelineGEO.checkSupportGEO();

    this.timelineDOM.addTextSubmitListeners(this.onTextSubmit.bind(this));
    this.timelineDOM.addPopUpSubmitListeners(this.onPopUpSubmit.bind(this));

    const allItems = this.storage.getAllItems();

    for (let i = 0; i < allItems.length; i += 1) {
      this.timelineDOM.renderMessage(allItems[i]);
    }
  }

  /*
  *  обработка кнопки отправить сообщение
  */
  async onTextSubmit(body) {
    if (!body) {
      this.timelineDOM.errorInputAdd('timelineBody', 'Введите текст');
      return;
    }
    const date = dateFormat();

    const position = await this.timelineGEO.getPosition();

    if (position && position.status) {
      const { latitude, longitude } = position;
      const geo = `[${parseFloat(latitude.toFixed(5))}, ${parseFloat(longitude.toFixed(5))}]`;
      const message = { date, body, geo };
      this.storage.addItem(message);
      this.timelineDOM.renderMessage(message);
    }

    if (!position || !position.status) {
      console.log('позиция', position);
      this.lastMessege.body = body;
      this.lastMessege.date = date;
      this.timelineDOM.popupOpen();
    }
  }

  /*
  *  обработка формы с ручным вводом геолокации
  */
  async onPopUpSubmit(value) {
    const { dataID, geoStr } = value;
    if (!dataID) { return; } // если dataID нету, то заканчиваем

    /*
    *  если нажата кнопка отмена, закрываем попап
    */
    if (dataID === 'popup-cansel') {
      this.timelineDOM.popupClose();
    }

    /*
    *  если нажата кнопка ОК, то обрабатываем
    */
    if (dataID === 'popup-submit') {
      const date = dateFormat();
      /*
      *  Если строка пустая, пытаемся получить данные с браузера,
      *  если поулчилось, то разрешаем отправку сообщения
      */
      if (geoStr === '') {
        const position = await this.timelineGEO.getPosition();
        if (position) {
          const { latitude, longitude } = position;
          const geo = `[${parseFloat(latitude.toFixed(5))}, ${parseFloat(longitude.toFixed(5))}]`;
          const message = { date, body: this.lastMessege.body, geo };
          this.storage.addItem(message);
          this.timelineDOM.renderMessage(message);
          this.timelineDOM.popupClose();
          return;
        }
      }

      const geoObj = geoValidation(geoStr); // валидация введёных значений

      /*
      *  если строка не прошла валидацию, то выводим ошибку валидации
      */
      if (!geoObj) {
        this.timelineDOM.errorInputAdd('popUpGeoText', 'Неверный формат [00.00000, 00.00000]');
        return;
      }

      /*
      *  в остальных случаях отправляем сообщение
      */
      const geo = `[${geoObj.latitude.toFixed(5)}, ${geoObj.longitude.toFixed(5)}]`;
      const message = { date, body: this.lastMessege.body, geo };
      this.storage.addItem(message);
      this.timelineDOM.renderMessage(message);
      this.timelineDOM.popupClose();
    }
  }
}
